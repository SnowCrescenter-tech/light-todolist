import React, { useState, useEffect } from 'react';
import { db } from '../db/db';
import { Send, Zap, Cloud, Loader2, Mic } from 'lucide-react';
import { parseOffline } from '../utils/offlineParser';
import { parseWithLLM } from '../utils/llm';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

export function TaskInput() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'offline' | 'online'>('offline');
  const [loading, setLoading] = useState(false);
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  // 当语音转写更新时，同步更新输入框
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      if (mode === 'offline') {
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
        try {
          const result = await parseWithLLM(input);
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
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
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

        <div className="flex-1 relative">
           <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
                isListening
                ? "正在聆听..."
                : mode === 'offline' ? "快速添加任务..." : "智能规划任务..."
            }
            disabled={loading}
            className={`w-full px-4 py-2 pr-10 rounded-lg border focus:outline-none focus:ring-2 disabled:opacity-50 ${
                isListening ? 'border-red-400 ring-2 ring-red-100 bg-red-50' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {isSupported && (
            <button
                type="button"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                    isListening ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                <Mic size={18} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}
