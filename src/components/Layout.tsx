import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-safe-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* 限制最大宽度，适配桌面端显示，但在移动端全屏 */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-white shadow-2xl h-full relative">
        {children}
      </div>
    </div>
  );
}
