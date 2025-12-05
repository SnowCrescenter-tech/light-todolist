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
    <div className="flex flex-col h-full relative">
      {/* Smart List Tabs */}
      <div className="flex overflow-x-auto p-2 bg-white border-b gap-2 scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <f.icon size={14} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <TaskList filter={filter} />
      </div>
      <div className="absolute bottom-4 left-0 right-0 max-w-md mx-auto z-10">
        <TaskInput />
      </div>
    </div>
  );
}
