export interface LLMResponse {
  tasks: Array<{
    title: string;
    dueDate?: string; // ISO String
  }>;
}

export async function parseWithLLM(text: string): Promise<LLMResponse> {
  const apiKey = localStorage.getItem('openai_api_key');
  const baseUrl = localStorage.getItem('openai_base_url') || 'https://api.openai.com/v1';
  const model = localStorage.getItem('openai_model_name') || 'gpt-3.5-turbo';

  if (!apiKey) {
    throw new Error('请先在设置中配置 API Key');
  }

  const prompt = `
你是一个智能待办事项助手。请分析用户的输入，提取出一个或多个任务。
如果是复杂指令，请拆解为子任务。
输出必须是严格的 JSON 格式，不要包含任何 Markdown 标记。
当前时间是: ${new Date().toISOString()}

输出格式示例:
{
  "tasks": [
    { "title": "任务标题", "dueDate": "2023-12-31T12:00:00.000Z" }
  ]
}

用户输入: "${text}"
`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful JSON parser for todo tasks.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 尝试清理可能存在的 Markdown 代码块标记
    const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('LLM Parsing failed:', error);
    throw error;
  }
}
