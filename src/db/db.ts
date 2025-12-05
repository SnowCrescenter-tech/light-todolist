import Dexie, { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  mode: 'offline' | 'online';
  priority: 'low' | 'medium' | 'high'; // 新增
  description?: string; // 新增
}

export class IntelliTodoDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super('IntelliTodoDB');

    // Version 1
    this.version(1).stores({
      tasks: '++id, title, completed, dueDate, createdAt, mode'
    });

    // Version 2: Added priority and description
    // Dexie automatically handles schema upgrades for existing data if new fields are just added
    this.version(2).stores({
      tasks: '++id, title, completed, dueDate, createdAt, mode, priority'
    }).upgrade(trans => {
      // 如果需要对旧数据进行迁移，可以在这里写逻辑
      // 例如：设置默认优先级
      return trans.table('tasks').toCollection().modify(task => {
        task.priority = 'medium';
        task.description = '';
      });
    });
  }
}

export const db = new IntelliTodoDB();
