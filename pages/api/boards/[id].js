import { getUserFromReq } from "../../../lib/auth";
import { getBoardById, updateBoard, deleteBoard } from "../../../lib/db";

export default function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const {
    query: { id }
  } = req;

  const board = getBoardById(id);
  if (!board) return res.status(404).json({ error: "Board not found" });
  if (board.userId !== user.id) return res.status(403).json({ error: "Forbidden" });

  if (req.method === "PUT") {
    const { name } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: "Name required." });
    const updated = updateBoard(id, { name: name.trim() });
    return res.status(200).json({ board: updated });
  }

  if (req.method === "DELETE") {
    deleteBoard(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}