package com.portfolio.features.integration.github.security;

import static org.junit.jupiter.api.Assertions.*;
import java.util.Base64;
import org.junit.jupiter.api.Test;

class AesGcmTokenEncryptionServiceTest {
  private static final String KEY = Base64.getEncoder().encodeToString(new byte[32]);

  @Test void encryptThenDecryptReturnsOriginalValue() {
    TokenEncryptionService service = new AesGcmTokenEncryptionService(KEY);
    assertEquals("github-token", service.decrypt(service.encrypt("github-token")));
  }

  @Test void sameTokenProducesDifferentCiphertextBecauseOfRandomIv() {
    TokenEncryptionService service = new AesGcmTokenEncryptionService(KEY);
    assertNotEquals(service.encrypt("github-token"), service.encrypt("github-token"));
  }

  @Test void invalidCiphertextFailsCleanly() {
    TokenEncryptionService service = new AesGcmTokenEncryptionService(KEY);
    TokenEncryptionException error = assertThrows(TokenEncryptionException.class, () -> service.decrypt("not-ciphertext"));
    assertEquals("GitHub connection is invalid. Please reconnect GitHub.", error.getMessage());
  }

  @Test void missingEncryptionKeyFailsClearlyWhenUsed() {
    TokenEncryptionService service = new AesGcmTokenEncryptionService("");
    assertFalse(service.isConfigured());
    assertThrows(TokenEncryptionException.class, () -> service.encrypt("github-token"));
  }
}
