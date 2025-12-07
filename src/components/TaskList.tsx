import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { CheckCircle2, Circle, Trash2, Flag } from 'lucide-react';
import { vibrate, HapticPatterns } from '../utils/haptics';

interface TaskListProps {
  filter?: 'all' | 'today' | 'important' | 'inbox';
}

export function TaskList({ filter = 'all' }: TaskListProps) {
  const navigate = useNavigate();

  const tasks = useLiveQuery(async () => {
    let collection = db.tasks.orderBy('createdAt').reverse();
    const allTasks = await collection.toArray();

    // 手动过滤
    if (filter === 'today') {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const todayEnd = todayStart + 24 * 60 * 60 * 1000;
      return allTasks.filter(t => t.dueDate && t.dueDate.getTime() >= todayStart && t.dueDate.getTime() < todayEnd);
    }
    if (filter === 'important') {
      return allTasks.filter(t => t.priority === 'high');
    }
    if (filter === 'inbox') {
      return allTasks.filter(t => !t.dueDate);
    }
    return allTasks;
  }, [filter]);

  if (!tasks) return <div className="text-center text-gray-500 py-8">加载中...</div>;

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12 flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
            🎉
        </div>
        <p className="text-gray-900 font-medium">没有任务</p>
        <p className="text-sm text-gray-500 mt-1">
          {filter === 'all' ? '添加一个新任务开始吧' : '该列表为空'}
        </p>
      </div>
    );
  }

  const toggleTask = async (e: React.MouseEvent, id: number, completed: boolean) => {
    e.stopPropagation();
    if (completed) {
        vibrate(HapticPatterns.Success);
    } else {
        vibrate(HapticPatterns.Light);
    }
    await db.tasks.update(id, { completed });
  };

  const deleteTask = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    vibrate(HapticPatterns.Warning);
    if(confirm('删除此任务?')) {
      await db.tasks.delete(id);
    }
  };

  const handleTaskClick = (id: number) => {
    vibrate(HapticPatterns.Light);
    navigate(`/task/${id}`);
  };

  return (
    <ul className="space-y-3 p-4 pb-24">
      {tasks.map((task) => (
        <li
          key={task.id}
          onClick={() => task.id && handleTaskClick(task.id)}
          className={`relative flex items-center gap-3 p-4 bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-gray-100 transition-all cursor-pointer active:scale-[0.98] ${
            task.completed ? 'opacity-50 bg-gray-50 grayscale' : 'hover:shadow-md'
          }`}
        >
          {/* Priority Indicator Strip */}
          <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-lg ${
            task.priority === 'high' ? 'bg-red-500' :
            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-transparent'
          }`} />

          <button
            onClick={(e) => task.id && toggleTask(e, task.id, !task.completed)}
            className={`flex-shrink-0 z-10 p-1 -ml-1 ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
            // Add min touch target
            style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {task.completed ? <CheckCircle2 size={26} fill="currentColor" className="text-green-100 stroke-green-600" /> : <Circle size={26} strokeWidth={1.5} />}
          </button>

          <div className="flex-1 min-w-0 py-0.5">
            <div className="flex items-center gap-1.5">
              <p className={`truncate text-[15px] font-medium leading-tight ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </p>
              {task.priority === 'high' && <Flag size={12} className="text-red-500 fill-current flex-shrink-0" />}
            </div>

            <div className="flex items-center gap-2 mt-1.5">
              {task.dueDate && (
                <p className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${
                    new Date(task.dueDate) < new Date() && !task.completed ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
               <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                 task.mode === 'online' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
               }`}>
                 {task.mode === 'online' ? '云脑' : '闪电'}
               </span>
            </div>
            {task.description && <p className="text-xs text-gray-400 mt-1 truncate pr-2">{task.description}</p>}
          </div>

          <button
            onClick={(e) => task.id && deleteTask(e, task.id)}
            className="text-gray-300 hover:text-red-500 z-10 flex items-center justify-center"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
