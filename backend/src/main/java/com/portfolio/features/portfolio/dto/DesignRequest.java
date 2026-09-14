package com.portfolio.features.portfolio.dto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
public record DesignRequest(@NotNull @Pattern(regexp="minimal|developer|modern|professional|creative|student",message="Template is not supported.") String templateKey, @NotNull(message="Theme is required.") @Valid ThemeConfig themeConfig) {}
