package com.portfolio.features.ai.provider;

public class AiWritingException extends RuntimeException {
  private final boolean timeout;
  public AiWritingException(boolean timeout) {
    super(timeout ? "AI request timed out. Please try again." : "AI writing assistance is currently unavailable.");
    this.timeout = timeout;
  }
  public boolean isTimeout() { return timeout; }
}
