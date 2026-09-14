package com.portfolio.features.portfolio.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
public record ThemeConfig(
 @NotNull @Pattern(regexp="^#[0-9A-Fa-f]{6}$",message="Color must be a hex value.") String primaryColor,
 @NotNull @Pattern(regexp="^#[0-9A-Fa-f]{6}$",message="Color must be a hex value.") String backgroundColor,
 @NotNull @Pattern(regexp="^#[0-9A-Fa-f]{6}$",message="Color must be a hex value.") String surfaceColor,
 @NotNull @Pattern(regexp="^#[0-9A-Fa-f]{6}$",message="Color must be a hex value.") String textColor,
 @NotNull @Pattern(regexp="^#[0-9A-Fa-f]{6}$",message="Color must be a hex value.") String mutedTextColor,
 @NotNull @Pattern(regexp="inter|geist|geist-mono|manrope|source-sans|playfair",message="Heading font is not supported.") String fontHeading,
 @NotNull @Pattern(regexp="inter|geist|geist-mono|manrope|source-sans|playfair",message="Body font is not supported.") String fontBody,
 @NotNull @Pattern(regexp="light|dark",message="Mode is not supported.") String mode,
 @NotNull @Pattern(regexp="none|small|medium|large",message="Radius is not supported.") String borderRadius,
 @NotNull @Pattern(regexp="narrow|medium|wide",message="Content width is not supported.") String contentWidth,
 @NotNull @Pattern(regexp="compact|normal|relaxed",message="Spacing is not supported.") String spacing) {}
