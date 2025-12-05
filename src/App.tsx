import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BottomNav } from './components/BottomNav';
import { TodoPage } from './pages/TodoPage';
import { CalendarView } from './pages/CalendarView';
import { SettingsPage } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <div className="flex flex-col h-full">
          <main className="flex-1 overflow-hidden relative">
            <Routes>
              <Route path="/" element={<TodoPage />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
