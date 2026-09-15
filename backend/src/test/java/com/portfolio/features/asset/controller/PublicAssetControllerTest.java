package com.portfolio.features.asset.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import com.portfolio.features.asset.entity.PortfolioAsset;
import com.portfolio.features.asset.repository.PortfolioAssetRepository;
import com.portfolio.features.asset.storage.StorageService;
import java.io.ByteArrayInputStream;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class PublicAssetControllerTest {
  private final StorageService storage = org.mockito.Mockito.mock(StorageService.class);
  private final PortfolioAssetRepository assets = org.mockito.Mockito.mock(PortfolioAssetRepository.class);
  private final PublicAssetController controller = new PublicAssetController(storage, assets);

  @Test void servesStoredImageWithItsRecordedMimeType() {
    String key = "portfolios/a/profile/photo.jpg";
    PortfolioAsset asset = new PortfolioAsset();
    asset.setObjectKey(key); asset.setContentType("image/jpeg"); asset.setFileSize(3);
    when(assets.findByObjectKey(key)).thenReturn(Optional.of(asset));
    when(storage.open(key)).thenReturn(new ByteArrayInputStream(new byte[] {1, 2, 3}));
    MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/assets/" + key);

    var response = controller.get(request);

    assertEquals(200, response.getStatusCode().value());
    assertEquals("image/jpeg", response.getHeaders().getContentType().toString());
    assertEquals("max-age=31536000, public, immutable", response.getHeaders().getCacheControl());
  }
}
