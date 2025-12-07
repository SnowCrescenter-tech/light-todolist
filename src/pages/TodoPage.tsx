import { useState } from 'react';
import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';
import { Inbox, Star, CalendarDays, Layers } from 'lucide-react';

export function TodoPage() {
  const [filter, setFilter] = useState<'all' | 'today' | 'important' | 'inbox'>('all');

  const filters = [
    { id: 'all', label: '所有', icon: Layers },
    { id: 'today', label: '今天', icon: CalendarDays },
    { id: 'important', label: '重要', icon: Star },
    { id: 'inbox', label: '收件箱', icon: Inbox },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header & Tabs */}
      <div className="flex-none bg-white border-b border-gray-100 pt-safe">
        <div className="flex items-center px-4 py-3">
             <h1 className="text-xl font-bold tracking-tight text-gray-900">
                {filter === 'all' ? '所有任务' :
                 filter === 'today' ? '今天' :
                 filter === 'important' ? '重要' : '收件箱'}
             </h1>
        </div>

        <div className="flex overflow-x-auto px-4 pb-3 gap-2 scrollbar-hide">
            {filters.map(f => (
            <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95 ${
                filter === f.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                <f.icon size={16} />
                {f.label}
            </button>
            ))}
        </div>
      </div>

      {/* Task List - Scrollable Area */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <TaskList filter={filter} />
      </div>

      {/* Input Area - Fixed at bottom of flex container */}
      <TaskInput />
    </div>
  );
}
