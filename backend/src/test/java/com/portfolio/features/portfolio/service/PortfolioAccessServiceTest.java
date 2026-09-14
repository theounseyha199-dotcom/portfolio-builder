package com.portfolio.features.portfolio.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.portfolio.common.exception.NotFoundException;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.repository.PortfolioRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PortfolioAccessServiceTest {
  private final PortfolioRepository repository = mock(PortfolioRepository.class);
  private final PortfolioAccessService service = new PortfolioAccessService(repository);
  @Test void ownerCanAccessPortfolio() { AppUser owner = user(); Portfolio portfolio = portfolio(owner); when(repository.findById(portfolio.getId())).thenReturn(Optional.of(portfolio)); assertSame(portfolio, service.owned(owner, portfolio.getId())); }
  @Test void otherUserCannotAccessPortfolio() { AppUser owner = user(); Portfolio portfolio = portfolio(owner); when(repository.findById(portfolio.getId())).thenReturn(Optional.of(portfolio)); assertThrows(NotFoundException.class, () -> service.owned(user(), portfolio.getId())); }
  @Test void missingPortfolioIsNotFound() { assertThrows(NotFoundException.class, () -> service.owned(user(), UUID.randomUUID())); }
  private static AppUser user() { AppUser user = new AppUser(); user.setId(UUID.randomUUID()); return user; }
  private static Portfolio portfolio(AppUser user) { Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID()); portfolio.setUser(user); return portfolio; }
}
