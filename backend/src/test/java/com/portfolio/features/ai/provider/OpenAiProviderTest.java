package com.portfolio.features.ai.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.features.ai.config.AiConfiguration;
import com.sun.net.httpserver.HttpServer;
import java.net.*;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.*;

class OpenAiProviderTest {
  @Test void mapsProviderFailureWithoutLeakingBody() throws Exception {
    var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    server.createContext("/", exchange -> {
      exchange.getRequestBody().readAllBytes();
      byte[] body = "private account error".getBytes(StandardCharsets.UTF_8);
      exchange.sendResponseHeaders(429, body.length); exchange.getResponseBody().write(body); exchange.close();
    });
    server.start();
    try {
      var client = new OpenAiProvider(new AiConfiguration("openai", "test-key", "test-model", 1, 5000), new ObjectMapper(), URI.create("http://127.0.0.1:" + server.getAddress().getPort()));
      assertThatThrownBy(() -> client.generate("instructions", "source")).isInstanceOf(AiWritingException.class).hasMessage("AI writing assistance is currently unavailable.");
    } finally { server.stop(0); }
  }
  @Test void mapsHttpTimeout() throws Exception {
    var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    server.createContext("/", exchange -> {
      try { Thread.sleep(1500); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
      exchange.close();
    });
    server.start();
    try {
      var client = new OpenAiProvider(new AiConfiguration("openai", "test-key", "test-model", 1, 5000), new ObjectMapper(), URI.create("http://127.0.0.1:" + server.getAddress().getPort()));
      assertThatThrownBy(() -> client.generate("instructions", "source")).isInstanceOf(AiWritingException.class).hasMessage("AI request timed out. Please try again.");
    } finally { server.stop(0); }
  }
  @Test void disabledWithoutKey() {
    assertThatThrownBy(() -> new OpenAiProvider(new AiConfiguration("openai", "", "", 15, 5000), new ObjectMapper()).generate("private", "text")).isInstanceOf(AiWritingException.class).hasMessage("AI writing assistance is currently unavailable.");
  }
  @Test void sendsBoundedPrivateRequestAndParsesText() throws Exception {
    var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    var captured = new java.util.concurrent.atomic.AtomicReference<String>();
    var auth = new java.util.concurrent.atomic.AtomicReference<String>();
    server.createContext("/responses", exchange -> {
      captured.set(new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8));
      auth.set(exchange.getRequestHeaders().getFirst("Authorization"));
      byte[] body = "{\"status\":\"completed\",\"output\":[{\"type\":\"message\",\"content\":[{\"type\":\"output_text\",\"text\":\"Improved text\"}]}]}".getBytes(StandardCharsets.UTF_8);
      exchange.sendResponseHeaders(200, body.length); exchange.getResponseBody().write(body); exchange.close();
    });
    server.start();
    try {
      var client = new OpenAiProvider(new AiConfiguration("openai", "test-key", "test-model", 2, 5000), new ObjectMapper(), URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/responses"));
      assertThat(client.generate("server instructions", "active field")).isEqualTo("Improved text");
      var request = new ObjectMapper().readTree(captured.get());
      assertThat(request.path("store").asBoolean()).isFalse();
      assertThat(request.path("input").asText()).isEqualTo("active field");
      assertThat(request.path("instructions").asText()).isEqualTo("server instructions");
      assertThat(auth.get()).isEqualTo("Bearer test-key");
    } finally { server.stop(0); }
  }
}
