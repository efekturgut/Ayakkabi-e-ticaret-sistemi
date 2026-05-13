const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
    SELECT *
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await pool.query(
    `
    SELECT id, name, email, role, created_at AS "createdAt"
    FROM users
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};

const createUser = async ({ name, email, hashedPassword }) => {
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, 'user')
    RETURNING id, name, email, role, created_at AS "createdAt"
    `,
    [name, email, hashedPassword]
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};