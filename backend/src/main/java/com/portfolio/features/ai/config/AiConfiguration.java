package com.portfolio.features.ai.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component @Getter
public class AiConfiguration {
  private final String provider;
  private final String apiKey;
  private final String model;
  private final int timeoutSeconds;
  private final int maxInputLength;

  public AiConfiguration(@Value("${AI_PROVIDER:openai}") String provider,
      @Value("${AI_API_KEY:}") String apiKey, @Value("${AI_MODEL:}") String model,
      @Value("${AI_TIMEOUT_SECONDS:15}") int timeoutSeconds,
      @Value("${AI_MAX_INPUT_LENGTH:5000}") int maxInputLength) {
    this.provider = provider; this.apiKey = apiKey; this.model = model;
    this.timeoutSeconds = Math.clamp(timeoutSeconds, 1, 20);
    this.maxInputLength = Math.clamp(maxInputLength, 5, 5000);
  }
  public boolean available() { return (provider.equals("openai") || provider.equals("gemini")) && !apiKey.isBlank() && !model.isBlank(); }
}
