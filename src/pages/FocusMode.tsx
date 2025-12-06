import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, Task } from '../db/db';
import { ArrowLeft, Play, Pause, Square, CheckCircle2 } from 'lucide-react';

export function FocusModePage() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  // 专注时间：默认 25 分钟
  const DEFAULT_TIME = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (taskId) {
      db.tasks.get(parseInt(taskId)).then(t => {
        if (t) setTask(t);
        else navigate('/');
      });
    }
  }, [taskId, navigate]);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setIsFinished(true);
      if (Notification.permission === 'granted') {
        new Notification("专注时间结束！", { body: "休息一下吧。" });
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
    setIsFinished(false);
  };

  const handleCompleteTask = async () => {
    if (task && task.id) {
        await db.tasks.update(task.id, { completed: true });
        alert('太棒了！任务已完成。');
        navigate('/');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Pulse Animation */}
      {isActive && (
        <div className="absolute inset-0 bg-blue-900 opacity-20 animate-pulse z-0"></div>
      )}

      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-md p-8 text-center">
        <h2 className="text-gray-400 text-sm uppercase tracking-[0.2em] mb-4">FOCUS MODE</h2>
        <h1 className="text-2xl font-bold mb-12 line-clamp-2">{task.title}</h1>

        {/* Timer */}
        <div className="text-8xl font-mono font-bold mb-12 tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8 mb-12">
          {!isFinished ? (
            <>
              <button
                onClick={toggleTimer}
                className={`p-6 rounded-full transition-all ${
                    isActive
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50'
                }`}
              >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>

              <button
                onClick={resetTimer}
                className="p-4 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <Square size={24} fill="currentColor" />
              </button>
            </>
          ) : (
             <button
                onClick={handleCompleteTask}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold flex items-center gap-2 animate-bounce"
            >
                <CheckCircle2 size={20} />
                完成任务
            </button>
          )}
        </div>

        <p className="text-gray-500 text-sm">
            {isActive ? "保持专注，屏蔽干扰..." : "准备好了吗？"}
        </p>
      </div>
    </div>
  );
}
