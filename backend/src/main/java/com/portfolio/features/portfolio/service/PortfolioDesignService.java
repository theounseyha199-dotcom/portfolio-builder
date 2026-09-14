package com.portfolio.features.portfolio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.common.exception.ConflictException;
import com.portfolio.features.portfolio.dto.DesignRequest;
import com.portfolio.features.portfolio.dto.SectionRequest;
import com.portfolio.features.portfolio.dto.SectionResponse;
import com.portfolio.features.portfolio.dto.ThemeConfig;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.entity.PortfolioSection;
import com.portfolio.features.portfolio.repository.PortfolioSectionRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioDesignService {
  private final PortfolioAccessService access;
  private final PortfolioSectionRepository sections;
  private final ObjectMapper json;

  public static final Set<String> SUPPORTED_TEMPLATES = Set.of(
      "minimal", "developer", "modern", "professional", "creative", "student"
  );

  private static final List<String> DEFAULT = List.of(
      "HERO", "ABOUT", "EXPERIENCE", "PROJECTS", "SKILLS", "EDUCATION", "SOCIAL", "RESUME"
  );

  public static boolean isValidTemplate(String templateKey) {
    return templateKey != null && SUPPORTED_TEMPLATES.contains(templateKey.toLowerCase());
  }

  public static List<String> defaultSectionOrderFor(String templateKey) {
    if (templateKey == null) return DEFAULT;
    return switch (templateKey.toLowerCase()) {
      case "developer" -> List.of("HERO", "PROJECTS", "SKILLS", "EXPERIENCE", "EDUCATION", "ABOUT", "SOCIAL", "RESUME");
      case "professional" -> List.of("HERO", "ABOUT", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "SOCIAL", "RESUME");
      case "creative" -> List.of("HERO", "PROJECTS", "ABOUT", "SKILLS", "EXPERIENCE", "EDUCATION", "SOCIAL", "RESUME");
      case "student" -> List.of("HERO", "EDUCATION", "PROJECTS", "SKILLS", "RESUME", "EXPERIENCE", "ABOUT", "SOCIAL");
      default -> DEFAULT;
    };
  }

  public static ThemeConfig defaultThemeFor(String templateKey) {
    String key = templateKey == null ? "minimal" : templateKey.toLowerCase();
    return switch (key) {
      case "developer" -> new ThemeConfig(
          "#4ADE80", "#0B1220", "#111C2F", "#F8FAFC", "#94A3B8",
          "geist-mono", "inter", "dark", "medium", "wide", "normal");
      case "modern" -> new ThemeConfig(
          "#4F46E5", "#FFFFFF", "#F4F6FA", "#111827", "#667085",
          "manrope", "inter", "light", "large", "wide", "normal");
      case "professional" -> new ThemeConfig(
          "#1E3A5F", "#FFFFFF", "#F3F4F6", "#111827", "#667085",
          "source-sans", "inter", "light", "none", "medium", "compact");
      case "creative" -> new ThemeConfig(
          "#DB2777", "#FFFFFF", "#FFF1F5", "#111827", "#667085",
          "playfair", "inter", "light", "large", "wide", "relaxed");
      case "student" -> new ThemeConfig(
          "#7C3AED", "#FFFFFF", "#F5F3FF", "#111827", "#667085",
          "manrope", "inter", "light", "medium", "medium", "normal");
      default -> new ThemeConfig(
          "#20419E", "#FFFFFF", "#F4F6FA", "#111827", "#667085",
          "geist", "inter", "light", "small", "narrow", "relaxed");
    };
  }

  @Transactional
  public void initializeDefaults(Portfolio portfolio, String templateKey) {
    String key = isValidTemplate(templateKey) ? templateKey.toLowerCase() : "minimal";
    portfolio.setTemplateKey(key);
    try {
      portfolio.setThemeConfig(json.writeValueAsString(defaultThemeFor(key)));
    } catch (JsonProcessingException e) {
      portfolio.setThemeConfig("{}");
    }

    sections.deleteByPortfolioId(portfolio.getId());
    sections.flush();

    List<String> order = defaultSectionOrderFor(key);
    int position = 1;
    for (String sectionType : order) {
      var section = new PortfolioSection();
      section.setPortfolio(portfolio);
      section.setSectionType(sectionType);
      section.setPosition(position++);
      section.setEnabled(true);
      section.setAlignment("left");
      section.setBackground("default");
      section.setSpacing("normal");
      sections.save(section);
    }
  }

  @Transactional
  public void design(AppUser user, DesignRequest request) {
    var portfolio = access.mine(user);
    portfolio.setTemplateKey(request.templateKey());
    try {
      portfolio.setThemeConfig(json.writeValueAsString(request.themeConfig()));
    } catch (JsonProcessingException e) {
      throw new IllegalArgumentException("Theme is invalid.");
    }
  }

  @Transactional
  public List<SectionResponse> updateSections(AppUser user, SectionRequest request) {
    var portfolio = access.mine(user);
    var types = new HashSet<String>();
    for (var item : request.sections()) {
      if (!types.add(item.sectionType())) throw new ConflictException("Duplicate section type.");
    }
    if (!types.contains("HERO")) throw new ConflictException("Hero section is required.");
    sections.deleteByPortfolioId(portfolio.getId());
    sections.flush();
    int position = 1;
    for (var item : request.sections().stream().sorted(Comparator.comparingInt(SectionRequest.SectionItem::position)).toList()) {
      var section = new PortfolioSection();
      section.setPortfolio(portfolio);
      section.setSectionType(item.sectionType());
      section.setPosition(position++);
      section.setEnabled(item.sectionType().equals("HERO") || item.enabled());
      section.setLayout(item.layout());
      section.setAlignment(item.alignment());
      section.setBackground(item.background());
      section.setSpacing(item.spacing());
      sections.save(section);
    }
    return get(user);
  }

  @Transactional(readOnly = true)
  public List<SectionResponse> get(AppUser user) {
    return responses(sections.findByPortfolioIdOrderByPositionAsc(access.mine(user).getId()));
  }

  public List<SectionResponse> responses(List<PortfolioSection> saved) {
    if (saved.isEmpty()) return defaults();
    return saved.stream().map(this::response).toList();
  }

  private SectionResponse response(PortfolioSection section) {
    return new SectionResponse(
        section.getSectionType(),
        section.getPosition(),
        section.isEnabled(),
        section.getLayout(),
        section.getAlignment(),
        section.getBackground(),
        section.getSpacing()
    );
  }

  private List<SectionResponse> defaults() {
    var output = new ArrayList<SectionResponse>();
    for (int i = 0; i < DEFAULT.size(); i++) {
      output.add(new SectionResponse(DEFAULT.get(i), i + 1, true, null, "left", "default", "normal"));
    }
    return output;
  }
}
