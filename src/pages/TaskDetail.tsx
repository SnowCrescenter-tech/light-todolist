import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Task } from '../db/db';
import { ArrowLeft, Save, Trash2, Calendar as CalendarIcon, Flag, AlignLeft, Timer } from 'lucide-react';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDateStr, setDueDateStr] = useState('');

  useEffect(() => {
    if (!id) return;
    const taskId = parseInt(id);
    db.tasks.get(taskId).then(foundTask => {
      if (foundTask) {
        setTask(foundTask);
        setTitle(foundTask.title);
        setDescription(foundTask.description || '');
        setPriority(foundTask.priority || 'medium');
        if (foundTask.dueDate) {
          // Format date for input[type="date"] (YYYY-MM-DD)
          setDueDateStr(foundTask.dueDate.toISOString().split('T')[0]);
        }
      } else {
        alert('未找到任务');
        navigate('/');
      }
      setLoading(false);
    });
  }, [id, navigate]);

  const handleSave = async () => {
    if (!task || !task.id) return;

    let newDueDate: Date | undefined = undefined;
    if (dueDateStr) {
      newDueDate = new Date(dueDateStr);
    }

    await db.tasks.update(task.id, {
      title,
      description,
      priority,
      dueDate: newDueDate
    });

    navigate('/'); // Or navigate(-1)
  };

  const handleDelete = async () => {
    if (!task || !task.id) return;
    if (confirm('确定要删除这个任务吗？')) {
      await db.tasks.delete(task.id);
      navigate('/');
    }
  };

  if (loading) return <div className="p-4 text-center">加载中...</div>;
  if (!task) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">任务详情</h1>
        <button onClick={handleDelete} className="p-2 -mr-2 text-red-500">
          <Trash2 size={24} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Focus Banner */}
        <button
            onClick={() => navigate(`/focus/${id}`)}
            className="w-full bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between group hover:bg-indigo-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-white transition-colors">
                    <Timer size={24} />
                </div>
                <div className="text-left">
                    <h3 className="font-bold text-indigo-900">开始专注模式</h3>
                    <p className="text-xs text-indigo-600">番茄钟计时器</p>
                </div>
            </div>
            <div className="text-indigo-400">→</div>
        </button>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">任务标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-semibold border-b border-gray-200 py-2 focus:outline-none focus:border-blue-500"
            placeholder="做什么..."
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Flag size={14} /> 优先级
          </label>
          <div className="flex gap-2">
            {(['low', 'medium', 'high'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  priority === p
                    ? p === 'high' ? 'bg-red-100 border-red-200 text-red-700'
                    : p === 'medium' ? 'bg-yellow-100 border-yellow-200 text-yellow-700'
                    : 'bg-blue-100 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
           <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <CalendarIcon size={14} /> 截止日期
          </label>
          <input
            type="date"
            value={dueDateStr}
            onChange={(e) => setDueDateStr(e.target.value)}
            className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <AlignLeft size={14} /> 备注
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="添加详细描述..."
          />
        </div>

      </div>

      {/* Footer Action */}
      <div className="p-4 border-t bg-gray-50">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Save size={20} />
          保存修改
        </button>
      </div>
    </div>
  );
}
