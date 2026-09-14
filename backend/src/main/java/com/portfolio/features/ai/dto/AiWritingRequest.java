package com.portfolio.features.ai.dto;

import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.portfolio.features.ai.model.*;
import jakarta.validation.constraints.*;

public record AiWritingRequest(@NotNull AiWritingTarget target, @NotNull AiWritingAction action,
    @NotBlank @Size(max = 5000) String text) {
  @JsonAnySetter public void rejectUnknown(String name, Object value) {
    throw new IllegalArgumentException("Only target, action, and text are accepted.");
  }
}
