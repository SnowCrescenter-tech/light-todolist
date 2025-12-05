import { useState, useEffect } from 'react';
import { Save, Key, Database, Upload, Download, Loader2 } from 'lucide-react';
import { backupToWebDAV, restoreFromWebDAV } from '../utils/sync';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [modelName, setModelName] = useState('gpt-3.5-turbo');

  // WebDAV States
  const [webdavUrl, setWebdavUrl] = useState('');
  const [webdavUser, setWebdavUser] = useState('');
  const [webdavPass, setWebdavPass] = useState('');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Load AI Config
    const savedKey = localStorage.getItem('openai_api_key');
    const savedUrl = localStorage.getItem('openai_base_url');
    const savedModel = localStorage.getItem('openai_model_name');

    if (savedKey) setApiKey(savedKey);
    if (savedUrl) setBaseUrl(savedUrl);
    if (savedModel) setModelName(savedModel);

    // Load WebDAV Config
    const wdUrl = localStorage.getItem('webdav_url');
    const wdUser = localStorage.getItem('webdav_user');
    const wdPass = localStorage.getItem('webdav_pass');

    if (wdUrl) setWebdavUrl(wdUrl);
    if (wdUser) setWebdavUser(wdUser);
    if (wdPass) setWebdavPass(wdPass);
  }, []);

  const handleSave = () => {
    localStorage.setItem('openai_api_key', apiKey);
    localStorage.setItem('openai_base_url', baseUrl);
    localStorage.setItem('openai_model_name', modelName);

    localStorage.setItem('webdav_url', webdavUrl);
    localStorage.setItem('webdav_user', webdavUser);
    localStorage.setItem('webdav_pass', webdavPass);

    alert('配置已保存！');
  };

  const handleBackup = async () => {
    if (!webdavUrl || !webdavUser || !webdavPass) {
        alert('请先填写 WebDAV 配置');
        return;
    }
    setSyncing(true);
    try {
        await backupToWebDAV(webdavUrl, webdavUser, webdavPass);
        alert('备份成功！');
    } catch (e: any) {
        alert(`备份失败: ${e.message}`);
    } finally {
        setSyncing(false);
    }
  };

  const handleRestore = async () => {
    if (!webdavUrl || !webdavUser || !webdavPass) {
        alert('请先填写 WebDAV 配置');
        return;
    }
    if (!confirm('恢复将覆盖本地同名任务，确定吗？')) return;

    setSyncing(true);
    try {
        const count = await restoreFromWebDAV(webdavUrl, webdavUser, webdavPass);
        alert(`恢复成功！已导入/更新 ${count} 个任务。`);
    } catch (e: any) {
        alert(`恢复失败: ${e.message}`);
    } finally {
        setSyncing(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
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

      {/* WebDAV 同步部分 */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Database size={20} />
          <h3 className="font-semibold">WebDAV 云同步</h3>
        </div>

        <div className="space-y-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WebDAV URL</label>
                <input
                type="text"
                value={webdavUrl}
                onChange={(e) => setWebdavUrl(e.target.value)}
                placeholder="https://dav.jianguoyun.com/dav/"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                    <input
                    type="text"
                    value={webdavUser}
                    onChange={(e) => setWebdavUser(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                    <input
                    type="password"
                    value={webdavPass}
                    onChange={(e) => setWebdavPass(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </div>

        <div className="flex gap-2">
            <button
                onClick={handleBackup}
                disabled={syncing}
                className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2 rounded-lg hover:bg-green-100 disabled:opacity-50"
            >
                {syncing ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16} />}
                备份到云端
            </button>
            <button
                onClick={handleRestore}
                disabled={syncing}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-700 border border-orange-200 py-2 rounded-lg hover:bg-orange-100 disabled:opacity-50"
            >
                {syncing ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
                从云端恢复
            </button>
        </div>
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
