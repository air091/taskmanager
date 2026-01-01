import {
  checkUserIsInTask,
  insertCollabToSubtask,
  selectSubtasksInTask,
  selectTasksByCollab,
} from "../models/collab.model.js";
import { selectSubtaskByCreator } from "../models/subTask.model.js";
import { selectTaskByCreated } from "../models/task.model.js";

export const getTasksByCollab = async (request, response) => {
  try {
    const tasks = await selectTasksByCollab(request.user.id);
    if (!tasks) return response.status(404).json({ message: "No tasks yet" });
    return response.status(200).json({ tasks });
  } catch (err) {
    console.error(`Get tasks by user failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const getSubtasksInTaskByUsers = async (request, response) => {
  try {
    const { taskId } = request.params;
    let checkUser = await selectTaskByCreated(taskId, request.user.id);
    if (!checkUser) {
      // if user not the owner of task
      checkUser = await checkUserIsInTask(taskId, request.user.id);
      // if user not in task collab
      if (!checkUser)
        return response.status(401).json({ message: "You are not in task" });
    }
    const subtasksByUser = await selectSubtasksInTask(taskId);
    return response.status(200).json({ userSubtasks: subtasksByUser });
  } catch (err) {
    console.error(`Get subtasks in task by users failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const postCollabToSubtask = async (request, response) => {
  try {
    const { subtaskId } = request.params;
    const { userId } = request.body;
    const isOwner = await selectSubtaskByCreator(subtaskId, request.user.id);
    if (!isOwner)
      return response
        .status(401)
        .json({ message: "Not authorized to add collab" });
    await insertCollabToSubtask(subtaskId, userId, request.user.id);
    return response.status(201).json({ message: "User added to collab" });
  } catch (err) {
    console.error(`Post collab to subtask failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};
