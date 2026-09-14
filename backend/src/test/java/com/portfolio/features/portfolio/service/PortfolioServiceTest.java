package com.portfolio.features.portfolio.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.portfolio.common.exception.ConflictException;
import com.portfolio.common.exception.NotFoundException;
import com.portfolio.features.portfolio.dto.CreatePortfolioRequest;
import com.portfolio.features.portfolio.dto.UpdatePortfolioRequest;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.repository.PortfolioRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PortfolioServiceTest {
  private final PortfolioRepository repository = mock(PortfolioRepository.class);
  private final PortfolioDesignService designService = mock(PortfolioDesignService.class);
  private final PortfolioService service = new PortfolioService(repository, designService);
  private final AppUser owner = user();
  private final Portfolio portfolio = portfolio(owner);

  @Test
  void ownerCanUpdateOwnPortfolio() {
    when(repository.findById(portfolio.getId())).thenReturn(Optional.of(portfolio));
    UpdatePortfolioRequest request = new UpdatePortfolioRequest("Ada", "Engineer", "Bio", "London", "ada@example.com", null, null, null);
    assertEquals("Ada", service.update(owner, portfolio.getId(), request).getFullName());
  }

  @Test
  void userCannotUpdateAnotherPortfolio() {
    when(repository.findById(portfolio.getId())).thenReturn(Optional.of(portfolio));
    assertThrows(NotFoundException.class, () -> service.update(user(), portfolio.getId(), new UpdatePortfolioRequest("Ada", null, null, null, null, null, null, null)));
  }

  @Test
  void draftPortfolioIsNotPublic() {
    when(repository.findBySlugAndPublishedTrue("ada")).thenReturn(Optional.empty());
    assertThrows(NotFoundException.class, () -> service.publicBySlug("ada"));
  }

  @Test
  void publishedPortfolioIsPublic() {
    portfolio.setPublished(true);
    when(repository.findBySlugAndPublishedTrue("ada")).thenReturn(Optional.of(portfolio));
    assertSame(portfolio, service.publicBySlug("ada"));
  }

  @Test
  void duplicatePortfolioIsRejected() {
    when(repository.findByUserId(owner.getId())).thenReturn(Optional.of(portfolio));
    assertThrows(ConflictException.class, () -> service.create(owner, new CreatePortfolioRequest("ada", "Ada", null)));
  }

  @Test
  void duplicateSlugIsRejected() {
    when(repository.findByUserId(owner.getId())).thenReturn(Optional.empty());
    when(repository.existsBySlug("ada")).thenReturn(true);
    assertThrows(ConflictException.class, () -> service.create(owner, new CreatePortfolioRequest("ada", "Ada", null)));
  }

  @Test
  void invalidTemplateIsRejected() {
    when(repository.findByUserId(owner.getId())).thenReturn(Optional.empty());
    when(repository.existsBySlug("ada")).thenReturn(false);
    assertThrows(IllegalArgumentException.class, () -> service.create(owner, new CreatePortfolioRequest("ada", "Ada", null, "invalid-template")));
  }

  @Test
  void createPortfolioInitializesSelectedTemplateAndDefaults() {
    when(repository.findByUserId(owner.getId())).thenReturn(Optional.empty());
    when(repository.existsBySlug("ada")).thenReturn(false);
    when(repository.save(any(Portfolio.class))).thenAnswer(invocation -> {
      Portfolio p = invocation.getArgument(0);
      p.setId(UUID.randomUUID());
      return p;
    });

    Portfolio created = service.create(owner, new CreatePortfolioRequest("ada", "Ada Lovelace", "Pioneer", "developer"));

    assertNotNull(created);
    assertEquals("ada", created.getSlug());
    assertEquals("Ada Lovelace", created.getFullName());
    assertEquals("developer", created.getTemplateKey());
    assertEquals(owner, created.getUser());
    verify(designService).initializeDefaults(created, "developer");
  }

  private static AppUser user() {
    AppUser user = new AppUser();
    user.setId(UUID.randomUUID());
    return user;
  }

  private static Portfolio portfolio(AppUser user) {
    Portfolio portfolio = new Portfolio();
    portfolio.setId(UUID.randomUUID());
    portfolio.setUser(user);
    portfolio.setSlug("ada");
    return portfolio;
  }
}
