package com.portfolio.features.asset.config;

import java.net.URI;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class StorageConfig {
  @Bean
  @ConditionalOnProperty(name = "app.storage.type", havingValue = "s3")
  S3Client s3Client(StorageProperties properties) {
    var s3 = properties.getS3();
    if (blank(s3.getBucket()) || blank(s3.getAccessKey()) || blank(s3.getSecretKey())) {
      throw new IllegalStateException("S3 bucket and credentials must be configured when STORAGE_TYPE=s3.");
    }
    var builder = S3Client.builder()
        .region(Region.of(s3.getRegion()))
        .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(s3.getAccessKey(), s3.getSecretKey())));
    if (!blank(s3.getEndpoint())) builder.endpointOverride(URI.create(s3.getEndpoint()));
    return builder.build();
  }
  private static boolean blank(String value) { return value == null || value.isBlank(); }
}
