package com.portfolio.features.portfolio.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePortfolioRequest(
    @NotBlank(message = "Slug is required.")
    @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Slug must use lowercase letters, numbers, and hyphens.")
    @Size(max = 100)
    String slug,

    @NotBlank(message = "Full name is required.")
    @Size(max = 255)
    @JsonAlias({"name", "fullName"})
    String fullName,

    @Size(max = 255)
    String headline,

    @Pattern(regexp = "^(minimal|developer|modern|professional|creative|student)$", message = "Template is not supported.")
    @JsonAlias({"template", "templateKey"})
    String templateKey
) {
  public CreatePortfolioRequest(String slug, String fullName, String headline) {
    this(slug, fullName, headline, "minimal");
  }
}
