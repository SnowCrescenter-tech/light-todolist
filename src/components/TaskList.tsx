import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/db';
import { CheckCircle2, Circle, Trash2, Flag } from 'lucide-react';

interface TaskListProps {
  filter?: 'all' | 'today' | 'important' | 'inbox';
}

export function TaskList({ filter = 'all' }: TaskListProps) {
  const navigate = useNavigate();

  const tasks = useLiveQuery(async () => {
    let collection = db.tasks.orderBy('createdAt').reverse();
    const allTasks = await collection.toArray();

    // 手动过滤，因为 Dexie 复杂查询需要 compound index，为了 MVP 简单起见在内存中过滤
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
      return allTasks.filter(t => !t.dueDate); // 简单的 Inbox 定义：无日期任务
    }
    return allTasks;
  }, [filter]);

  if (!tasks) return <div className="text-center text-gray-500 py-8">加载中...</div>;

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>没有任务 🎉</p>
        <p className="text-sm mt-2">
          {filter === 'all' ? '试着添加一个新的任务吧！' : '该列表中没有任务。'}
        </p>
      </div>
    );
  }

  const toggleTask = async (e: React.MouseEvent, id: number, completed: boolean) => {
    e.stopPropagation(); // 阻止点击进入详情页
    await db.tasks.update(id, { completed });
  };

  const deleteTask = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if(confirm('删除此任务?')) {
      await db.tasks.delete(id);
    }
  };

  const handleTaskClick = (id: number) => {
    navigate(`/task/${id}`);
  };

  return (
    <ul className="space-y-3 p-4">
      {tasks.map((task) => (
        <li
          key={task.id}
          onClick={() => task.id && handleTaskClick(task.id)}
          className={`relative flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 transition-all cursor-pointer hover:bg-gray-50 ${
            task.completed ? 'opacity-60 bg-gray-50' : ''
          }`}
        >
          {/* Priority Indicator Strip */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
            task.priority === 'high' ? 'bg-red-500' :
            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-transparent'
          }`} />

          <button
            onClick={(e) => task.id && toggleTask(e, task.id, !task.completed)}
            className={`flex-shrink-0 z-10 ${task.completed ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'}`}
          >
            {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className={`truncate font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </p>
              {task.priority === 'high' && <Flag size={12} className="text-red-500 fill-current" />}
            </div>

            <div className="flex items-center gap-2 mt-1">
              {task.dueDate && (
                <p className="text-xs text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
               <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                 task.mode === 'online' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
               }`}>
                 {task.mode === 'online' ? '云脑' : '闪电'}
               </span>
            </div>
            {task.description && <p className="text-xs text-gray-400 mt-1 truncate">{task.description}</p>}
          </div>

          <button
            onClick={(e) => task.id && deleteTask(e, task.id)}
            className="text-gray-400 hover:text-red-500 p-2 z-10"
          >
            <Trash2 size={18} />
          </button>
        </li>
      ))}
    </ul>
  );
}
