import pool from "../config/database.js";

// get task by user
export const selectTasksByUser = async (userId) => {
  const selectQuery = `SELECT * FROM task WHERE created_by = $1`;
  try {
    const results = await pool.query(selectQuery, [userId]);
    return results.rows;
  } catch (err) {
    console.error(`Select task by user failed ${err}`);
  }
};

// get task owner
export const selectTaskByCreated = async (taskId, userId) => {
  const selectQuery = `SELECT id, created_by FROM task WHERE id = $1 AND created_by = $2`;
  try {
    const results = await pool.query(selectQuery, [taskId, userId]);
    return results.rows[0];
  } catch (err) {
    console.error(`Select task by created failed ${err}`);
  }
};

export const selectTaskById = async (taskId) => {
  const selectQuery = `SELECT id FROM task WHERE id = $1`;
  try {
    const results = await pool.query(selectQuery, [taskId]);
    return results.rows[0];
  } catch (err) {
    console.error(`Select task by created failed ${err}`);
  }
};

// create task
export const insertTask = async (title, description, userId) => {
  const selectQuery = `INSERT INTO task (title, description, created_by)
                        VALUES ($1, $2, $3)
                        RETURNING *`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(selectQuery, [
      title,
      description,
      userId,
    ]);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Insert task failed ${err}`);
  } finally {
    client.release();
  }
};

export const updateTask = async (taskId, payload, userId) => {
  const columns = {
    title: "title",
    description: "description",
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
  values.push(taskId);
  values.push(userId);
  const updateQuery = `UPDATE task
                      SET ${fields.join(", ")}
                      WHERE id = $${index++} AND created_by = $${index}
                      RETURNING *`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(updateQuery, values);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Insert task failed ${err}`);
  } finally {
    client.release();
  }
};

export const deleteTask = async (taskId, userId) => {
  const deleteQuery = `DELETE FROM task WHERE id = $1 AND created_by = $2`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(deleteQuery, [taskId, userId]);
    await client.query("COMMIT");
    return results.rowCount;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Insert task failed ${err}`);
  } finally {
    client.release();
  }
};
