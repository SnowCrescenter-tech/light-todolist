import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function CalendarView() {
  const tasks = useLiveQuery(() => db.tasks.toArray());
  const today = new Date();

  // 简单的日历逻辑：获取当月天数，并显示每一天的任务点
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 is Sunday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getTasksForDay = (day: number) => {
    if (!tasks) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d.getDate() === day && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        {today.getFullYear()}年 {today.getMonth() + 1}月
      </h2>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-gray-500">
        <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map(i => <div key={`blank-${i}`} className="h-20" />)}

        {days.map(day => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === today.getDate();

          return (
            <div
              key={day}
              className={`h-20 border rounded-lg p-1 text-xs overflow-hidden ${
                isToday ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
              }`}
            >
              <div className={`text-center mb-1 font-bold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="truncate bg-blue-100 text-blue-800 rounded px-1 text-[10px]">
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-gray-400 text-center">+{dayTasks.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
