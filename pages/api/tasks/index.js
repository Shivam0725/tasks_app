// pages/api/tasks/index.js
import { getUserFromReq } from "../../../lib/auth";
import { getBoardById, createTask } from "../../../lib/db";

export default function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { boardId, title, description, dueDate } = req.body || {};
    if (!boardId || !title || !title.trim()) {
      return res.status(400).json({ error: "boardId and title are required" });
    }

    const board = getBoardById(boardId);
    if (!board) return res.status(404).json({ error: "Board not found" });
    if (board.userId !== user.id) return res.status(403).json({ error: "Forbidden" });

    const task = {
      id: "t_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      boardId,
      title: title.trim(),
      description: description || "",
      status: "pending",
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };

    createTask(task);
    return res.status(201).json({ task });
  }

  return res.status(405).end();
}
