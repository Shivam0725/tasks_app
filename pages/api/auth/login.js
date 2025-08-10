import { getUserByEmail } from "../../../lib/db";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = getUserByEmail(email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials." });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials." });

  const token = signToken({ userId: user.id });
  setTokenCookie(res, token);

  const safeUser = { id: user.id, name: user.name, email: user.email };
  res.status(200).json({ user: safeUser });
}