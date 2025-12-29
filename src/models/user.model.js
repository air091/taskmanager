import pool from "../config/database.js";

export const selectAllUsers = async () => {
  const selectQuery = `SELECT id, name, email, role, created_at, updated_at FROM users`;
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

export const updateUser = async (userId, payload) => {
  const columns = {
    name: "name",
    email: "email",
    password: "password",
    role: "role",
  };
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, column] of Object.entries(columns)) {
    if (payload[key] !== undefined) {
      fields.push(`${column} = $${index}`);
      values.push(payload[key]);
      index++;
    }
  }
  fields.push(`updated_at = NOW()`);
  values.push(userId);
  const updateQuery = `UPDATE users
                      SET ${fields.join(", ")}
                      WHERE id = $${index}
                      RETURNING id, name, email, role`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(updateQuery, values);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    console.error(`Update user failed ${err}`);
  }
};

export const deleteUserRow = async (userId) => {
  const deleteQuery = `DELETE FROM users WHERE id = $1`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(deleteQuery, [userId]);
    await client.query("COMMIT");
    return results.rowCount;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Delete user row failed ${err}`);
  } finally {
    client.release();
  }
};
