// components/BoardCard.js
import Link from "next/link";

export default function BoardCard({ board, onRename, onDelete }) {
  return (
    <div className="card">
      <h3>{board.name}</h3>
      <p className="meta">Created: {new Date(board.createdAt).toLocaleString()}</p>

      <Link href={`/board/${board.id}`} className="open">
        Open
      </Link>

      <div className="actions">
        <button className="rename" onClick={() => onRename(board)}>Rename</button>
        <button className="delete" onClick={() => onDelete(board.id)}>Delete</button>
      </div>

      <style jsx>{`
        .card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          background: #fff;
          box-shadow: 0 2px 8px rgba(2, 6, 23, 0.03);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .meta {
          color: #64748b;
          font-size: 12px;
          margin: 8px 0 12px;
        }
        .open {
          display: inline-block;
          padding: 6px 12px;
          background: #0ea5a4;
          color: #fff;
          border-radius: 6px;
          text-decoration: none;
          margin-bottom: 12px;
          text-align: center;
        }
        .actions {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }
        .rename {
          background: #f1f5f9;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
        .delete {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
