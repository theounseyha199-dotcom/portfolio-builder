package com.portfolio.features.ai.dto;

import com.portfolio.features.ai.model.*;

public record AiWritingResponse(String originalText, String suggestedText, AiWritingTarget target, AiWritingAction action) {}
