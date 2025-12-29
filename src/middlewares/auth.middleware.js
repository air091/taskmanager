import { jwtVerify } from "jose";
import { selectUserById } from "../models/user.model.js";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const authMiddleware = async (request, response, next) => {
  try {
    const token = request.cookies?.jwt;
    if (!token)
      return response.status(401).json({ message: "No token or expired" });
    const { payload } = await jwtVerify(token, secret);
    const user = await selectUserById(payload.id);
    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err) {
    console.log(`Auth middleware failed ${err}`);
    return response.status(401).json({ message: "Invalid or expired" });
  }
};
