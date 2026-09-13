package com.portfolio.features.resume.controller;
import com.portfolio.common.api.ApiResponse;
import com.portfolio.features.resume.dto.ResumePreviewResponse;
import com.portfolio.features.resume.service.ResumeParsingService;
import com.portfolio.features.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequiredArgsConstructor
public class ResumeParsingController {
  private final ResumeParsingService service; private final UserService users;
  @PostMapping("/api/resume/parse") public ApiResponse<ResumePreviewResponse> parse(@AuthenticationPrincipal Jwt jwt) { return ApiResponse.success("Resume analyzed. Review the preview before importing.", service.parseCurrentResume(users.synchronize(jwt))); }
}
