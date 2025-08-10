import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import BoardCard from "../components/BoardCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boardName, setBoardName] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const me = await fetch("/api/auth/me");
      if (me.status === 200) {
        const { user } = await me.json();
        setUser(user);
        const res = await fetch("/api/boards");
        if (res.ok) {
          const data = await res.json();
          setBoards(data.boards || []);
        }
        setLoading(false);
      } else {
        router.push("/");
      }
    }
    load();
  }, []);

  async function createBoard(e) {
    e.preventDefault();
    setErr("");
    if (!boardName.trim()) return setErr("Board name required");
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: boardName.trim() })
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Could not create board");
    setBoards((s) => [data.board, ...s]);
    setBoardName("");
  }

  async function deleteBoard(id) {
    if (!confirm("Delete this board and its tasks?")) return;
    const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
    if (res.ok) setBoards((s) => s.filter((b) => b.id !== id));
  }

  async function renameBoard(board) {
    const name = prompt("Rename board", board.name);
    if (!name) return;
    const res = await fetch(`/api/boards/${board.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (res.ok) {
      setBoards((s) =>
        s.map((b) => (b.id === board.id ? { ...b, name } : b))
      );
    }
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name || 'User'} 👋</h1>
            <p className="subtitle">Manage your task boards</p>
          </div>
          
          <form onSubmit={createBoard} className="board-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="New board name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="board-input"
              />
              <button type="submit" className="create-btn">
                Create Board
              </button>
            </div>
            {err && <p className="error-message">{err}</p>}
          </form>
        </div>

        <div className="boards-container">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : boards.length === 0 ? (
            <div className="empty-state">
              <p>No boards yet. Create your first board above!</p>
            </div>
          ) : (
            <div className="boards-grid">
              {boards.map((b) => (
                <BoardCard
                  key={b.id}
                  board={b}
                  onRename={renameBoard}
                  onDelete={deleteBoard}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .dashboard-header {
          position: sticky;
          top: 0;
          background: var(--bg);
          padding: 20px 0;
          z-index: 10;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }
        
        .welcome-section h1 {
          font-size: 28px;
          margin: 0 0 5px 0;
          color: #0f172a;
        }
        
        .subtitle {
          color: #64748b;
          margin: 0 0 20px 0;
          font-size: 16px;
        }
        
        .board-form {
          margin-top: 20px;
        }
        
        .input-group {
          display: flex;
          gap: 10px;
          max-width: 600px;
        }
        
        .board-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }
        
        .board-input:focus {
          outline: none;
          border-color: #4f46e5;
        }
        
        .create-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
          white-space: nowrap;
        }
        
        .create-btn:hover {
          background: #4338ca;
        }
        
        .error-message {
          color: #dc2626;
          margin-top: 10px;
          font-size: 14px;
        }
        
        .boards-container {
          margin-top: 20px;
        }
        
        .loading-spinner {
          border: 3px solid #e2e8f0;
          border-top: 3px solid #4f46e5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 50px auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          background: #f8fafc;
          border-radius: 8px;
          color: #64748b;
        }
        
        .boards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
      `}</style>
    </Layout>
  );
}