package com.portfolio.features.ai.controller;

import com.portfolio.common.api.ApiResponse;
import com.portfolio.features.ai.dto.*;
import com.portfolio.features.ai.provider.AiWritingException;
import com.portfolio.features.ai.service.AiWritingService;
import com.portfolio.features.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/ai/writing") @RequiredArgsConstructor
public class AiWritingController {
  private final AiWritingService writing;
  private final UserService users;
  @PostMapping("/improve") public ApiResponse<AiWritingResponse> improve(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AiWritingRequest request) {
    return ApiResponse.success("Suggestion generated.", writing.improve(users.synchronize(jwt), request));
  }
  @ExceptionHandler(AiWritingException.class) ResponseEntity<ApiResponse<Void>> unavailable(AiWritingException error) {
    return ResponseEntity.status(error.isTimeout() ? 504 : 503).body(ApiResponse.error(error.getMessage()));
  }
  @ExceptionHandler(HttpMessageNotReadableException.class) ResponseEntity<ApiResponse<Void>> invalid() {
    return ResponseEntity.badRequest().body(ApiResponse.error("Provide only a supported target, action, and text."));
  }
}
