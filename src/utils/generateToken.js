import { SignJWT } from "jose";
import dotenv from "dotenv";

dotenv.config();
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const generateToken = async (userId, response) => {
  const payload = { id: userId };
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(process.env.JWT_EXPIRES_IN)
    .sign(secret);

  response.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * parseInt(process.env.JWT_EXPIRES_IN),
  });

  return token;
};
