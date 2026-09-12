package com.portfolio.features.user.controller;
import com.portfolio.common.api.ApiResponse; import com.portfolio.features.user.dto.UserResponse; import com.portfolio.features.user.mapper.UserMapper; import com.portfolio.features.user.service.UserService;
import lombok.RequiredArgsConstructor; import org.springframework.security.core.annotation.AuthenticationPrincipal; import org.springframework.security.oauth2.jwt.Jwt; import org.springframework.web.bind.annotation.GetMapping; import org.springframework.web.bind.annotation.RequestMapping; import org.springframework.web.bind.annotation.RestController;
@RestController @RequestMapping("/api/me") @RequiredArgsConstructor
public class MeController { private final UserService userService; private final UserMapper userMapper; @GetMapping public ApiResponse<UserResponse> me(@AuthenticationPrincipal Jwt jwt) { return ApiResponse.success("User retrieved successfully.", userMapper.toResponse(userService.synchronize(jwt))); } }

