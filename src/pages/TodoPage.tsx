import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';

export function TodoPage() {
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-32">
        <TaskList />
      </div>
      <div className="absolute bottom-4 left-0 right-0 max-w-md mx-auto z-10">
        <TaskInput />
      </div>
    </div>
  );
}
