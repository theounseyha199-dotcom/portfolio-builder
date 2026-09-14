package com.portfolio.features.integration.github.security;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AesGcmTokenEncryptionService implements TokenEncryptionService {
  private static final String VERSION = "v1";
  private static final int IV_LENGTH = 12;
  private static final int TAG_LENGTH_BITS = 128;
  private final SecureRandom random = new SecureRandom();
  private final SecretKeySpec key;

  public AesGcmTokenEncryptionService(@Value("${app.encryption.key:}") String encodedKey) {
    if (encodedKey == null || encodedKey.isBlank()) { key = null; return; }
    try {
      byte[] decoded = Base64.getDecoder().decode(encodedKey);
      if (decoded.length != 32) throw new TokenEncryptionException("APP_ENCRYPTION_KEY must be a Base64-encoded 32-byte AES key.");
      key = new SecretKeySpec(decoded, "AES");
    } catch (IllegalArgumentException exception) {
      throw new TokenEncryptionException("APP_ENCRYPTION_KEY must be valid Base64.", exception);
    }
  }

  @Override public boolean isConfigured() { return key != null; }

  @Override public String encrypt(String value) {
    requireKey();
    try {
      byte[] iv = new byte[IV_LENGTH]; random.nextBytes(iv);
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(TAG_LENGTH_BITS, iv));
      byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
      Base64.Encoder encoder = Base64.getEncoder();
      return VERSION + ":" + encoder.encodeToString(iv) + ":" + encoder.encodeToString(encrypted);
    } catch (GeneralSecurityException exception) {
      throw new TokenEncryptionException("Unable to secure the GitHub connection.", exception);
    }
  }

  @Override public String decrypt(String value) {
    requireKey();
    try {
      String[] parts = value == null ? new String[0] : value.split(":", -1);
      if (parts.length != 3 || !VERSION.equals(parts[0])) throw new TokenEncryptionException("GitHub connection is invalid. Please reconnect GitHub.");
      byte[] iv = Base64.getDecoder().decode(parts[1]);
      if (iv.length != IV_LENGTH) throw new TokenEncryptionException("GitHub connection is invalid. Please reconnect GitHub.");
      Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
      cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(TAG_LENGTH_BITS, iv));
      return new String(cipher.doFinal(Base64.getDecoder().decode(parts[2])), StandardCharsets.UTF_8);
    } catch (TokenEncryptionException exception) {
      throw exception;
    } catch (GeneralSecurityException | IllegalArgumentException exception) {
      throw new TokenEncryptionException("GitHub connection is invalid. Please reconnect GitHub.", exception);
    }
  }

  private void requireKey() {
    if (key == null) throw new TokenEncryptionException("GitHub integration is unavailable: configure APP_ENCRYPTION_KEY with a Base64-encoded 32-byte key.");
  }
}
