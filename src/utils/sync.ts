import { db } from '../db/db';
import { createClient } from 'webdav';

export async function exportToJSON(): Promise<string> {
  const tasks = await db.tasks.toArray();
  return JSON.stringify({ tasks, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importFromJSON(jsonStr: string): Promise<number> {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data.tasks)) throw new Error('Invalid format');

    // 简单的合并策略：如果 ID 冲突，覆盖；否则添加
    // 为了防止 ID 冲突导致主键错误，我们在这里可以重新生成 ID 或使用 put
    // 实际上 Dexie 的 bulkPut 很好用

    // 清洗数据，确保日期字符串转回 Date 对象
    const tasksToImport = data.tasks.map((t: any) => ({
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
      createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
    }));

    await db.tasks.bulkPut(tasksToImport);
    return tasksToImport.length;
  } catch (error) {
    console.error('Import failed', error);
    throw error;
  }
}

export async function backupToWebDAV(url: string, user: string, pass: string): Promise<void> {
    const client = createClient(url, {
        username: user,
        password: pass
    });

    const json = await exportToJSON();
    await client.putFileContents('/intellitodo_backup.json', json, { overwrite: true });
}

export async function restoreFromWebDAV(url: string, user: string, pass: string): Promise<number> {
    const client = createClient(url, {
        username: user,
        password: pass
    });

    if (await client.exists('/intellitodo_backup.json') === false) {
        throw new Error('云端未找到备份文件');
    }

    const content = await client.getFileContents('/intellitodo_backup.json', { format: 'text' });
    // getFileContents can return buffer or string depending on options/env.
    // In browser context usually string or ArrayBuffer.
    return importFromJSON(content as string);
}
