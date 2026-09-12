package com.portfolio.features.portfolio.mapper;
import com.portfolio.features.portfolio.dto.PortfolioResponse; import com.portfolio.features.portfolio.entity.Portfolio; import org.mapstruct.Mapper;
@Mapper(componentModel = "spring") public interface PortfolioMapper { PortfolioResponse toResponse(Portfolio portfolio); }

