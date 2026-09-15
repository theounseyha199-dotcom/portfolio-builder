package com.portfolio.features.portfolio.mapper;
import com.portfolio.features.asset.storage.PublicAssetUrl;
import com.portfolio.features.portfolio.dto.PortfolioResponse; import com.portfolio.features.portfolio.entity.Portfolio; import org.mapstruct.Mapper;
@Mapper(componentModel = "spring") public interface PortfolioMapper { default PortfolioResponse toResponse(Portfolio p) { return new PortfolioResponse(p.getId(), p.getSlug(), p.getFullName(), p.getHeadline(), p.getBio(), PublicAssetUrl.relative(p.getProfileImageUrl()), p.getLocation(), p.getPublicEmail(), p.getPhone(), p.getTemplateKey(), p.getThemeConfig(), p.isPublished()); } }
