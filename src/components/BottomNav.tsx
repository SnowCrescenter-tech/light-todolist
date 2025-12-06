import { NavLink } from 'react-router-dom';
import { ListTodo, Calendar, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: ListTodo, label: '待办' },
    { to: '/calendar', icon: Calendar, label: '日历' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              )
            }
          >
            <Icon size={24} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
