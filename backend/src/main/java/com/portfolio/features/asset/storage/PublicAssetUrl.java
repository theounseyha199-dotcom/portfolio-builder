package com.portfolio.features.asset.storage;

import java.net.URI;

/** Public, environment-independent URL contract for stored assets. */
public final class PublicAssetUrl {
  private static final String PREFIX = "/api/public/assets/";

  private PublicAssetUrl() { }

  public static String forKey(String objectKey) { return PREFIX + objectKey; }

  /** Converts legacy absolute application asset URLs without changing external URLs. */
  public static String relative(String url) {
    if (url == null || url.isBlank() || url.startsWith(PREFIX)) return url;
    try {
      String path = URI.create(url).getRawPath();
      return path != null && path.startsWith(PREFIX) ? path : url;
    } catch (IllegalArgumentException ignored) { return url; }
  }
}
