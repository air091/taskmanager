import {
  deleteSubTask,
  insertSubTask,
  selectSubtaskByCreator,
  selectSubTasksByTask,
  updateSubTask,
} from "../models/subTask.model.js";
import { selectTaskByCreated } from "../models/task.model.js";

export const getAllSubTaskByTask = async (request, response) => {
  try {
    const { taskId } = request.params; // Task id
    const subtasks = await selectSubTasksByTask(taskId);
    if (!subtasks.length)
      return response.status(404).json({ message: "No subtasks yet" });
    return response.status(200).json({ subtasks });
  } catch (err) {
    console.error(`Get all subtask by task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const postSubTask = async (request, response) => {
  try {
    const { taskId } = request.params; // Task id
    const { title, description } = request.body;
    if (!title)
      return response.status(400).json({ message: "Title is required" });

    const isOwner = await selectTaskByCreated(taskId, request.user.id);
    if (!isOwner)
      return response
        .status(401)
        .json({ message: "Not authorized to create a subtask" });

    const subtask = await insertSubTask(
      title,
      description,
      taskId,
      request.user.id,
    );
    return response
      .status(201)
      .json({ message: "Subtask created successfully", subtask });
  } catch (err) {
    console.error(`Post task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const putSubTask = async (request, response) => {
  try {
    const { subtaskId, taskId } = request.params; // subtask id & task id
    const { title, description, status } = request.body;
    const isOwner = await selectSubtaskByCreator(subtaskId, request.user.id);
    if (!isOwner)
      return response
        .status(401)
        .json({ message: "Not authorized to update the subtask" });
    const subtask = await updateSubTask(subtaskId, {
      title,
      description,
      taskId,
      status,
    });
    return response
      .status(200)
      .json({ message: "Subtask updated successfully", subtask });
  } catch (err) {
    console.error(`Put task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const deleteSubTaskController = async (request, response) => {
  try {
    const { taskId, subtaskId } = request.params;
    const isOwner = await selectSubtaskByCreator(subtaskId, request.user.id);
    if (!isOwner)
      return response
        .status(401)
        .json({ message: "Not authorized to update the subtask" });
    const subtask = await deleteSubTask(taskId, subtaskId);
    if (!subtask)
      return response.status(404).json({ message: "Subtask not found" });

    return response
      .status(200)
      .json({ message: "Subtask deleted successfully" });
  } catch (err) {
    console.error(`Delete task failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};
