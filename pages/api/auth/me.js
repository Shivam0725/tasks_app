// pages/api/auth/me.js
import { getTokenFromReq, verifyToken } from "../../../lib/auth";
import { getUserById } from "../../../lib/db";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const token = getTokenFromReq(req);
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) return res.status(401).json({ error: "Invalid token" });

  const user = getUserById(decoded.userId);
  if (!user) return res.status(401).json({ error: "User not found" });

  const safeUser = { id: user.id, name: user.name, email: user.email };
  res.status(200).json({ user: safeUser });
}
