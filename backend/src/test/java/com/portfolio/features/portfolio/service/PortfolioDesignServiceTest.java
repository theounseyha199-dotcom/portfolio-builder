package com.portfolio.features.portfolio.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.features.portfolio.dto.DesignRequest;
import com.portfolio.features.portfolio.dto.ThemeConfig;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.repository.PortfolioSectionRepository;
import com.portfolio.features.user.entity.AppUser;
import org.junit.jupiter.api.Test;

class PortfolioDesignServiceTest {
  private final PortfolioAccessService access = mock(PortfolioAccessService.class);
  private final PortfolioDesignService service = new PortfolioDesignService(access, mock(PortfolioSectionRepository.class), new ObjectMapper());

  @Test
  void templateUpdatePreservesPortfolioContentAndAppliesTheme() throws Exception {
    AppUser owner = new AppUser();
    Portfolio portfolio = new Portfolio();
    portfolio.setFullName("Portfolio Owner");
    portfolio.setBio("Existing biography");
    portfolio.setTemplateKey("minimal");
    when(access.mine(owner)).thenReturn(portfolio);
    ThemeConfig theme = new ThemeConfig("#DB2777", "#FFFFFF", "#111827", "#667085", "Inter", "light", "large", "grid", "wide");

    service.design(owner, new DesignRequest("creative", theme));

    assertEquals("creative", portfolio.getTemplateKey());
    assertEquals("Portfolio Owner", portfolio.getFullName());
    assertEquals("Existing biography", portfolio.getBio());
    assertEquals("#DB2777", new ObjectMapper().readTree(portfolio.getThemeConfig()).get("primaryColor").asText());
  }
}
