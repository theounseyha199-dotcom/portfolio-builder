CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL, position VARCHAR(255) NOT NULL, location VARCHAR(255), start_date DATE NOT NULL, end_date DATE,
  currently_working BOOLEAN NOT NULL DEFAULT FALSE, description TEXT, sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((currently_working = FALSE AND (end_date IS NULL OR end_date >= start_date)) OR (currently_working = TRUE AND end_date IS NULL))
);
CREATE TABLE educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  school VARCHAR(255) NOT NULL, degree VARCHAR(255), major VARCHAR(255), start_date DATE, end_date DATE, description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, category VARCHAR(100), sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT uq_skills_portfolio_name UNIQUE (portfolio_id, name)
);
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, short_description TEXT, description TEXT, thumbnail_url TEXT, github_url TEXT, demo_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE, sort_order INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_projects_portfolio_slug UNIQUE (portfolio_id, slug)
);
CREATE TABLE project_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology VARCHAR(100) NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, url TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT uq_social_links_portfolio_platform UNIQUE (portfolio_id, platform)
);
CREATE INDEX idx_experiences_portfolio_id ON experiences(portfolio_id);
CREATE INDEX idx_educations_portfolio_id ON educations(portfolio_id);
CREATE INDEX idx_skills_portfolio_id ON skills(portfolio_id);
CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX idx_social_links_portfolio_id ON social_links(portfolio_id);
