import { selectAllUsers } from "../models/user.model.js";

export const getAllUsers = async (request, response) => {
  try {
    const users = await selectAllUsers();
    if (!users.length)
      return response.status(404).json({ message: "No users yet." });
    return response.status(200).json({ users });
  } catch (err) {
    console.error(`Get all users failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};
