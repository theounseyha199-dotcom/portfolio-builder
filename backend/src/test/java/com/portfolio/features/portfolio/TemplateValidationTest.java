package com.portfolio.features.portfolio;

import static org.assertj.core.api.Assertions.assertThat;

import com.portfolio.features.portfolio.dto.DesignRequest;
import com.portfolio.features.portfolio.dto.ThemeConfig;
import jakarta.validation.Validation;
import java.util.List;
import org.junit.jupiter.api.Test;

class TemplateValidationTest {
  private final jakarta.validation.Validator validator = Validation.buildDefaultValidatorFactory().getValidator();
  private final ThemeConfig theme = new ThemeConfig("#20419E", "#FFFFFF", "#111827", "#667085", "Inter", "light", "medium", "grid", "medium");

  @Test
  void acceptsEveryRegisteredTemplateIdentifier() {
    for (String template : List.of("minimal", "developer", "modern", "professional", "creative", "student")) {
      assertThat(validator.validate(new DesignRequest(template, theme))).isEmpty();
    }
  }

  @Test
  void rejectsUnknownTemplateIdentifier() {
    assertThat(validator.validate(new DesignRequest("arbitrary-component", theme)))
        .anyMatch(violation -> violation.getMessage().equals("Template is not supported."));
  }
}
