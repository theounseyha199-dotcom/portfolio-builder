package com.portfolio.features.asset.service;

import com.portfolio.common.exception.NotFoundException;
import com.portfolio.features.asset.config.StorageProperties;
import com.portfolio.features.asset.entity.PortfolioAsset;
import com.portfolio.features.asset.repository.PortfolioAssetRepository;
import com.portfolio.features.asset.storage.StorageService;
import com.portfolio.features.asset.storage.StoredFile;
import com.portfolio.features.portfolio.service.PortfolioAccessService;
import com.portfolio.features.project.repository.ProjectRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service @RequiredArgsConstructor
public class AssetService {
  private static final Set<String> IMAGES = Set.of("image/jpeg", "image/png", "image/webp");
  private final StorageService storage; private final StorageProperties props; private final PortfolioAssetRepository assets;
  private final PortfolioAccessService access; private final ProjectRepository projects;
  @Transactional public StoredFile profile(AppUser user, MultipartFile file) { var p = access.mine(user); return replace(p, null, "PROFILE_IMAGE", file, "portfolios/" + p.getId() + "/profile", props.getMaxImageSize(), IMAGES); }
  @Transactional public StoredFile resume(AppUser user, MultipartFile file) { var p = access.mine(user); return replace(p, null, "RESUME", file, "portfolios/" + p.getId() + "/resume", props.getMaxResumeSize(), Set.of("application/pdf")); }
  @Transactional public StoredFile project(AppUser user, UUID projectId, MultipartFile file) { var project = projects.findById(projectId).orElseThrow(() -> new NotFoundException("Project not found.")); access.owned(user, project.getPortfolio().getId()); return replace(project.getPortfolio(), projectId, "PROJECT_IMAGE", file, "portfolios/" + project.getPortfolio().getId() + "/projects/" + projectId, props.getMaxProjectImageSize(), IMAGES); }
  @Transactional public void delete(AppUser user, UUID projectId, String type) {
    var portfolio = access.mine(user);
    if (projectId != null) { var project = projects.findById(projectId).orElseThrow(() -> new NotFoundException("Project not found.")); access.owned(user, project.getPortfolio().getId()); }
    var asset = projectId == null ? assets.findByPortfolioIdAndAssetType(portfolio.getId(), type) : assets.findByProjectIdAndAssetType(projectId, type);
    asset.ifPresent(value -> { assets.delete(value); if ("PROFILE_IMAGE".equals(type)) portfolio.setProfileImageUrl(null); if (projectId != null) projects.findById(projectId).ifPresent(project -> project.setThumbnailUrl(null)); storage.delete(value.getObjectKey()); });
  }
  @Transactional(readOnly = true) public AssetInfo resumeInfo(AppUser user) { return assets.findByPortfolioIdAndAssetType(access.mine(user).getId(), "RESUME").map(this::info).orElse(null); }
  @Transactional(readOnly = true) public String url(PortfolioAsset asset) { return storage.getPublicUrl(asset.getObjectKey()); }
  private StoredFile replace(com.portfolio.features.portfolio.entity.Portfolio portfolio, UUID projectId, String type, MultipartFile file, String directory, long maxSize, Set<String> contentTypes) {
    if (file.isEmpty()) throw new IllegalArgumentException("File is required.");
    if (file.getSize() > maxSize) throw new IllegalArgumentException("File is too large.");
    if (!contentTypes.contains(file.getContentType())) throw new IllegalArgumentException(type.equals("RESUME") ? "Resume must be a PDF." : "Only JPEG, PNG, and WebP images are supported.");
    StoredFile stored = storage.upload(file, directory);
    try {
      var existing = projectId == null ? assets.findByPortfolioIdAndAssetType(portfolio.getId(), type) : assets.findByProjectIdAndAssetType(projectId, type);
      PortfolioAsset asset = existing.orElseGet(PortfolioAsset::new); String oldKey = asset.getObjectKey();
      asset.setPortfolio(portfolio); if (projectId != null) asset.setProject(projects.getReferenceById(projectId));
      asset.setAssetType(type); asset.setObjectKey(stored.objectKey()); asset.setOriginalFilename(file.getOriginalFilename()); asset.setContentType(file.getContentType()); asset.setFileSize(file.getSize()); assets.save(asset);
      if ("PROFILE_IMAGE".equals(type)) portfolio.setProfileImageUrl(stored.publicUrl());
      if (projectId != null) projects.findById(projectId).ifPresent(project -> project.setThumbnailUrl(stored.publicUrl()));
      if (oldKey != null) storage.delete(oldKey); return stored;
    } catch (RuntimeException exception) { storage.delete(stored.objectKey()); throw exception; }
  }
  private AssetInfo info(PortfolioAsset asset) { return new AssetInfo(true, asset.getOriginalFilename(), asset.getFileSize(), storage.getPublicUrl(asset.getObjectKey())); }
  public record AssetInfo(boolean available, String filename, long size, String url) { }
}
