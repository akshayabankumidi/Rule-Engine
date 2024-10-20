const createRulesTable = `
CREATE TABLE IF NOT EXISTS rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rule_string TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = createRulesTable;