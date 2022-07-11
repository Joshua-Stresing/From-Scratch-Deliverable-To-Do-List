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
    const { rows } = await pool.query(
      `
      INSERT INTO todos (description, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [description, user_id]
    );
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

  static async getById(id) {
    const { rows } = await pool.query(
      `
    SELECT * FROM todos WHERE id=$1
    `,
      [id]
    );
    if (!rows[0]) {
      return null;
    }
    return new Todo(rows[0]);
  }

  static async updateById(id, update) {
    const data = await Todo.getById(id);
    if (!data) return null;
    const { description, complete } = { ...data, ...update };
    const { rows } = await pool.query(
      `
      UPDATE todos SET description=$2, complete=$3 WHERE id=$1 RETURNING *
      `,
      [id, description, complete]
    );
    return new Todo(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );
    return new Todo(rows[0]);
  }
};
