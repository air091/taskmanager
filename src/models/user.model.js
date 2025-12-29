import pool from "../config/database.js";

export const selectAllUsers = async () => {
  const selectQuery = `SELECT id, name, email, role FROM users`;
  try {
    const results = await pool.query(selectQuery);
    return results.rows;
  } catch (err) {
    console.error(`Select all users failed ${err}`);
  }
};

export const selectUserById = async (userId) => {
  const selectQuery = `SELECT id, name, email, password, role FROM users WHERE id = $1`;
  try {
    const results = await pool.query(selectQuery, [userId]);
    return results.rows[0];
  } catch (err) {
    console.error(`Select all users failed ${err}`);
  }
};

export const selectUserByEmail = async (email) => {
  const selectQuery = `SELECT id, name, email, password, role FROM users WHERE email = $1`;
  try {
    const results = await pool.query(selectQuery, [email]);
    return results.rows[0];
  } catch (err) {
    console.error(`Select all users failed ${err}`);
  }
};

export const insertUser = async (name, email, password, role) => {
  const insertQuery = `INSERT INTO users (name, email, password, role)
                      VALUES ($1, $2, $3, $4)
                      RETURNING id, name, role`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(insertQuery, [
      name,
      email,
      password,
      role,
    ]);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Insert user failed ${err}`);
  } finally {
    client.release();
  }
};
