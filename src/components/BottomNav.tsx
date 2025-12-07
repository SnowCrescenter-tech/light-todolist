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
    <nav className="flex-none bg-white border-t border-gray-200 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center flex-1 h-full space-y-1 active:scale-95 transition-transform",
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
