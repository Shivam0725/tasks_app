// lib/auth.js
import jwt from "jsonwebtoken";
import { getUserById } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const TOKEN_NAME = "token";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// Parse cookie header to get token string
export function getTokenFromReq(req) {
  const cookie = req.headers.cookie || "";
  const parts = cookie.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(TOKEN_NAME + "=")) {
      return decodeURIComponent(p.split("=")[1]);
    }
  }
  return null;
}

export function setTokenCookie(res, token) {
  // HttpOnly, secure when production (only over https). SameSite strict for security.
  const secure = process.env.NODE_ENV === "production";
  const cookie = `${TOKEN_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${secure ? "; Secure" : ""}`;
  res.setHeader("Set-Cookie", cookie);
}

export function clearTokenCookie(res) {
  const cookie = `${TOKEN_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`;
  res.setHeader("Set-Cookie", cookie);
}

// returns user object or null
export function getUserFromReq(req) {
  const token = getTokenFromReq(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) return null;
  return getUserById(decoded.userId) || null;
}
