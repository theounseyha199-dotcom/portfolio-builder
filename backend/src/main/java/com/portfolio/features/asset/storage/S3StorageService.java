package com.portfolio.features.asset.storage;

import com.portfolio.features.asset.config.StorageProperties;
import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "s3")
@RequiredArgsConstructor
public class S3StorageService implements StorageService {
  private final StorageProperties props;
  private final S3Client client;
  public StoredFile upload(MultipartFile file, String directory) {
    String key = directory + "/" + UUID.randomUUID() + extension(file.getContentType());
    try (var input = file.getInputStream()) {
      client.putObject(PutObjectRequest.builder().bucket(props.getS3().getBucket()).key(key)
          .contentType(file.getContentType()).contentLength(file.getSize()).build(), RequestBody.fromInputStream(input, file.getSize()));
      return new StoredFile(key, getPublicUrl(key));
    } catch (IOException | RuntimeException e) { throw new IllegalStateException("Unable to store file."); }
  }
  public void delete(String key) { try { client.deleteObject(DeleteObjectRequest.builder().bucket(props.getS3().getBucket()).key(key).build()); } catch (RuntimeException ignored) { } }
  public String getPublicUrl(String key) {
    String base = props.getS3().getPublicBaseUrl();
    if (base == null || base.isBlank()) throw new IllegalStateException("S3_PUBLIC_BASE_URL must be configured for public assets.");
    return base.replaceAll("/+$", "") + "/" + key;
  }
  private String extension(String contentType) { return switch (contentType) { case "image/jpeg" -> ".jpg"; case "image/png" -> ".png"; case "image/webp" -> ".webp"; case "application/pdf" -> ".pdf"; default -> ""; }; }
}
