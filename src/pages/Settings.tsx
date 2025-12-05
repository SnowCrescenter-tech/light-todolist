import { useState, useEffect } from 'react';
import { Save, Key, Database } from 'lucide-react';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    const savedUrl = localStorage.getItem('openai_base_url');
    const savedModel = localStorage.getItem('openai_model_name');

    if (savedKey) setApiKey(savedKey);
    if (savedUrl) setBaseUrl(savedUrl);
    if (savedModel) setModelName(savedModel);
  }, []);

  const handleSave = () => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('openai_base_url', baseUrl);
    localStorage.setItem('openai_model_name', modelName);
    alert('设置已保存！');
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">设置</h2>

      {/* AI 配置部分 */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-purple-600">
          <Key size={20} />
          <h3 className="font-semibold">AI 模型配置 (在线云脑)</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">兼容 OpenAI 格式的 API 地址</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="gpt-3.5-turbo"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* 数据同步部分 (占位) */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 opacity-60">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Database size={20} />
          <h3 className="font-semibold">数据同步 (即将推出)</h3>
        </div>
        <p className="text-sm text-gray-500">支持 WebDAV, Google Drive 等。</p>
      </section>

      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Save size={18} />
        保存配置
      </button>
    </div>
  );
}
