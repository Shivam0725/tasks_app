import { addUser, getUserByEmail } from "../../../lib/db";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required." });
  }

  const existing = getUserByEmail(email.toLowerCase());
  if (existing) return res.status(409).json({ error: "User with this email already exists." });

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = {
    id: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name,
    email: email.toLowerCase(),
    passwordHash
  };

  addUser(user);

  const token = signToken({ userId: user.id });
  setTokenCookie(res, token);

  // return user minus passwordHash
  const safeUser = { id: user.id, name: user.name, email: user.email };
  res.status(201).json({ user: safeUser });
}