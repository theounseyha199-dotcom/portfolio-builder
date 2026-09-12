package com.portfolio.features.portfolio.dto;
import jakarta.validation.constraints.*;
public record CreatePortfolioRequest(@NotBlank(message = "Slug is required.") @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must use lowercase letters, numbers, and hyphens.") @Size(max = 100) String slug, @NotBlank(message = "Full name is required.") @Size(max = 255) String fullName, @Size(max = 255) String headline) {}

