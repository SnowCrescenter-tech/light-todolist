import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { TaskInput } from './components/TaskInput';

function App() {
  return (
    <Layout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-20">
          <TaskList />
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <TaskInput />
        </div>
      </div>
    </Layout>
  );
}

export default App;
