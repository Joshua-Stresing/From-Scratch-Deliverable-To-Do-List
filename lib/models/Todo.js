const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  user_id;
  description;
  complete;

  constructor(row) {
    this.id = row.id;
    this.user_id = row.user_id;
    this.description = row.description;
    this.complete = row.complete;
  }

  static async insert({ user_id, description }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos (description, qty, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [user_id, description]
    );

    return new Todo(rows[0]);
  }
};
