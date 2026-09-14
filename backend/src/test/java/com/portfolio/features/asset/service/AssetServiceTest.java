package com.portfolio.features.asset.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.portfolio.features.asset.config.StorageProperties;
import com.portfolio.features.asset.repository.PortfolioAssetRepository;
import com.portfolio.features.asset.storage.StorageService;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.service.PortfolioAccessService;
import com.portfolio.features.project.entity.Project;
import com.portfolio.features.project.repository.ProjectRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.multipart.MultipartFile;

class AssetServiceTest {
  private final StorageService storage = mock(StorageService.class); private final StorageProperties properties = new StorageProperties(); private final PortfolioAssetRepository assets = mock(PortfolioAssetRepository.class); private final PortfolioAccessService access = mock(PortfolioAccessService.class); private final ProjectRepository projects = mock(ProjectRepository.class); private final AssetService service = new AssetService(storage, properties, assets, access, projects); private final AppUser user = new AppUser(); private final Portfolio portfolio = new Portfolio();
  @BeforeEach void setup() { user.setId(UUID.randomUUID()); portfolio.setId(UUID.randomUUID()); properties.setMaxImageSize(10); properties.setMaxProjectImageSize(10); properties.setMaxResumeSize(10); when(access.mine(user)).thenReturn(portfolio); }
  @Test void unsupportedImageTypeIsRejected() { MultipartFile file = file("text/plain", 1); assertThrows(IllegalArgumentException.class, () -> service.profile(user, file)); verifyNoInteractions(storage); }
  @Test void oversizedImageIsRejected() { MultipartFile file = file("image/png", 11); assertThrows(IllegalArgumentException.class, () -> service.profile(user, file)); verifyNoInteractions(storage); }
  @Test void invalidResumeTypeIsRejected() { MultipartFile file = file("image/png", 1); assertThrows(IllegalArgumentException.class, () -> service.resume(user, file)); verifyNoInteractions(storage); }
  @Test void projectImageChecksProjectOwnership() { Project project = new Project(); project.setId(UUID.randomUUID()); project.setPortfolio(portfolio); when(projects.findById(project.getId())).thenReturn(Optional.of(project)); doThrow(new com.portfolio.common.exception.NotFoundException("Project not found.")).when(access).owned(user, portfolio.getId()); assertThrows(com.portfolio.common.exception.NotFoundException.class, () -> service.project(user, project.getId(), file("image/webp", 1))); verify(access).owned(user, portfolio.getId()); }
  private static MultipartFile file(String type, long size) { MultipartFile file = mock(MultipartFile.class); when(file.isEmpty()).thenReturn(false); when(file.getContentType()).thenReturn(type); when(file.getSize()).thenReturn(size); return file; }
}
