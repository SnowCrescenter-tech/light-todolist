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
    <div className="flex-none border-t border-gray-100 bg-white/95 backdrop-blur-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-50">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center p-3 pb-2">
        <button
          type="button"
          onClick={() => setMode(mode === 'offline' ? 'online' : 'offline')}
          className={`p-3 rounded-full transition-all active:scale-90 ${
            mode === 'offline'
              ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
          title={mode === 'offline' ? '离线闪电模式' : '在线云脑模式'}
        >
          {mode === 'offline' ? <Zap size={22} fill="currentColor" className="opacity-20" /> : <Cloud size={22} />}
        </button>

        <div className="flex-1 relative">
           <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
                isListening
                ? "正在聆听..."
                : mode === 'offline' ? "添加任务..." : "AI 规划..."
            }
            disabled={loading}
            className={`w-full h-11 pl-4 pr-10 rounded-2xl border text-base transition-all ${
                isListening
                ? 'border-red-400 bg-red-50 text-red-800 placeholder-red-400'
                : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
            }`}
          />
          {isSupported && (
            <button
                type="button"
                onMouseDown={startListening}
                onMouseUp={stopListening}
                onTouchStart={startListening}
                onTouchEnd={stopListening}
                className={`absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all active:scale-90 ${
                    isListening ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                <Mic size={20} />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`p-3 rounded-full transition-all active:scale-90 ${
            loading || !input.trim()
            ? 'bg-gray-100 text-gray-400'
            : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          }`}
        >
          {loading ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
        </button>
      </form>
    </div>
  );
}
