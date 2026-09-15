package com.portfolio.features.asset.controller;

import com.portfolio.features.asset.repository.PortfolioAssetRepository;
import com.portfolio.features.asset.storage.StorageService;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/assets")
@RequiredArgsConstructor
public class PublicAssetController {
  private static final String PREFIX = "/api/public/assets/";
  private final StorageService storage;
  private final PortfolioAssetRepository assets;

  @GetMapping("/**")
  public ResponseEntity<InputStreamResource> get(jakarta.servlet.http.HttpServletRequest request) {
    String key = request.getRequestURI().substring(PREFIX.length());
    var asset = assets.findByObjectKey(key).orElse(null);
    if (asset == null) return ResponseEntity.notFound().build();
    try {
      InputStream stream = storage.open(key);
      MediaType type = asset.getContentType() == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(asset.getContentType());
      return ResponseEntity.ok().cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
          .contentType(type).contentLength(asset.getFileSize()).body(new InputStreamResource(stream));
    } catch (RuntimeException exception) {
      return ResponseEntity.notFound().build();
    }
  }
}
