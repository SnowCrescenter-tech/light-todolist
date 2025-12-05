import * as chrono from 'chrono-node';

export interface ParsedTask {
  title: string;
  dueDate?: Date;
}

export function parseOffline(text: string): ParsedTask {
  // 使用 chrono-node (中文版) 解析日期
  const results = chrono.zh.parse(text);

  let dueDate: Date | undefined;
  let title = text;

  if (results.length > 0) {
    const result = results[0];
    dueDate = result.start.date();

    // 从标题中移除日期文本，保持标题简洁
    // 简单的替换逻辑，可能会有误伤，这里先做保守处理：不替换，或者仅替换匹配到的文本
    // 为了用户体验，保留完整文本通常更安全，但在“智能”应用中，用户可能期望移除。
    // 我们这里选择不移除，因为 chrono 有时会匹配到不想删除的词。
    // 优化：如果匹配的文本很长，可以考虑移除。
  }

  return {
    title: title,
    dueDate: dueDate
  };
}
