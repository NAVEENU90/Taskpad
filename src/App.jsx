import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const COLORS = [
  { bg: "#FFE566", dot: "#FF6B35" },
  { bg: "#B8F5A0", dot: "#2D9B4E" },
  { bg: "#FFC2E2", dot: "#D0006F" },
  { bg: "#C2E4FF", dot: "#0066CC" },
  { bg: "#E8C2FF", dot: "#7B00D4" },
  { bg: "#FFD4B2", dot: "#E05A00" },
];

const getColor = (id) => COLORS[Math.abs(id.charCodeAt(0) + id.charCodeAt(4)) % COLORS.length];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #FFFBF5;
    min-height: 100vh;
  }

  .app {
    max-width: 460px;
    margin: 0 auto;
    padding: 3rem 1.25rem 4rem;
  }

  .header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 2.5rem;
  }
  .header-emoji {
    font-size: 2rem;
    line-height: 1;
  }
  .header-title {
    font-size: 2.2rem;
    font-weight: 900;
    color: #111;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .header-count {
    margin-left: auto;
    font-size: 0.78rem;
    font-weight: 700;
    color: #aaa;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding-bottom: 4px;
  }

  .input-area {
    display: flex;
    gap: 8px;
    margin-bottom: 2rem;
  }
  .todo-input {
    flex: 1;
    background: #fff;
    border: 2.5px solid #111;
    border-radius: 14px;
    padding: 0.7rem 1rem;
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #111;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-shadow: 3px 3px 0 #111;
  }
  .todo-input::placeholder { color: #bbb; font-weight: 600; }
  .todo-input:focus {
    border-color: #FF6B35;
    box-shadow: 3px 3px 0 #FF6B35;
  }

  .btn-add {
    background: #111;
    border: 2.5px solid #111;
    border-radius: 14px;
    padding: 0.7rem 1.1rem;
    color: #fff;
    font-family: 'Nunito', sans-serif;
    font-size: 1.3rem;
    font-weight: 900;
    cursor: pointer;
    line-height: 1;
    transition: transform 0.1s, background 0.15s, box-shadow 0.1s;
    box-shadow: 3px 3px 0 #555;
  }
  .btn-add:hover:not(:disabled) {
    background: #FF6B35;
    border-color: #FF6B35;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #c44a1f;
  }
  .btn-add:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 #555;
  }
  .btn-add:disabled { opacity: 0.25; cursor: not-allowed; }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 1.25rem;
  }
  .pill-toggle {
    position: relative;
    width: 40px; height: 22px;
    cursor: pointer;
    flex-shrink: 0;
  }
  .pill-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
  .pill-track {
    position: absolute; inset: 0;
    background: #e5e5e5;
    border-radius: 20px;
    border: 2px solid #111;
    transition: background 0.2s;
  }
  .pill-toggle input:checked ~ .pill-track { background: #B8F5A0; }
  .pill-thumb {
    position: absolute;
    width: 14px; height: 14px;
    background: #111;
    border-radius: 50%;
    top: 4px; left: 4px;
    transition: left 0.2s;
    pointer-events: none;
  }
  .pill-toggle input:checked ~ .pill-thumb { left: 22px; }
  .toggle-label {
    font-size: 0.82rem;
    font-weight: 700;
    color: #888;
    user-select: none;
  }

  .section-label {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #ccc;
    margin-bottom: 0.75rem;
  }

  .todos-list { display: flex; flex-direction: column; gap: 10px; }

  .empty {
    text-align: center;
    padding: 3rem 0 2rem;
    font-size: 2.5rem;
  }
  .empty-text {
    font-size: 0.85rem;
    font-weight: 700;
    color: #ccc;
    margin-top: 6px;
  }

  .todo-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.75rem 0.9rem;
    border-radius: 14px;
    border: 2.5px solid #111;
    box-shadow: 3px 3px 0 #111;
    transition: transform 0.12s, box-shadow 0.12s;
    animation: popIn 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .todo-item:hover {
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 #111;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.88) translateY(6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .color-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    border: 2px solid rgba(0,0,0,0.2);
  }

  .todo-check {
    appearance: none;
    width: 20px; height: 20px;
    border: 2.5px solid #111;
    border-radius: 6px;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    background: #fff;
    transition: background 0.15s;
  }
  .todo-check:checked { background: #111; }
  .todo-check:checked::after {
    content: '✓';
    position: absolute;
    color: #fff;
    font-size: 12px;
    font-weight: 900;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    line-height: 1;
  }

  .todo-text {
    flex: 1;
    font-size: 0.9rem;
    font-weight: 700;
    color: #111;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .todo-text.done {
    text-decoration: line-through;
    opacity: 0.35;
  }

  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.95rem;
    color: rgba(0,0,0,0.25);
    padding: 4px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s, transform 0.1s;
    line-height: 1;
    display: flex; align-items: center;
  }
  .btn-icon:hover { transform: scale(1.2); }
  .btn-icon.edit:hover  { color: #0066CC; background: #C2E4FF; }
  .btn-icon.del:hover   { color: #D0006F; background: #FFC2E2; }
`;

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    const s = localStorage.getItem("todos");
    if (s) setTodos(JSON.parse(s));
  }, []);

  const save = (t) => localStorage.setItem("todos", JSON.stringify(t));

  const handleAdd = () => {
    if (todo.trim().length <= 3) return;
    const next = [...todos, { id: uuidv4(), todo: todo.trim(), isCompleted: false }];
    setTodos(next); setTodo(""); save(next);
  };

  const handleDelete = (id) => {
    const next = todos.filter((t) => t.id !== id);
    setTodos(next); save(next);
  };

  const handleEdit = (id) => {
    const t = todos.find((t) => t.id === id);
    setTodo(t.todo);
    const next = todos.filter((t) => t.id !== id);
    setTodos(next); save(next);
  };

  const handleCheck = (id) => {
    const next = todos.map((t) => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t);
    setTodos(next); save(next);
  };

  const visible = todos.filter((t) => showFinished || !t.isCompleted);
  const done = todos.filter((t) => t.isCompleted).length;

  return (
    <>
      <style>{S}</style>
      <div className="app">

        <div className="header">
          <span className="header-emoji">✦</span>
          <h1 className="header-title">Today</h1>
          {todos.length > 0 && (
            <span className="header-count">{done}/{todos.length}</span>
          )}
        </div>

        <div className="input-area">
          <input
            className="todo-input"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a task…"
          />
          <button className="btn-add" onClick={handleAdd} disabled={todo.trim().length <= 3}>+</button>
        </div>

        <div className="toggle-row">
          <label className="pill-toggle">
            <input type="checkbox" checked={showFinished} onChange={() => setShowFinished(!showFinished)} />
            <div className="pill-track" />
            <div className="pill-thumb" />
          </label>
          <span className="toggle-label">Show completed</span>
        </div>

        <div className="section-label">Tasks</div>
        <div className="todos-list">
          {visible.length === 0 ? (
            <div className="empty">
              {todos.length === 0 ? "🎉" : "🙈"}
              <div className="empty-text">{todos.length === 0 ? "Nothing here yet!" : "All hidden"}</div>
            </div>
          ) : visible.map((item) => {
            const c = getColor(item.id);
            return (
              <div key={item.id} className="todo-item" style={{ background: c.bg }}>
                <span className="color-dot" style={{ background: c.dot }} />
                <input
                  className="todo-check"
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleCheck(item.id)}
                />
                <span className={`todo-text${item.isCompleted ? " done" : ""}`}>{item.todo}</span>
                <button className="btn-icon edit" onClick={() => handleEdit(item.id)} title="Edit"><FaEdit /></button>
                <button className="btn-icon del"  onClick={() => handleDelete(item.id)} title="Delete"><MdDelete /></button>
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}

export default App;