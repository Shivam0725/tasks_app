import Link from "next/link";

export default function BoardCard({ board, onRename, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{board.name}</h3>
        <span className="created-date">
          Created: {new Date(board.createdAt).toLocaleDateString()}
        </span>
      </div>
      
      <Link href={`/board/${board.id}`} className="open-btn">
        Open Board
      </Link>

      <div className="card-actions">
        <button className="action-btn rename-btn" onClick={() => onRename(board)}>
          Rename
        </button>
        <button className="action-btn delete-btn" onClick={() => onDelete(board.id)}>
          Delete
        </button>
      </div>

      <style jsx>{`
        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
          margin-bottom: 15px;
        }
        
        .card-header h3 {
          margin: 0 0 5px 0;
          font-size: 18px;
          color: #0f172a;
        }
        
        .created-date {
          color: #64748b;
          font-size: 12px;
        }
        
        .open-btn {
          display: inline-block;
          background: #4f46e5;
          color: white;
          padding: 10px 15px;
          border-radius: 6px;
          text-align: center;
          text-decoration: none;
          font-weight: 500;
          margin: 15px 0;
          transition: background 0.2s;
        }
        
        .open-btn:hover {
          background: #4338ca;
        }
        
        .card-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }
        
        .action-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .rename-btn {
          background: #e0e7ff;
          color: #4f46e5;
        }
        
        .rename-btn:hover {
          background: #c7d2fe;
        }
        
        .delete-btn {
          background: #fee2e2;
          color: #b91c1c;
        }
        
        .delete-btn:hover {
          background: #fecaca;
        }
      `}</style>
    </div>
  );
}