import React, { useState } from 'react';
import { db } from '../db/db';
import { Send, Zap, Cloud } from 'lucide-react';

export function TaskInput() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'offline' | 'online'>('offline');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 简单的双引擎模拟
    // 如果是离线模式，我们假设直接保存
    // 如果是在线模式，这里未来会连接 LLM API

    // 模拟离线 NLP 解析：如果包含"明天"，简单设置截止日期 (Mock)
    let dueDate: Date | undefined;
    if (input.includes('明天')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow;
    }

    try {
      await db.tasks.add({
        title: input,
        completed: false,
        createdAt: new Date(),
        mode: mode,
        dueDate
      });
      setInput('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <div className="border-t p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode(mode === 'offline' ? 'online' : 'offline')}
          className={`p-2 rounded-full transition-colors ${
            mode === 'offline'
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
              : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
          }`}
          title={mode === 'offline' ? '离线闪电模式' : '在线云脑模式'}
        >
          {mode === 'offline' ? <Zap size={20} /> : <Cloud size={20} />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'offline' ? "快速添加任务..." : "智能规划任务..."}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
