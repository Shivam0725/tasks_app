// pages/api/tasks/[id].js
import { getUserFromReq } from "../../../lib/auth";
import { getTaskById, getBoardById, updateTask, deleteTask } from "../../../lib/db";

export default function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const {
    query: { id },
  } = req;

  if (!id) return res.status(400).json({ error: "Task id required" });

  const task = getTaskById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const board = getBoardById(task.boardId);
  if (!board) return res.status(404).json({ error: "Board not found" });
  if (board.userId !== user.id) return res.status(403).json({ error: "Forbidden" });

  if (req.method === "PUT") {
    const { title, description, status, dueDate } = req.body || {};
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate;

    const updated = updateTask(id, updates);
    if (!updated) return res.status(500).json({ error: "Failed to update task" });
    return res.status(200).json({ task: updated });
  }

  if (req.method === "DELETE") {
    deleteTask(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
