import { getUserFromReq } from "../../../lib/auth";
import { getBoardById, getTasksByBoardId } from "../../../lib/db";

export default function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method !== "GET") return res.status(405).end();
  const boardId = req.query.boardId;
  if (!boardId) return res.status(400).json({ error: "boardId required" });
  const board = getBoardById(boardId);
  if (!board) return res.status(404).json({ error: "Board not found" });
  if (board.userId !== user.id) return res.status(403).json({ error: "Forbidden" });

  const tasks = getTasksByBoardId(boardId);
  res.status(200).json({ tasks });
}