import { useState, useEffect } from "react";
import TaskItem from "./components/TaskItem";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (text === "") return;

    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const visibleTasks = tasks.filter((task) => {
    if (filter === "done") return task.done;
    if (filter === "undone") return !task.done;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <main className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-1 block">
            Task Management
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            タスク管理
          </h1>
        </header>

        {/* 入力フォーム */}
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="新しいタスクを入力..."
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-medium text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            追加
          </button>
        </form>

        {/* フィルターボタンタブ */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          {[
            { key: "all", label: "すべて" },
            { key: "undone", label: "未完了" },
            { key: "done", label: "完了済み" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* タスクリスト */}
        <ul className="space-y-2.5">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>

        {/* 空の表示 */}
        {visibleTasks.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-sm font-medium text-slate-400">
              該当するタスクはありません
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;