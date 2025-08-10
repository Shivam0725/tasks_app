// pages/api/auth/register.js

import { addUser, getUserByEmail } from "../../../lib/db";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed. Use POST." });
    }

    const { name, email, password } = req.body || {};

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email and password are required."
      });
    }

    // Check if user exists
    const existing = getUserByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({
        error: "User with this email already exists."
      });
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Create new user object
    const user = {
      id: "u_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name,
      email: email.toLowerCase(),
      passwordHash
    };

    // Save user
    addUser(user);

    // Generate JWT and set cookie
    const token = signToken({ userId: user.id });
    setTokenCookie(res, token);

    // Return safe user data
    const safeUser = { id: user.id, name: user.name, email: user.email };
    return res.status(201).json({ user: safeUser });

  } catch (error) {
    console.error("Register API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
