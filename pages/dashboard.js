// pages/dashboard.js
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
      {/* Personalized welcome */}
      {user && (
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#218a8aff",
            marginBottom: "0.25rem"
          }}
        >
          Welcome {user.name} 
        </h1>
      )}
     
      <h2 style={{ marginTop: "0.5rem" }}>Dashboard</h2>

      <div style={{ marginTop: 16, marginBottom: 20 }}>
        <form onSubmit={createBoard} style={{ display: "flex", gap: 8 }}>
          <input
            className="input"
            placeholder="New board name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />
          <button className="btn" type="submit">
            Create
          </button>
        </form>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {boards.length === 0 ? (
            <p className="small">No boards yet. Create one above.</p>
          ) : (
            <div className="grid">
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
        </>
      )}
    </Layout>
  );
}
