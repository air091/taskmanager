import { insertUser, selectUserByEmail } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (request, response) => {
  try {
    const { name, email, password, role = "USER" } = request.body;
    if (!name || !email || !password)
      return response.status(400).json({ message: "All fields are required" });
    const userExist = await selectUserByEmail(email);
    if (userExist)
      return response.status(400).json({ message: "Email already used" });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await insertUser(name, email, hashPassword, role);
    await generateToken(user.id, response);
    return response
      .status(201)
      .json({ message: "User signed up successfully" });
  } catch (err) {
    console.log(`Signup failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const signin = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password)
      return response.status(400).json({ message: "All fields are required" });
    const user = await selectUserByEmail(email);
    if (!user) return response.status(404).json({ message: "Email not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return response
        .status(401)
        .json({ message: "Email or password is incorrect" });

    await generateToken(user.id, response);
    return response
      .status(200)
      .json({ message: "User signed in successfully" });
  } catch (err) {
    console.log(`Sign in failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const signout = async (request, response) => {
  try {
    response.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    return response
      .status(200)
      .json({ message: "User signed out successfully" });
  } catch (err) {
    console.log(`Sign out failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};

export const getMe = async (request, response) => {
  try {
    return response.status(200).json({ user: request.user });
  } catch (err) {
    console.log(`Get me failed ${err}`);
    return response.status(500).json({ message: err.message });
  }
};
