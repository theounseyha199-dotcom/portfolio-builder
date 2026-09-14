package com.portfolio.features.portfolio.service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.common.exception.ConflictException;
import com.portfolio.features.portfolio.dto.DesignRequest;
import com.portfolio.features.portfolio.dto.SectionRequest;
import com.portfolio.features.portfolio.dto.SectionResponse;
import com.portfolio.features.portfolio.entity.PortfolioSection;
import com.portfolio.features.portfolio.repository.PortfolioSectionRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class PortfolioDesignService {
 private final PortfolioAccessService access; private final PortfolioSectionRepository sections; private final ObjectMapper json;
 private static final List<String> DEFAULT = List.of("HERO", "ABOUT", "EXPERIENCE", "PROJECTS", "SKILLS", "EDUCATION", "SOCIAL", "RESUME");
 @Transactional public void design(AppUser user, DesignRequest request) { var portfolio = access.mine(user); portfolio.setTemplateKey(request.templateKey()); try { portfolio.setThemeConfig(json.writeValueAsString(request.themeConfig())); } catch (JsonProcessingException e) { throw new IllegalArgumentException("Theme is invalid."); } }
 @Transactional public List<SectionResponse> updateSections(AppUser user, SectionRequest request) { var portfolio = access.mine(user); var types = new HashSet<String>(); for (var item : request.sections()) if (!types.add(item.sectionType())) throw new ConflictException("Duplicate section type."); if (!types.contains("HERO")) throw new ConflictException("Hero section is required."); sections.deleteByPortfolioId(portfolio.getId()); int position = 1; for (var item : request.sections().stream().sorted(Comparator.comparingInt(SectionRequest.SectionItem::position)).toList()) { var section = new PortfolioSection(); section.setPortfolio(portfolio); section.setSectionType(item.sectionType()); section.setPosition(position++); section.setEnabled(item.sectionType().equals("HERO") || item.enabled()); section.setLayout(item.layout()); section.setAlignment(item.alignment()); section.setBackground(item.background()); section.setSpacing(item.spacing()); sections.save(section); } return get(user); }
 @Transactional(readOnly=true) public List<SectionResponse> get(AppUser user) { return responses(sections.findByPortfolioIdOrderByPositionAsc(access.mine(user).getId())); }
 public List<SectionResponse> responses(List<PortfolioSection> saved) { if (saved.isEmpty()) return defaults(); return saved.stream().map(this::response).toList(); }
 private SectionResponse response(PortfolioSection section) { return new SectionResponse(section.getSectionType(), section.getPosition(), section.isEnabled(), section.getLayout(), section.getAlignment(), section.getBackground(), section.getSpacing()); }
 private List<SectionResponse> defaults() { var output = new ArrayList<SectionResponse>(); for (int i = 0; i < DEFAULT.size(); i++) output.add(new SectionResponse(DEFAULT.get(i), i + 1, true, null, "left", "default", "normal")); return output; }
}
