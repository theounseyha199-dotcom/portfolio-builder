-- Existing values are intentionally not treated as ciphertext. Connections made
-- before token encryption must be re-authorized through the GitHub OAuth flow.
ALTER TABLE github_connections RENAME COLUMN access_token TO encrypted_access_token;
