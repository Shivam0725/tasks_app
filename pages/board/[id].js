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
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!id) return;
    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.status !== 200) return router.push("/");

        const [boardsRes, tasksRes] = await Promise.all([
          fetch("/api/boards"),
          fetch(`/api/boards/tasks?boardId=${id}`)
        ]);

        if (!boardsRes.ok) return router.push("/dashboard");
        
        const boardsData = await boardsRes.json();
        const found = (boardsData.boards || []).find((b) => b.id === id);
        if (!found) {
          alert("Board not found or you don't have access");
          return router.push("/dashboard");
        }
        setBoard(found);

        if (tasksRes.ok) {
          const tdata = await tasksRes.json();
          setTasks(tdata.tasks || []);
        }
      } catch (error) {
        console.error("Failed to load board:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function addTask(e) {
    e.preventDefault();
    setErr("");
    if (!title.trim()) return setErr("Title is required");
    
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          boardId: id, 
          title: title.trim(), 
          description: desc, 
          dueDate: due 
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add task");
      
      setTasks((s) => [data.task, ...s]);
      setTitle("");
      setDesc("");
      setDue("");
    } catch (error) {
      setErr(error.message);
    }
  }

  async function toggleStatus(task) {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (res.ok) {
        setTasks((s) => s.map((t) => 
          t.id === task.id ? { ...t, status: newStatus } : t
        ));
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  async function deleteTaskById(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((s) => s.filter((t) => t.id !== taskId));
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === "all") return true;
    return task.status === activeFilter;
  });

  return (
    <Layout>
      <div className="board-container">
        <div className="board-header">
          <button 
            onClick={() => router.push("/dashboard")} 
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
          
          <div className="board-meta">
            <h1>{board?.name || "Loading..."}</h1>
            {board && (
              <p className="meta">
                Created: {new Date(board.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="task-form-section">
          <div className="task-form-card">
            <h2>Add New Task</h2>
            <form onSubmit={addTask} className="task-form">
              <div className="form-group">
                <input
                  className="form-input"
                  placeholder="Task title*"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <textarea
                  className="form-input"
                  placeholder="Description (optional)"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows="3"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                  />
                </div>
                
                <button type="submit" className="submit-btn">
                  Add Task
                </button>
              </div>
              
              {err && <p className="error-message">{err}</p>}
            </form>
          </div>
        </div>

        <div className="task-list-section">
          <div className="task-list-header">
            <h2>Tasks</h2>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All ({tasks.length})
              </button>
              <button
                className={`filter-tab ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending ({tasks.filter(t => t.status === "pending").length})
              </button>
              <button
                className={`filter-tab ${activeFilter === "completed" ? "active" : ""}`}
                onClick={() => setActiveFilter("completed")}
              >
                Completed ({tasks.filter(t => t.status === "completed").length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <p>{activeFilter === "all" 
                ? "No tasks yet. Add your first task above!" 
                : `No ${activeFilter} tasks found.`}
              </p>
            </div>
          ) : (
            <div className="task-grid">
              {filteredTasks.map((t) => (
                <div 
                  key={t.id} 
                  className={`task-card ${t.status}`}
                >
                  <div className="task-content">
                    <div className="task-header">
                      <h3 className={t.status === "completed" ? "completed" : ""}>
                        {t.title}
                      </h3>
                      <span className={`status-badge ${t.status}`}>
                        {t.status}
                      </span>
                    </div>
                    
                    {t.description && (
                      <p className="task-description">{t.description}</p>
                    )}
                    
                    {t.dueDate && (
                      <div className="task-meta">
                        <span className="due-date">
                          📅 Due: {new Date(t.dueDate).toLocaleDateString()}
                        </span>
                        <span className="created-date">
                          Created: {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="task-actions">
                    <button
                      onClick={() => toggleStatus(t)}
                      className={`action-btn ${t.status === "pending" ? "complete-btn" : "reopen-btn"}`}
                    >
                      {t.status === "pending" ? "✓ Complete" : "↻ Reopen"}
                    </button>
                    <button
                      onClick={() => deleteTaskById(t.id)}
                      className="action-btn delete-btn"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .board-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .board-header {
          margin-bottom: 30px;
        }
        
        .back-btn {
          background: none;
          border: none;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 15px;
          padding: 5px 0;
        }
        
        .back-btn:hover {
          color: #4f46e5;
        }
        
        .board-meta h1 {
          font-size: 28px;
          margin: 0 0 5px 0;
          color: #0f172a;
        }
        
        .meta {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }
        
        .task-form-section {
          margin-bottom: 40px;
        }
        
        .task-form-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        
        .task-form-card h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
          align-items: flex-end;
        }
        
        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
        }
        
        textarea.form-input {
          min-height: 80px;
          resize: vertical;
        }
        
        .submit-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          height: 40px;
          white-space: nowrap;
        }
        
        .submit-btn:hover {
          background: #4338ca;
        }
        
        .error-message {
          color: #dc2626;
          margin-top: 10px;
          font-size: 14px;
        }
        
        .task-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .filter-tabs {
          display: flex;
          gap: 8px;
        }
        
        .filter-tab {
          background: #e2e8f0;
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .filter-tab.active {
          background: #4f46e5;
          color: white;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }
        
        .spinner {
          border: 3px solid #e2e8f0;
          border-top: 3px solid #4f46e5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;
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
        
        .task-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .task-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border-left: 4px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .task-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .task-card.pending {
          border-left-color: #f59e0b;
        }
        
        .task-card.completed {
          border-left-color: #10b981;
          opacity: 0.8;
        }
        
        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }
        
        .task-header h3 {
          margin: 0;
          font-size: 18px;
        }
        
        .task-header h3.completed {
          text-decoration: line-through;
          color: #64748b;
        }
        
        .status-badge {
          font-size: 12px;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }
        
        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }
        
        .task-description {
          color: #475569;
          font-size: 14px;
          margin: 10px 0;
          white-space: pre-wrap;
        }
        
        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 12px;
          color: #64748b;
          margin-top: 15px;
        }
        
        .task-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }
        
        .action-btn {
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          flex: 1;
          transition: all 0.2s;
        }
        
        .complete-btn {
          background: #e0e7ff;
          color: #4f46e5;
        }
        
        .complete-btn:hover {
          background: #c7d2fe;
        }
        
        .reopen-btn {
          background: #d1fae5;
          color: #065f46;
        }
        
        .reopen-btn:hover {
          background: #a7f3d0;
        }
        
        .delete-btn {
          background: #fee2e2;
          color: #b91c1c;
        }
        
        .delete-btn:hover {
          background: #fecaca;
        }
      `}</style>
    </Layout>
  );
}