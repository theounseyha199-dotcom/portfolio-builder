package com.portfolio.features.asset.storage;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class PublicAssetUrlTest {
  @Test void storedKeysAlwaysMapToRelativeApplicationUrls() {
    assertEquals("/api/public/assets/portfolios/a/profile/photo.jpg", PublicAssetUrl.forKey("portfolios/a/profile/photo.jpg"));
  }

  @Test void legacyApplicationAssetUrlsBecomeRelative() {
    assertEquals("/api/public/assets/portfolios/a/profile/photo.jpg", PublicAssetUrl.relative("http://localhost:8081/api/public/assets/portfolios/a/profile/photo.jpg"));
  }

  @Test void externalProjectLinksRemainUntouched() {
    assertEquals("https://cdn.example.com/image.jpg", PublicAssetUrl.relative("https://cdn.example.com/image.jpg"));
  }
}
