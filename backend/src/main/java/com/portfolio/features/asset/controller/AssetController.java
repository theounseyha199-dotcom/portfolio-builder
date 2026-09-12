package com.portfolio.features.asset.controller;
import com.portfolio.common.api.ApiResponse; import com.portfolio.features.asset.service.AssetService; import com.portfolio.features.asset.storage.StoredFile; import com.portfolio.features.user.service.UserService; import java.util.UUID; import lombok.RequiredArgsConstructor; import org.springframework.security.core.annotation.AuthenticationPrincipal; import org.springframework.security.oauth2.jwt.Jwt; import org.springframework.web.bind.annotation.*; import org.springframework.web.multipart.MultipartFile;
@RestController @RequiredArgsConstructor public class AssetController {
 private final AssetService service; private final UserService users;
 private ApiResponse<UploadResponse> upload(String message, StoredFile file) { return ApiResponse.success(message, new UploadResponse(file.publicUrl())); }
 @PostMapping("/api/portfolio/assets/profile-image") public ApiResponse<UploadResponse> profile(@AuthenticationPrincipal Jwt jwt,@RequestParam MultipartFile file){return upload("Profile image uploaded successfully.",service.profile(users.synchronize(jwt),file));}
 @DeleteMapping("/api/portfolio/assets/profile-image") public ApiResponse<Void> deleteProfile(@AuthenticationPrincipal Jwt jwt){service.delete(users.synchronize(jwt),null,"PROFILE_IMAGE");return ApiResponse.success("Profile image deleted successfully.",null);}
 @GetMapping("/api/portfolio/assets/resume") public ApiResponse<AssetService.AssetInfo> resumeInfo(@AuthenticationPrincipal Jwt jwt){return ApiResponse.success("Resume retrieved successfully.",service.resumeInfo(users.synchronize(jwt)));}
 @PostMapping("/api/portfolio/assets/resume") public ApiResponse<UploadResponse> resume(@AuthenticationPrincipal Jwt jwt,@RequestParam MultipartFile file){return upload("Resume uploaded successfully.",service.resume(users.synchronize(jwt),file));}
 @DeleteMapping("/api/portfolio/assets/resume") public ApiResponse<Void> deleteResume(@AuthenticationPrincipal Jwt jwt){service.delete(users.synchronize(jwt),null,"RESUME");return ApiResponse.success("Resume deleted successfully.",null);}
 @PostMapping("/api/projects/{id}/image") public ApiResponse<UploadResponse> project(@AuthenticationPrincipal Jwt jwt,@PathVariable UUID id,@RequestParam MultipartFile file){return upload("Project image uploaded successfully.",service.project(users.synchronize(jwt),id,file));}
 @DeleteMapping("/api/projects/{id}/image") public ApiResponse<Void> deleteProject(@AuthenticationPrincipal Jwt jwt,@PathVariable UUID id){service.delete(users.synchronize(jwt),id,"PROJECT_IMAGE");return ApiResponse.success("Project image deleted successfully.",null);}
 public record UploadResponse(String url) { }
}
