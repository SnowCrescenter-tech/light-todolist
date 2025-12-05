import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { CheckCircle2, Circle, Trash2 } from 'lucide-react';

export function TaskList() {
  const tasks = useLiveQuery(() =>
    db.tasks.orderBy('createdAt').reverse().toArray()
  );

  if (!tasks) return <div className="text-center text-gray-500 py-8">加载中...</div>;

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>没有待办事项 🎉</p>
        <p className="text-sm mt-2">试着添加一个新的任务吧！</p>
      </div>
    );
  }

  const toggleTask = async (id: number, completed: boolean) => {
    await db.tasks.update(id, { completed });
  };

  const deleteTask = async (id: number) => {
    await db.tasks.delete(id);
  };

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all ${
            task.completed ? 'opacity-60 bg-gray-50' : ''
          }`}
        >
          <button
            onClick={() => task.id && toggleTask(task.id, !task.completed)}
            className={`flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'}`}
          >
            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>

          <div className="flex-1 min-w-0">
            <p className={`truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </p>
            {task.dueDate && (
              <p className="text-xs text-orange-500 mt-0.5">
                截止: {task.dueDate.toLocaleDateString()}
              </p>
            )}
            <div className="flex gap-2 mt-1">
               <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                 task.mode === 'online' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
               }`}>
                 {task.mode === 'online' ? '云脑' : '闪电'}
               </span>
            </div>
          </div>

          <button
            onClick={() => task.id && deleteTask(task.id)}
            className="text-gray-400 hover:text-red-500 p-2"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
