package com.portfolio.features.asset.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter @Setter
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {
  private String type = "local";
  private String localPath = "./storage";
  private long maxImageSize = 5_242_880;
  private long maxProjectImageSize = 8_388_608;
  private long maxResumeSize = 5_242_880;
  private S3 s3 = new S3();

  @Getter @Setter
  public static class S3 {
    private String endpoint;
    private String region = "us-east-1";
    private String accessKey;
    private String secretKey;
    private String bucket;
  }
}
