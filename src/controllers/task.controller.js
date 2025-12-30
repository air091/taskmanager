import {
  deleteTask,
  insertTask,
  selectTaskByCreated,
  selectTaskById,
  selectTasksByUser,
  updateTask,
} from "../models/task.model.js";

export const getTasksByUser = async (request, response) => {
  try {
    const tasks = await selectTasksByUser(request.user.id);
    if (!tasks.length)
      return response.status(404).json({ message: "No task yet" });
    return response.status(200).json({ tasks });
  } catch (err) {
    console.error(`Get task by user failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const postTask = async (request, response) => {
  try {
    const { title, description } = request.body;
    if (!title)
      return response.status(400).json({ message: "Title is required" });
    const task = await insertTask(title, description, request.user.id);
    return response
      .status(201)
      .json({ message: "Task created successfully", task });
  } catch (err) {
    console.error(`Post task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const putTask = async (request, response) => {
  try {
    const { id } = request.params;
    const { title, description } = request.body;
    if (!title)
      return response.status(400).json({ message: "Title is required" });
    // is owner?
    const isOwner = await selectTaskByCreated(id, request.user.id);
    if (!isOwner)
      return response.status(401).json({
        message: "You are not authorized to update the task",
      });

    const task = await updateTask(id, { title, description }, request.user.id);
    if (!task) return response.status(404).json({ message: task });
    return response
      .status(201)
      .json({ message: "Task updated successfully", task });
  } catch (err) {
    console.error(`Put task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const deleteTaskController = async (request, response) => {
  try {
    const { id } = request.params;

    const taskExist = await selectTaskById(id);
    if (!taskExist)
      return response.status(404).json({ message: "Task not found" });
    const isOwner = await selectTaskByCreated(id, request.user.id);
    if (!isOwner)
      return response.status(401).json({
        message: "You are not authorized to delete the task",
      });
    await deleteTask(id, request.user.id);
    return response.status(200).json({ message: "Task deleted succcessfully" });
  } catch (err) {
    console.error(`Put task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};
