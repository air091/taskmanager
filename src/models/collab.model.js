import pool from "../config/database.js";

export const checkUserIsInTask = async (subtaskId, userId, creator) => {
  const checkQuery = `SELECT EXISTS (
                    SELECT 1
                    FROM subtask
                    JOIN collaborates ON subtask.id = collaborates.subtask_id
                    WHERE subtask.id = $1 AND (collaborates.user_id = $2 OR subtask.created_by = $3)
                    )`;
  try {
    const results = await pool.query(checkQuery, [subtaskId, userId, creator]);
    return results.rows[0].exists;
  } catch (err) {
    console.error(`Check user is in task failed ${err}`);
  }
};

export const selectTasksByCollab = async (userId) => {
  const selectQuery = `SELECT task.id AS taskId,
                      task.title AS taskTitle,
                      task.status,
                      collaborates.user_id AS collabs,
                      task.created_at AS createdAt,
                      task.updated_at AS updatedAt
                      FROM task
                      INNER JOIN subtask ON task.id = subtask.task_id
                      INNER JOIN collaborates ON subtask.id = collaborates.subtask_id
                      WHERE user_id = $1`;
  try {
    const results = await pool.query(selectQuery, [userId]);
    return results.rows;
  } catch (err) {
    console.error(`Select subtasks by user failed ${err}`);
  }
};

export const selectSubtasksInTask = async (taskId) => {
  const selectQuery = `SELECT task.id AS task_id,
                      subtask.title AS subtask_title,
                      subtask.status,
                      collaborates.user_id AS collabs,
                      subtask.created_at,
                      subtask.updated_at
                      FROM task
                      INNER JOIN subtask ON task.id = subtask.task_id
                      INNER JOIN collaborates ON subtask.id = collaborates.subtask_id
                      WHERE task.id = $1`;
  try {
    const results = await pool.query(selectQuery, [taskId]);
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
