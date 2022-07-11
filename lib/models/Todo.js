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

  static async insert({ description, user_id }) {
    // console.log({ description, user_id });
    const { rows } = await pool.query(
      `
      INSERT INTO todos (description, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [description, user_id]
    );
    // console.log('row test', rows[0]);
    return new Todo(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      `
      SELECT * FROM todos WHERE user_id = $1
      `,
      [user_id]
    );
    return rows.map((data) => new Todo(data));
  }
};
