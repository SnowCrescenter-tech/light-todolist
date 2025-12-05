import React, { useState } from 'react';
import { db } from '../db/db';
import { Send, Zap, Cloud, Loader2 } from 'lucide-react';
import { parseOffline } from '../utils/offlineParser';
import { parseWithLLM } from '../utils/llm';

export function TaskInput() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'offline' | 'online'>('offline');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      if (mode === 'offline') {
        // 离线模式：使用本地解析器
        const { title, dueDate } = parseOffline(input);
        await db.tasks.add({
          title,
          completed: false,
          createdAt: new Date(),
          mode: 'offline',
          dueDate,
          priority: 'medium'
        });
      } else {
        // 在线模式：调用 LLM
        try {
          const result = await parseWithLLM(input);
          // 批量添加任务
          await db.tasks.bulkAdd(result.tasks.map(t => ({
            title: t.title,
            completed: false,
            createdAt: new Date(),
            mode: 'online',
            dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
            priority: 'medium'
          })));
        } catch (error: any) {
          alert(`云端解析失败: ${error.message}\n已转为普通离线任务保存。`);
          // 降级处理
          await db.tasks.add({
            title: input,
            completed: false,
            createdAt: new Date(),
            mode: 'offline',
            priority: 'medium'
          });
        }
      }
      setInput('');
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t p-4 bg-gray-50 bg-opacity-95 backdrop-blur-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode(mode === 'offline' ? 'online' : 'offline')}
          className={`p-2 rounded-full transition-all duration-300 ${
            mode === 'offline'
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 rotate-0'
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200 rotate-180'
          }`}
          title={mode === 'offline' ? '离线闪电模式' : '在线云脑模式'}
        >
          {mode === 'offline' ? <Zap size={20} /> : <Cloud size={20} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'offline' ? "快速添加任务 (支持自然语言日期)..." : "智能规划任务 (尝试让AI帮你拆解)..."}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
