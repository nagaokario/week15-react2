function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center justify-between gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200">
      <div 
        onClick={() => onToggle(task.id)}
        className="flex items-center gap-3 flex-1 cursor-pointer select-none group"
      >
        {/* カスタムチェックボックス */}
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          task.done 
            ? "bg-blue-600 border-blue-600 text-white" 
            : "border-gray-300 group-hover:border-blue-500 bg-white"
        }`}>
          {task.done && (
            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          )}
        </div>

        {/* タスクテキスト */}
        <span className={`text-sm font-medium transition-colors ${
          task.done ? "line-through text-gray-400" : "text-gray-800"
        }`}>
          {task.text}
        </span>
      </div>

      {/* 削除ボタン */}
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
      >
        削除
      </button>
    </li>
  );
}

export default TaskItem;