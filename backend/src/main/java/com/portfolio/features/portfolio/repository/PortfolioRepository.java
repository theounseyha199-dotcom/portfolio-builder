package com.portfolio.features.portfolio.repository;
import com.portfolio.features.portfolio.entity.Portfolio; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> { Optional<Portfolio> findByUserId(UUID userId); Optional<Portfolio> findBySlugAndPublishedTrue(String slug); boolean existsBySlug(String slug); }

