package com.portfolio.features.portfolio.dto;
import com.portfolio.features.education.dto.EducationResponse;
import com.portfolio.features.experience.dto.ExperienceResponse;
import com.portfolio.features.project.dto.ProjectResponse;
import com.portfolio.features.skill.dto.SkillResponse;
import com.portfolio.features.social.dto.SocialLinkResponse;
import java.util.List;
import java.util.UUID;
public record PublicPortfolioResponse(UUID id, String slug, String fullName, String headline, String bio, String location, String publicEmail, String profileImageUrl, Resume resume, String templateKey, String themeConfig, List<SectionResponse> sections, List<ExperienceResponse> experiences, List<EducationResponse> educations, List<SkillResponse> skills, List<ProjectResponse> projects, List<SocialLinkResponse> socialLinks) { public record Resume(boolean available, String url) {} }
