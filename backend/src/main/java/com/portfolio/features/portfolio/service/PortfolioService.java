package com.portfolio.features.portfolio.service;

import com.portfolio.common.exception.*;
import com.portfolio.features.portfolio.dto.*;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.repository.PortfolioRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortfolioService {
  private final PortfolioRepository portfolios;
  private final PortfolioDesignService designService;

  @Transactional
  public Portfolio create(AppUser user, CreatePortfolioRequest request) {
    if (portfolios.findByUserId(user.getId()).isPresent()) {
      throw new ConflictException("A portfolio already exists for this user.");
    }
    if (portfolios.existsBySlug(request.slug())) {
      throw new ConflictException("Slug is already in use.");
    }
    String templateKey = request.templateKey() != null ? request.templateKey().toLowerCase() : "minimal";
    if (!PortfolioDesignService.isValidTemplate(templateKey)) {
      throw new IllegalArgumentException("Template is not supported.");
    }
    Portfolio p = new Portfolio();
    p.setUser(user);
    p.setSlug(request.slug());
    p.setFullName(request.fullName());
    p.setHeadline(request.headline());
    p.setTemplateKey(templateKey);
    p = portfolios.save(p);
    designService.initializeDefaults(p, templateKey);
    return p;
  }

  @Transactional(readOnly = true)
  public Portfolio mine(AppUser user) {
    return portfolios.findByUserId(user.getId()).orElseThrow(() -> new NotFoundException("Portfolio not found."));
  }

  @Transactional
  public Portfolio update(AppUser user, UUID id, UpdatePortfolioRequest request) {
    Portfolio p = owned(user, id);
    p.setFullName(request.fullName());
    p.setHeadline(request.headline());
    p.setBio(request.bio());
    p.setLocation(request.location());
    p.setPublicEmail(request.publicEmail());
    p.setPhone(request.phone());
    if (request.templateKey() != null) p.setTemplateKey(request.templateKey());
    if (request.themeConfig() != null) p.setThemeConfig(request.themeConfig());
    return p;
  }

  @Transactional
  public Portfolio setPublished(AppUser user, UUID id, boolean published) {
    Portfolio p = owned(user, id);
    p.setPublished(published);
    return p;
  }

  @Transactional(readOnly = true)
  public Portfolio publicBySlug(String slug) {
    return portfolios.findBySlugAndPublishedTrue(slug).orElseThrow(() -> new NotFoundException("Portfolio not found."));
  }

  private Portfolio owned(AppUser user, UUID id) {
    Portfolio p = portfolios.findById(id).orElseThrow(() -> new NotFoundException("Portfolio not found."));
    if (!p.getUser().getId().equals(user.getId())) throw new NotFoundException("Portfolio not found.");
    return p;
  }
}
