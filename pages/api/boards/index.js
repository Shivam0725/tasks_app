// pages/api/boards/index.js
import { getUserFromReq } from "../../../lib/auth";
import { getBoardsByUserId, addBoard } from "../../../lib/db";

export default function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const boards = getBoardsByUserId(user.id);
    return res.status(200).json({ boards });
  }

  if (req.method === "POST") {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "Board name is required." });

    const board = {
      id: "b_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      userId: user.id,
      name: name.trim(),
      createdAt: new Date().toISOString()
    };
    addBoard(board);
    return res.status(201).json({ board });
  }

  return res.status(405).end();
}
