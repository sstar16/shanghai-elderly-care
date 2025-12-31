/**
 * 自然语言查询组件
 * 用户输入自然语言，AI解析后执行查询
 */
import React, { useState, useEffect } from 'react';

const NLQueryBox = ({ 
  userLocation, 
  onQueryResults,
  apiBaseUrl = 'http://localhost:8000'
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interpretation, setInterpretation] = useState('');
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const [examples, setExamples] = useState([]);

  // 检查 Ollama 状态
  useEffect(() => {
    checkOllamaStatus();
    fetchExamples();
  }, []);

  const checkOllamaStatus = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/nlq/status`);
      const data = await response.json();
      setOllamaStatus(data);
    } catch (e) {
      setOllamaStatus({ status: 'error', error: e.message });
    }
  };

  const fetchExamples = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/nlq/examples`);
      const data = await response.json();
      setExamples(data.examples || []);
    } catch (e) {
      console.error('获取示例失败:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setInterpretation('');

    try {
      const response = await fetch(`${apiBaseUrl}/api/nlq/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          user_lng: userLocation?.lng,
          user_lat: userLocation?.lat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInterpretation(data.interpretation);
        // 回调父组件，传递查询结果
        if (onQueryResults) {
          onQueryResults({
            elderlyResults: data.elderly_results,
            healthResults: data.health_results,
            totalCount: data.total_count,
            parsedQuery: data.parsed_query,
          });
        }
      } else {
        setError(data.error || '查询失败');
      }
    } catch (e) {
      setError(`请求失败: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    setShowExamples(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🤖</span>
          智能查询
        </h3>
        {/* Ollama 状态指示 */}
        {ollamaStatus && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            ollamaStatus.status === 'online' && ollamaStatus.model_available
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {ollamaStatus.status === 'online' && ollamaStatus.model_available
              ? `AI就绪 (${ollamaStatus.current_model})`
              : 'AI离线'}
          </span>
        )}
      </div>

      {/* 输入框 */}
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="用自然语言描述你要找的资源..."
            className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-md text-white font-medium transition-colors ${
              loading || !query.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                解析中
              </span>
            ) : '查询'}
          </button>
        </div>
      </form>

      {/* 示例按钮 */}
      <div className="mt-2">
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
        >
          <span className="mr-1">{showExamples ? '▼' : '▶'}</span>
          查询示例
        </button>
        
        {showExamples && examples.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 解析结果 */}
      {interpretation && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">🔍 理解为：</span>
            {interpretation}
          </p>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-medium">❌ 错误：</span>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default NLQueryBox;
