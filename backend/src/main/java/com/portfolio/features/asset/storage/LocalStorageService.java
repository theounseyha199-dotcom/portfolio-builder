package com.portfolio.features.asset.storage;

import com.portfolio.features.asset.config.StorageProperties;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "local", matchIfMissing = true)
@RequiredArgsConstructor
public class LocalStorageService implements StorageService {
  private final StorageProperties props;
  public StoredFile upload(MultipartFile file, String directory) {
    try {
      String key = directory + "/" + UUID.randomUUID() + extension(file.getContentType());
      Path root = root();
      Path target = root.resolve(key).normalize();
      if (!target.startsWith(root)) throw new IllegalArgumentException("Invalid file path.");
      Files.createDirectories(target.getParent());
      file.transferTo(target);
      return new StoredFile(key, getPublicUrl(key));
    } catch (IOException e) { throw new IllegalStateException("Unable to store file."); }
  }
  public void delete(String key) {
    try { Files.deleteIfExists(resolve(key)); } catch (IOException ignored) { }
  }
  public String getPublicUrl(String key) {
    String base = props.getPublicBaseUrl() == null ? "" : props.getPublicBaseUrl().replaceAll("/+$", "");
    return base + "/api/public/assets/" + key;
  }
  private Path root() { return Paths.get(props.getLocalPath()).toAbsolutePath().normalize(); }
  private Path resolve(String key) { Path target = root().resolve(key).normalize(); if (!target.startsWith(root())) throw new IllegalArgumentException("Invalid file path."); return target; }
  private String extension(String contentType) { return switch (contentType) { case "image/jpeg" -> ".jpg"; case "image/png" -> ".png"; case "image/webp" -> ".webp"; case "application/pdf" -> ".pdf"; default -> ""; }; }
}
