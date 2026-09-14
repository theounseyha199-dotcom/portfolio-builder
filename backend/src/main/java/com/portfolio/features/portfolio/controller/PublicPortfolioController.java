package com.portfolio.features.portfolio.controller;
import com.portfolio.common.api.ApiResponse;
import com.portfolio.features.asset.repository.PortfolioAssetRepository;
import com.portfolio.features.asset.storage.StorageService;
import com.portfolio.features.education.mapper.EducationMapper;
import com.portfolio.features.education.repository.EducationRepository;
import com.portfolio.features.experience.mapper.ExperienceMapper;
import com.portfolio.features.experience.repository.ExperienceRepository;
import com.portfolio.features.portfolio.dto.PublicPortfolioResponse;
import com.portfolio.features.portfolio.repository.PortfolioSectionRepository;
import com.portfolio.features.portfolio.service.PortfolioDesignService;
import com.portfolio.features.portfolio.service.PortfolioService;
import com.portfolio.features.project.dto.ProjectResponse;
import com.portfolio.features.project.repository.ProjectRepository;
import com.portfolio.features.skill.mapper.SkillMapper;
import com.portfolio.features.skill.repository.SkillRepository;
import com.portfolio.features.social.mapper.SocialLinkMapper;
import com.portfolio.features.social.repository.SocialLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController @RequestMapping("/api/public") @RequiredArgsConstructor
public class PublicPortfolioController {
 private final PortfolioService portfolios; private final ExperienceRepository experiences; private final ExperienceMapper experienceMapper; private final EducationRepository educations; private final EducationMapper educationMapper; private final SkillRepository skills; private final SkillMapper skillMapper; private final ProjectRepository projects; private final SocialLinkRepository socialLinks; private final SocialLinkMapper socialMapper; private final PortfolioAssetRepository assets; private final StorageService storage; private final PortfolioSectionRepository sectionRepository; private final PortfolioDesignService design;
 @GetMapping("/health") public ApiResponse<String> health() { return ApiResponse.success("Service is healthy.", "ok"); }
 @GetMapping("/portfolios/{slug}") public ApiResponse<PublicPortfolioResponse> get(@PathVariable String slug) { var p = portfolios.publicBySlug(slug); var profile = assets.findByPortfolioIdAndAssetType(p.getId(), "PROFILE_IMAGE").map(a -> storage.getPublicUrl(a.getObjectKey())).orElse(p.getProfileImageUrl()); var resume = assets.findByPortfolioIdAndAssetType(p.getId(), "RESUME").map(a -> new PublicPortfolioResponse.Resume(true, storage.getPublicUrl(a.getObjectKey()))).orElse(new PublicPortfolioResponse.Resume(false, null)); var projectResponses = projects.findByPortfolioIdOrderBySortOrderAscTitleAsc(p.getId()).stream().map(x -> new ProjectResponse(x.getId(), x.getTitle(), x.getSlug(), x.getShortDescription(), x.getDescription(), assets.findByProjectIdAndAssetType(x.getId(), "PROJECT_IMAGE").map(a -> storage.getPublicUrl(a.getObjectKey())).orElse(x.getThumbnailUrl()), x.getGithubUrl(), x.getDemoUrl(), x.isFeatured(), x.getSortOrder(), x.getTechnologies().stream().map(t -> t.getTechnology()).toList())).toList(); return ApiResponse.success("Portfolio retrieved successfully.", new PublicPortfolioResponse(p.getId(), p.getSlug(), p.getFullName(), p.getHeadline(), p.getBio(), p.getLocation(), p.getPublicEmail(), profile, resume, p.getTemplateKey(), p.getThemeConfig(), design.responses(sectionRepository.findByPortfolioIdOrderByPositionAsc(p.getId())), experiences.findByPortfolioIdOrderBySortOrderAscStartDateDesc(p.getId()).stream().map(experienceMapper::toResponse).toList(), educations.findByPortfolioIdOrderBySortOrderAscStartDateDesc(p.getId()).stream().map(educationMapper::toResponse).toList(), skills.findByPortfolioIdOrderBySortOrderAscNameAsc(p.getId()).stream().map(skillMapper::toResponse).toList(), projectResponses, socialLinks.findByPortfolioIdOrderBySortOrderAsc(p.getId()).stream().map(socialMapper::toResponse).toList())); }
}
