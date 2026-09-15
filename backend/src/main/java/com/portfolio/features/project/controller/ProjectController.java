package com.portfolio.features.project.controller;

import com.portfolio.common.api.ApiResponse;
import com.portfolio.features.asset.storage.PublicAssetUrl;
import com.portfolio.features.project.dto.ProjectRequest;
import com.portfolio.features.project.dto.ProjectResponse;
import com.portfolio.features.project.entity.Project;
import com.portfolio.features.project.service.ProjectService;
import com.portfolio.features.user.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
  private final ProjectService service;
  private final UserService users;

  private ProjectResponse response(Project project) {
    return new ProjectResponse(project.getId(), project.getTitle(), project.getSlug(), project.getShortDescription(),
        project.getDescription(), PublicAssetUrl.relative(project.getThumbnailUrl()), project.getGithubUrl(),
        project.getDemoUrl(), project.isFeatured(), project.getSortOrder(),
        project.getTechnologies().stream().map(item -> item.getTechnology()).toList());
  }

  @GetMapping public ApiResponse<List<ProjectResponse>> list(@AuthenticationPrincipal Jwt jwt) { return ApiResponse.success("Projects retrieved successfully.", service.list(users.synchronize(jwt)).stream().map(this::response).toList()); }
  @GetMapping("/{id}") public ApiResponse<ProjectResponse> get(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) { return ApiResponse.success("Project retrieved successfully.", response(service.get(users.synchronize(jwt), id))); }
  @PostMapping public ApiResponse<ProjectResponse> create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ProjectRequest request) { return ApiResponse.success("Project created successfully.", response(service.create(users.synchronize(jwt), request))); }
  @PutMapping("/{id}") public ApiResponse<ProjectResponse> update(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id, @Valid @RequestBody ProjectRequest request) { return ApiResponse.success("Project updated successfully.", response(service.update(users.synchronize(jwt), id, request))); }
  @DeleteMapping("/{id}") public ApiResponse<Void> delete(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) { service.delete(users.synchronize(jwt), id); return ApiResponse.success("Project deleted successfully.", null); }
}
