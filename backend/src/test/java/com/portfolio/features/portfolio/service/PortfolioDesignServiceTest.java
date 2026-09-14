package com.portfolio.features.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.features.portfolio.dto.DesignRequest;
import com.portfolio.features.portfolio.dto.ThemeConfig;
import com.portfolio.features.portfolio.dto.SectionRequest;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.repository.PortfolioSectionRepository;
import com.portfolio.features.user.entity.AppUser;
import org.junit.jupiter.api.Test;
import java.util.List;

class PortfolioDesignServiceTest {
  private final PortfolioAccessService access = mock(PortfolioAccessService.class);
  private final PortfolioSectionRepository sections = mock(PortfolioSectionRepository.class);
  private final PortfolioDesignService service = new PortfolioDesignService(access, sections, new ObjectMapper());

  @Test
  void templateUpdatePreservesPortfolioContentAndAppliesTheme() throws Exception {
    AppUser owner = new AppUser();
    Portfolio portfolio = new Portfolio();
    portfolio.setFullName("Portfolio Owner");
    portfolio.setBio("Existing biography");
    portfolio.setTemplateKey("minimal");
    when(access.mine(owner)).thenReturn(portfolio);
    ThemeConfig theme = new ThemeConfig("#DB2777", "#FFFFFF", "#FFF1F5", "#111827", "#667085", "playfair", "inter", "light", "large", "wide", "relaxed");

    service.design(owner, new DesignRequest("creative", theme));

    assertEquals("creative", portfolio.getTemplateKey());
    assertEquals("Portfolio Owner", portfolio.getFullName());
    assertEquals("Existing biography", portfolio.getBio());
    assertEquals("#DB2777", new ObjectMapper().readTree(portfolio.getThemeConfig()).get("primaryColor").asText());
  }

  @Test
  void sectionUpdatePreservesOwnershipAndStoresOrderVisibilityAndStyle() {
    AppUser owner = new AppUser(); Portfolio portfolio = new Portfolio(); portfolio.setId(java.util.UUID.randomUUID()); when(access.mine(owner)).thenReturn(portfolio); when(sections.findByPortfolioIdOrderByPositionAsc(portfolio.getId())).thenReturn(List.of());
    service.updateSections(owner, new SectionRequest(List.of(new SectionRequest.SectionItem("PROJECTS", 1, false, "grid", "left", "muted", "large"), new SectionRequest.SectionItem("HERO", 2, false, "split", "center", "default", "normal"))));
    verify(access, org.mockito.Mockito.atLeastOnce()).mine(owner); verify(sections).deleteByPortfolioId(portfolio.getId()); verify(sections).flush(); verify(sections, org.mockito.Mockito.times(2)).save(org.mockito.ArgumentMatchers.argThat(section -> section.getPortfolio() == portfolio));
  }
}
