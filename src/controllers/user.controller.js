import {
  deleteUserRow,
  selectAllUsers,
  selectUserByEmail,
  selectUsersByRole,
  updateUser,
} from "../models/user.model.js";
import bcrypt from "bcrypt";

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

export const getUsersByRole = async (request, response) => {
  try {
    const { role } = request.query;
    if (!role) return response.status(400).json({ message: "No role found" });
    const upperCaseRole = role.toUpperCase();

    if (!["ADMIN", "USER"].includes(upperCaseRole))
      return response.status(400).json({ message: "Invalid role" });

    if (upperCaseRole === "ADMIN" && request.user.role !== "ADMIN")
      return response.status(403).json({ message: "Forbidden! Not admin" });

    const users = await selectUsersByRole(upperCaseRole);
    if (!users.length)
      return response
        .status(404)
        .json({ message: `No users with "${upperCaseRole}" role yet` });
    return response.status(200).json({ users });
  } catch (err) {
    console.error(`Get all users failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const putUser = async (request, response) => {
  try {
    const { id } = request.params;
    const { name, email, password, role } = request.body;
    let hashPassword;
    const normalizedRole = role?.toUpperCase();

    if (!id)
      return response.status(400).json({ message: "No user ID or invalid" });

    if (email) {
      const userExist = await selectUserByEmail(email);
      if (userExist)
        return response.status(409).json({ message: "Email is already used" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    if (role) {
      if (!["ADMIN", "USER"].includes(normalizedRole))
        return response.status(400).json({ message: "Invalid role" });
    }

    const user = await updateUser(id, {
      name,
      email,
      password: hashPassword,
      role: normalizedRole,
    });
    if (!user) return response.status(404).json({ message: "User not found" });
    return response
      .status(200)
      .json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(`Put user failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;
    if (!id)
      return response.status(400).json({ message: "No user ID or invalid" });
    const user = await deleteUserRow(id);
    if (!user) return response.status(404).json({ message: "User not found" });
    return response.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(`Delete user failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};
