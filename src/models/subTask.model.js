import pool from "../config/database.js";

// get subtask from task id
export const selectSubTasksByTask = async (taskId) => {
  const selectQuery = `SELECT * FROM subtask WHERE task_id = $1`;
  try {
    const results = await pool.query(selectQuery, [taskId]);
    return results.rows;
  } catch (err) {
    console.error(`Select all subtasks by taks failed ${err}`);
  }
};

export const selectSubtaskById = async (subtaskId) => {
  const selectQuery = `SELECT * FROM subtask WHERE id = $1`;
  try {
    const results = await pool.query(selectQuery, [taskId]);
    return results.rows[0];
  } catch (err) {
    console.error(`Select all subtasks by taks failed ${err}`);
  }
};

export const selectSubtaskByCreator = async (subtaskId, userId) => {
  const selectQuery = `SELECT id, created_by FROM subtask WHERE id = $1 AND created_by = $2`;
  try {
    const results = await pool.query(selectQuery, [subtaskId, userId]);
    return results.rows[0];
  } catch (err) {
    console.error(`Select all subtasks by taks failed ${err}`);
  }
};

export const insertSubTask = async (title, description, taskId, userId) => {
  const insertQuery = `INSERT INTO subtask (title, description, task_id, created_by)
                      VALUES ($1, $2, $3, $4)
                      RETURNING *`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await pool.query(insertQuery, [
      title,
      description,
      taskId,
      userId,
    ]);
    await client.query("COMMIT");
    return results.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Insert subtask failed ${err}`);
  } finally {
    client.release();
  }
};

export const updateSubTask = async (subTaskId, payload) => {
  const columns = {
    title: "title",
    description: "description",
    taskId: "task_id",
    status: "status",
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
  values.push(subTaskId);
  const updateQuery = `UPDATE subtask
                      SET ${fields.join(", ")}
                      WHERE id = $${index}
                      RETURNING *`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await pool.query(updateQuery, values);
    await client.query("COMMIT");
    return results.rows;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Update subtask failed ${err}`);
  } finally {
    client.release();
  }
};

export const deleteSubTask = async (taskId, subTaskId) => {
  const deleteQuery = `DELETE FROM subtask
                      WHERE task_id = $1 AND id = $2`;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const results = await pool.query(deleteQuery, [taskId, subTaskId]);
    await client.query("COMMIT");
    return results.rowCount;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`Update subtask failed ${err}`);
  } finally {
    client.release();
  }
};
