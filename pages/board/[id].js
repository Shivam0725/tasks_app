// pages/board/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function BoardPage() {
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    async function load() {
      // Ensure user is authenticated and board belongs to user
      const meRes = await fetch("/api/auth/me");
      if (meRes.status !== 200) return router.push("/");

      // Get board list and find this one (reuse /api/boards)
      const boardsRes = await fetch("/api/boards");
      if (!boardsRes.ok) return router.push("/dashboard");
      const boardsData = await boardsRes.json();
      const found = (boardsData.boards || []).find((b) => b.id === id);
      if (!found) {
        alert("Board not found or you don't have access");
        return router.push("/dashboard");
      }
      setBoard(found);

      // Fetch tasks for board
      const tasksRes = await fetch(`/api/boards/tasks?boardId=${id}`);
      if (!tasksRes.ok) {
        setTasks([]);
        setLoading(false);
        return;
      }
      const tdata = await tasksRes.json();
      setTasks(tdata.tasks || []);
      setLoading(false);
    }
    load();
  }, [id]);

  async function addTask(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) return setErr("Title required");
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId: id, title, description: desc, dueDate: due }),
    });
    const data = await res.json();
    if (!res.ok) return setErr(data.error || "Failed to add task");
    setTasks((s) => [data.task, ...s]);
    setTitle("");
    setDesc("");
    setDue("");
  }

  async function toggleStatus(task) {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setTasks((s) => s.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    }
  }

  async function deleteTaskById(taskId) {
    if (!confirm("Delete task?")) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (res.ok) setTasks((s) => s.filter((t) => t.id !== taskId));
  }

  return (
    <Layout>
      <div>
        <button onClick={() => router.push("/dashboard")} className="btn" style={{ background: "#64748b" }}>
          ← Back
        </button>

        <h2 style={{ marginTop: 16 }}>{board?.name}</h2>
        <p className="small">Board ID: {id}</p>

        <div style={{ marginTop: 12 }} className="form">
          <h3>Add task</h3>
          <form onSubmit={addTask}>
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="input" placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            {err && <p style={{ color: "crimson" }}>{err}</p>}
            <button className="btn" type="submit">
              Add Task
            </button>
          </form>
        </div>

        <div style={{ marginTop: 20 }}>
          <h3>Tasks</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="small">No tasks yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {tasks.map((t) => (
                <div key={t.id} className="task" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ textDecoration: t.status === "completed" ? "line-through" : "none" }}>{t.title}</strong>
                    <div className="small">{t.description}</div>
                    <div className="small">Due: {t.dueDate || "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => toggleStatus(t)} className="btn">
                      {t.status === "pending" ? "Mark done" : "Mark pending"}
                    </button>
                    <button onClick={() => deleteTaskById(t.id)} style={{ background: "#ef4444" }} className="btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
