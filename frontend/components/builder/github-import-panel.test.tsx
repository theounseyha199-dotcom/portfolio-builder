import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GitHubImportPanel } from "./github-import-panel";

const { githubApi } = vi.hoisted(() => ({ githubApi: { status: vi.fn(), connect: vi.fn(), disconnect: vi.fn(), repositories: vi.fn(), import: vi.fn() } }));
vi.mock("@/features/github/api", () => ({ githubApi }));
const repo = { githubId: 1, name: "public-repo", fullName: "owner/public-repo", repositoryUrl: "https://github.com/owner/public-repo", stars: 0, forks: 0, privateRepository: false, fork: false, archived: false, alreadyImported: false };

describe("GitHubImportPanel", () => {
  beforeEach(() => { vi.resetAllMocks(); githubApi.status.mockResolvedValue({ connected: false }); });
  it("shows a connect action while disconnected", async () => { render(<GitHubImportPanel />); expect(await screen.findByRole("button", { name: "Connect GitHub" })).toBeEnabled(); });
  it("disables private repositories and enables import after selection", async () => { githubApi.status.mockResolvedValue({ connected: true, username: "octocat" }); githubApi.repositories.mockResolvedValue({ items: [repo, { ...repo, githubId: 2, name: "private-repo", privateRepository: true }], page: 1, size: 20, hasMore: false }); render(<GitHubImportPanel />); expect(await screen.findByRole("button", { name: "Import 0 Projects" })).toBeDisabled(); expect(await screen.findByLabelText("Select private-repo")).toBeDisabled(); fireEvent.click(screen.getByLabelText("Select public-repo")); expect(screen.getByRole("button", { name: "Import 1 Projects" })).toBeEnabled(); });
  it("imports the selected repository", async () => { githubApi.status.mockResolvedValue({ connected: true, username: "octocat" }); githubApi.repositories.mockResolvedValue({ items: [repo], page: 1, size: 20, hasMore: false }); githubApi.import.mockResolvedValue({ imported: 1, skipped: 0, failed: 0 }); render(<GitHubImportPanel />); fireEvent.click(await screen.findByLabelText("Select public-repo")); fireEvent.click(screen.getByRole("button", { name: "Import 1 Projects" })); await waitFor(() => expect(githubApi.import).toHaveBeenCalledWith([1])); });
});
