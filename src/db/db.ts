import Dexie, { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  mode: 'offline' | 'online'; // 标记是通过离线模型还是在线模型创建
}

export class IntelliTodoDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super('IntelliTodoDB');
    this.version(1).stores({
      tasks: '++id, title, completed, dueDate, createdAt, mode'
    });
  }
}

export const db = new IntelliTodoDB();
