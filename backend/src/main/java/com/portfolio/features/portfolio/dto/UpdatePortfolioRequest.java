package com.portfolio.features.portfolio.dto;
import jakarta.validation.constraints.*;
public record UpdatePortfolioRequest(@NotBlank(message = "Full name is required.") @Size(max = 255) String fullName, @Size(max = 255) String headline, String bio, @Size(max = 255) String location, @Email(message = "Public email must be valid.") String publicEmail, @Size(max = 50) String phone, @Pattern(regexp = "^(minimal|developer|modern|professional|creative|student)$", message = "Template is not supported.") String templateKey, String themeConfig) {}
