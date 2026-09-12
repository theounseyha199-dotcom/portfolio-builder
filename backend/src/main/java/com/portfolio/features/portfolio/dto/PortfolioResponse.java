package com.portfolio.features.portfolio.dto;
import java.util.UUID;
public record PortfolioResponse(UUID id, String slug, String fullName, String headline, String bio, String profileImageUrl, String location, String publicEmail, String phone, String templateKey, String themeConfig, boolean published) {}

