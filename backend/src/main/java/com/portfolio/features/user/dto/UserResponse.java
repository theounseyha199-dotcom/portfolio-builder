package com.portfolio.features.user.dto;
import java.util.UUID;
public record UserResponse(UUID id, String username, String email, String displayName, String avatarUrl) {}

