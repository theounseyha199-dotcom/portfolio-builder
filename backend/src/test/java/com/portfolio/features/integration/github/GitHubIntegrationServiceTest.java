package com.portfolio.features.integration.github;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.portfolio.features.integration.github.client.GitHubApiClient;
import com.portfolio.features.integration.github.entity.GitHubConnection;
import com.portfolio.features.integration.github.repository.*;
import com.portfolio.features.portfolio.entity.Portfolio;
import com.portfolio.features.portfolio.service.PortfolioAccessService;
import com.portfolio.features.project.repository.ProjectRepository;
import com.portfolio.features.user.entity.AppUser;
import java.util.*;
import org.junit.jupiter.api.Test;

class GitHubIntegrationServiceTest {
  private final GitHubConnectionRepository connections = mock(GitHubConnectionRepository.class);
  private final GitHubOAuthStateRepository states = mock(GitHubOAuthStateRepository.class);
  private final GitHubApiClient client = mock(GitHubApiClient.class);
  private final ProjectRepository projects = mock(ProjectRepository.class);
  private final PortfolioAccessService portfolios = mock(PortfolioAccessService.class);
  private final GitHubIntegrationService service = new GitHubIntegrationService(connections, states, client, projects, portfolios);

  @Test void listingMarksImportedAndUsesRequestedPage() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID());
    GitHubConnection connection = new GitHubConnection(); connection.setAccessToken("server-only");
    var repo = new GitHubApiClient.Repository(123, "portfolio-builder", "seyha/portfolio-builder", "Portfolio builder", "https://github.com/seyha/portfolio-builder", null, "TypeScript", 15, 2, false, false, false, null);
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(portfolios.mine(user)).thenReturn(portfolio); when(client.repos("server-only", 2, 20)).thenReturn(List.of(repo)); when(projects.existsByPortfolioIdAndGithubRepositoryId(portfolio.getId(), 123L)).thenReturn(true);
    var page = service.repositories(user, 2, 20);
    assertEquals(2, page.page()); assertTrue(page.items().getFirst().alreadyImported()); verify(client).repos("server-only", 2, 20);
  }

  @Test void duplicateImportIsSkippedWithoutSave() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); Portfolio portfolio = new Portfolio(); portfolio.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setAccessToken("server-only");
    when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection)); when(portfolios.mine(user)).thenReturn(portfolio); when(projects.existsByPortfolioIdAndGithubRepositoryId(portfolio.getId(), 123L)).thenReturn(true);
    var result = service.importRepositories(user, List.of(123L));
    assertEquals(1, result.skipped()); assertEquals("SKIPPED", result.results().getFirst().status()); verify(projects, never()).save(any());
  }

  @Test void statusDoesNotExposeAccessToken() {
    AppUser user = new AppUser(); user.setId(UUID.randomUUID()); GitHubConnection connection = new GitHubConnection(); connection.setGithubUsername("octocat"); connection.setGithubAvatarUrl("avatar"); connection.setAccessToken("secret-token"); when(connections.findByUserId(user.getId())).thenReturn(Optional.of(connection));
    var status = service.status(user);
    assertTrue(status.connected()); assertEquals("octocat", status.username()); assertFalse(Arrays.stream(status.getClass().getRecordComponents()).anyMatch(c -> c.getName().toLowerCase().contains("token")));
  }
}
