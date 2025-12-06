import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl overflow-hidden">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">智音待办</h1>
        <p className="text-xs opacity-80">你的数据，你的AI，你的节奏</p>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
