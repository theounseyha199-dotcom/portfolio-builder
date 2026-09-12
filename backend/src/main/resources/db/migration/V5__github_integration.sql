CREATE TABLE github_connections (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, github_user_id BIGINT NOT NULL, github_username VARCHAR(255), github_avatar_url TEXT, access_token TEXT NOT NULL, scope VARCHAR(255), connected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE github_oauth_states (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, state_hash VARCHAR(64) NOT NULL UNIQUE, expires_at TIMESTAMP NOT NULL, used BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);
ALTER TABLE projects ADD COLUMN github_repository_id BIGINT;
ALTER TABLE projects ADD COLUMN source VARCHAR(20) NOT NULL DEFAULT 'MANUAL';
CREATE UNIQUE INDEX uq_projects_portfolio_github_repository ON projects(portfolio_id, github_repository_id) WHERE github_repository_id IS NOT NULL;
CREATE INDEX idx_github_oauth_states_expires_at ON github_oauth_states(expires_at);
