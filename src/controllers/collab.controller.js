import { insertCollabToSubtask } from "../models/collab.model.js";
import { selectSubtaskByCreator } from "../models/subTask.model.js";

// export const getSubtasksByUser = async (request, response) => {
//   try {
//     const
//   } catch (err) {
//     console.error(`Get subtasks by user failed ${err}`);
//     return response.status(500).json({ message: err.message });
//   }
// };

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
