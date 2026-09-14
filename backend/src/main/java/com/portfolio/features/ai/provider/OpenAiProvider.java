package com.portfolio.features.ai.provider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.features.ai.config.AiConfiguration;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class OpenAiProvider implements AiProvider {
  private final AiConfiguration config;
  private final ObjectMapper json;
  private final HttpClient client;
  private final URI endpoint;

  @org.springframework.beans.factory.annotation.Autowired
  public OpenAiProvider(AiConfiguration config, ObjectMapper json) {
    this(config, json, URI.create("https://api.openai.com/v1/responses"));
  }
  // Package-visible endpoint injection is only for local HTTP tests; users cannot choose URLs.
  OpenAiProvider(AiConfiguration config, ObjectMapper json, URI endpoint) {
    this.config = config; this.json = json; this.endpoint = endpoint;
    this.client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(config.getTimeoutSeconds()))
        .followRedirects(HttpClient.Redirect.NEVER).build();
  }

  @Override public String generate(String instructions, String text) {
    if (!config.available()) throw new AiWritingException(false);
    try {
      var body = json.writeValueAsString(Map.of("model", config.getModel(), "instructions", instructions,
          "input", text, "store", false, "max_output_tokens", 2200));
      var request = HttpRequest.newBuilder(endpoint).timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
          .header("Authorization", "Bearer " + config.getApiKey()).header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8)).build();
      var response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
      if (response.statusCode() != 200 || response.body().length() > 100000) throw new AiWritingException(false);
      var root = json.readTree(response.body());
      if (!root.path("status").asText().equals("completed") || !root.path("error").isMissingNode() && !root.path("error").isNull()) throw new AiWritingException(false);
      var output = new StringBuilder();
      for (var item : root.path("output")) {
        if (!item.path("type").asText().equals("message")) continue;
        for (var content : item.path("content")) {
          if (!content.path("type").asText().equals("output_text")) throw new AiWritingException(false);
          output.append(content.path("text").asText());
        }
      }
      return output.toString();
    } catch (HttpTimeoutException e) { throw new AiWritingException(true);
    } catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new AiWritingException(false);
    } catch (Exception e) { throw new AiWritingException(false); }
  }
}
