package com.portfolio.features.integration.github;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.portfolio.features.integration.github.client.GitHubApiClient;
import com.portfolio.features.integration.github.entity.GitHubConnection;
import com.portfolio.features.integration.github.repository.*;
import com.portfolio.features.integration.github.security.TokenEncryptionException;
import com.portfolio.features.integration.github.security.TokenEncryptionService;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.service.PortfolioAccessService;
import com.portfolio.features.project.repository.ProjectRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.*;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class GitHubIntegrationServiceTest {
  private final GitHubConnectionRepository connections = mock(GitHubConnectionRepository.class);
  private final GitHubOAuthStateRepository states = mock(GitHubOAuthStateRepository.class);
  private final GitHubApiClient client = mock(GitHubApiClient.class);
  private final ProjectRepository projects = mock(ProjectRepository.class);
  private final PortfolioAccessService portfolios = mock(PortfolioAccessService.class);
  private final TokenEncryptionService encryption = mock(TokenEncryptionService.class);
  private final GitHubIntegrationService service = new GitHubIntegrationService(connections, states, client, projects, portfolios, encryption);

  @Test void listingMarksImportedAndUsesRequestedPage() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID());
    GitHubConnection connection = new GitHubConnection(); connection.setEncryptedAccessToken("v1:encrypted"); when(encryption.decrypt("v1:encrypted")).thenReturn("server-only");
    var repo = new GitHubApiClient.Repository(123, "portfolio-builder", "seyha/portfolio-builder", "Portfolio builder", "https://github.com/seyha/portfolio-builder", null, "TypeScript", 15, 2, false, false, false, null);
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(portfolios.mine(user)).thenReturn(portfolio); when(client.repos("server-only", 2, 20)).thenReturn(List.of(repo)); when(projects.existsByPortfolioIdAndGithubRepositoryId(portfolio.getId(), 123L)).thenReturn(true);
    var page = service.repositories(user, 2, 20);
    assertEquals(2, page.page()); assertTrue(page.items().getFirst().alreadyImported()); verify(client).repos("server-only", 2, 20);
  }

  @Test void duplicateImportIsSkippedWithoutSave() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setEncryptedAccessToken("v1:encrypted"); when(encryption.decrypt("v1:encrypted")).thenReturn("server-only");
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(portfolios.mine(user)).thenReturn(portfolio); when(projects.existsByPortfolioIdAndGithubRepositoryId(portfolio.getId(), 123L)).thenReturn(true);
    var result = service.importRepositories(user, List.of(123L));
    assertEquals(1, result.skipped()); assertEquals("SKIPPED", result.results().getFirst().status()); verify(projects, never()).save(any());
  }

  @Test void statusDoesNotExposeAccessToken() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setGithubUsername("octocat"); connection.setGithubAvatarUrl("avatar"); connection.setEncryptedAccessToken("v1:encrypted-token"); when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection));
    var status = service.status(user);
    assertTrue(status.connected()); assertEquals("octocat", status.username()); assertFalse(Arrays.stream(status.getClass().getRecordComponents()).anyMatch(c -> c.getName().toLowerCase().contains("token")));
  }

  @Test void invalidEncryptedTokenRequiresReconnect() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setEncryptedAccessToken("plaintext-token");
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(encryption.decrypt("plaintext-token")).thenThrow(new TokenEncryptionException("invalid"));
    IllegalArgumentException error = assertThrows(IllegalArgumentException.class, () -> service.repositories(user, 1, 20));
    assertEquals("GitHub connection is invalid. Please reconnect GitHub.", error.getMessage()); verifyNoInteractions(client);
  }

  @Test void expiredOAuthStateReturnsSafeErrorRedirect() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); var state = new com.portfolio.features.integration.github.entity.GitHubOAuthState(); state.setUser(user); state.setStateHash("unused"); state.setExpiresAt(LocalDateTime.now().minusMinutes(1));
    service.frontendUrl = "http://localhost:3000";
    when(states.findByStateHash(anyString())).thenReturn(Optional.of(state));
    assertEquals("http://localhost:3000/dashboard/builder?github=error", service.callback("code", "expired-state"));
    assertFalse(state.isUsed());
  }

  @Test void privateRepositoryIsRejected() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setEncryptedAccessToken("v1:encrypted");
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(encryption.decrypt("v1:encrypted")).thenReturn("server-only"); when(portfolios.mine(user)).thenReturn(portfolio); when(projects.existsByPortfolioIdAndGithubRepositoryId(portfolio.getId(), 1L)).thenReturn(false); when(client.repo("server-only", 1L)).thenReturn(new GitHubApiClient.Repository(1, "private", "owner/private", null, null, null, null, 0, 0, true, false, false, null));
    assertThrows(IllegalArgumentException.class, () -> service.importOne(user, 1L)); verify(projects, never()).save(any());
  }

  @Test void archivedRepositoryIsRejected() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setEncryptedAccessToken("v1:encrypted");
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(encryption.decrypt("v1:encrypted")).thenReturn("server-only"); when(portfolios.mine(user)).thenReturn(portfolio); when(projects.existsByPortfolioIdAndGithubRepositoryId(portfolio.getId(), 1L)).thenReturn(false); when(client.repo("server-only", 1L)).thenReturn(new GitHubApiClient.Repository(1, "archived", "owner/archived", null, null, null, null, 0, 0, false, false, true, null));
    assertThrows(IllegalArgumentException.class, () -> service.importOne(user, 1L)); verify(projects, never()).save(any());
  }
}
