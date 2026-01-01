import pool from "../config/database.js";

export const selectSubtasksByUser = async (userId) => {
  const selectQuery = `SELECT * FROM collaborates WHERE user_id = $1`;
  try {
    const results = await pool.query(selectQuery, [userId]);
    return results.rows;
  } catch (err) {
    console.error(`Select subtasks by user failed ${err}`);
  }
};

export const insertCollabToSubtask = async (subtaskId, userId, addedBy) => {
  const insertQuery = `INSERT INTO collaborates (subtask_id, user_id, added_by)
                      VALUES ($1, $2, $3)`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(insertQuery, [
      subtaskId,
      userId,
      addedBy,
    ]);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Select all subtask by user failed ${err}`);
  } finally {
    client.release();
  }
};

export const removeCollabFromSubtask = async (subtaskId, userId) => {
  const removeQuery = `REMOVE FROM collaborates
                      WHERE subtask_id = $1 AND user_id = $2)`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await client.query(removeQuery, [
      subtaskId,
      userId,
      addedBy,
    ]);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Select all subtask by user failed ${err}`);
  } finally {
    client.release();
  }
};
