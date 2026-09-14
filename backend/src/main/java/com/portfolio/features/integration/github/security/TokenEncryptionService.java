package com.portfolio.features.integration.github.security;

public interface TokenEncryptionService {
  String encrypt(String value);
  String decrypt(String value);
  boolean isConfigured();
}
