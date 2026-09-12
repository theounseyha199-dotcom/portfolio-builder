CREATE TABLE portfolio_sections (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
 section_type VARCHAR(30) NOT NULL, position INTEGER NOT NULL, enabled BOOLEAN NOT NULL DEFAULT TRUE,
 CONSTRAINT uq_portfolio_sections_type UNIQUE(portfolio_id, section_type)
);
CREATE INDEX idx_portfolio_sections_portfolio_id ON portfolio_sections(portfolio_id);
