const db = require('../db/db.js');

class Rule {
  static async create(name, ruleString) {
    const query = 'INSERT INTO rules (name, rule_string) VALUES ($1, $2) RETURNING id';
    const result = await db.query(query, [name, ruleString]);
    return result.rows[0].id;
  }

  static async getById(id) {
    const query = 'SELECT * FROM rules WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM rules';
    const result = await db.query(query);
    return result.rows;
  }
}

module.exports = Rule;