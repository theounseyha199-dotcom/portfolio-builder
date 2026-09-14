package com.portfolio.features.integration.github.security;

public class TokenEncryptionException extends IllegalStateException {
  public TokenEncryptionException(String message) { super(message); }
  public TokenEncryptionException(String message, Throwable cause) { super(message, cause); }
}
