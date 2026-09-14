ALTER TABLE portfolio_sections ADD COLUMN layout VARCHAR(30);
ALTER TABLE portfolio_sections ADD COLUMN alignment VARCHAR(10);
ALTER TABLE portfolio_sections ADD COLUMN background VARCHAR(10);
ALTER TABLE portfolio_sections ADD COLUMN spacing VARCHAR(10);
UPDATE portfolio_sections SET section_type = 'SOCIAL' WHERE section_type = 'CONTACT';
INSERT INTO portfolio_sections (portfolio_id, section_type, position, enabled)
SELECT p.id, 'RESUME', COALESCE(MAX(s.position), 0) + 1, TRUE FROM portfolios p
LEFT JOIN portfolio_sections s ON s.portfolio_id = p.id GROUP BY p.id
ON CONFLICT (portfolio_id, section_type) DO NOTHING;
