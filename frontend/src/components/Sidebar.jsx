/**
 * 侧边栏组件
 * 包含搜索、筛选和资源列表
 */
import React, { useState } from 'react';

const Sidebar = ({
  districts = [],
  types = [],
  elderlyData = [],
  healthData = [],
  nearbyElderly = [],
  nearbyHealth = [],
  showElderly,
  showHealth,
  onToggleElderly,
  onToggleHealth,
  selectedDistrict,
  onDistrictChange,
  selectedType,
  onTypeChange,
  searchKeyword,
  onSearchChange,
  onItemClick,
  selectedItem,
  userLocation,
  onLocate,
  radius,
  onRadiusChange,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState('nearby'); // 'nearby' | 'all'

  // 计算显示的数据
  const displayElderly = activeTab === 'nearby' ? nearbyElderly : elderlyData;
  const displayHealth = activeTab === 'nearby' ? nearbyHealth : healthData;

  // 筛选数据
  const filteredElderly = displayElderly.filter((item) => {
    if (selectedDistrict && item.district !== selectedDistrict) return false;
    if (selectedType && item.type !== selectedType) return false;
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        item.name?.toLowerCase().includes(keyword) ||
        item.address?.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  const filteredHealth = displayHealth.filter((item) => {
    if (selectedDistrict && item.district !== selectedDistrict) return false;
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        item.name?.toLowerCase().includes(keyword) ||
        item.address?.toLowerCase().includes(keyword)
      );
    }
    return true;
  });

  return (
    <div className="w-96 bg-white shadow-lg flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <h1 className="text-lg font-bold">上海市养老资源地图</h1>
        <p className="text-sm text-blue-100 mt-1">公共卫生与养老服务资源智能匹配</p>
      </div>

      {/* 定位和半径设置 */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={onLocate}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {userLocation ? '重新定位' : '获取位置'}
          </button>
        </div>
        
        {userLocation && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              当前位置: {userLocation.lng.toFixed(4)}, {userLocation.lat.toFixed(4)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">搜索半径:</label>
          <select
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="flex-1 px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value={1000}>1 公里</option>
            <option value={3000}>3 公里</option>
            <option value={5000}>5 公里</option>
            <option value={10000}>10 公里</option>
          </select>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="p-4 border-b space-y-3">
        {/* 搜索框 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索机构名称或地址..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* 筛选器 */}
        <div className="grid grid-cols-2 gap-2">
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部区县</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部类型</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 图层切换 */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showElderly}
              onChange={onToggleElderly}
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span className="inline-flex items-center gap-1 text-sm">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              养老机构
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showHealth}
              onChange={onToggleHealth}
              className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
            />
            <span className="inline-flex items-center gap-1 text-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              卫生中心
            </span>
          </label>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('nearby')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'nearby'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          附近资源 {userLocation && `(${nearbyElderly.length + nearbyHealth.length})`}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          全部资源 ({elderlyData.length + healthData.length})
        </button>
      </div>

      {/* 资源列表 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* 养老机构列表 */}
            {showElderly && filteredElderly.length > 0 && (
              <div className="p-2">
                <h3 className="px-2 py-1 text-sm font-medium text-orange-700 bg-orange-50 rounded">
                  养老服务机构 ({filteredElderly.length})
                </h3>
                {filteredElderly.map((item) => (
                  <div
                    key={`elderly-${item.id}`}
                    onClick={() => onItemClick(item, 'elderly')}
                    className={`p-3 mt-1 rounded-lg cursor-pointer transition-colors ${
                      selectedItem?.id === item.id && selectedItem?.type === 'elderly'
                        ? 'bg-orange-100 border-l-4 border-orange-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.distance && (
                        <span className="text-xs text-blue-600">
                          {(item.distance / 1000).toFixed(2)} km
                        </span>
                      )}
                      {item.beds && (
                        <span className="text-xs text-gray-400">床位: {item.beds}</span>
                      )}
                      {item.type && (
                        <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">
                          {item.type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 卫生服务中心列表 */}
            {showHealth && filteredHealth.length > 0 && (
              <div className="p-2">
                <h3 className="px-2 py-1 text-sm font-medium text-green-700 bg-green-50 rounded">
                  社区卫生服务中心 ({filteredHealth.length})
                </h3>
                {filteredHealth.map((item) => (
                  <div
                    key={`health-${item.id}`}
                    onClick={() => onItemClick(item, 'health')}
                    className={`p-3 mt-1 rounded-lg cursor-pointer transition-colors ${
                      selectedItem?.id === item.id && selectedItem?.type === 'health'
                        ? 'bg-green-100 border-l-4 border-green-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">{item.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.distance && (
                        <span className="text-xs text-blue-600">
                          {(item.distance / 1000).toFixed(2)} km
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{item.district}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 无数据提示 */}
            {filteredElderly.length === 0 && filteredHealth.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  {activeTab === 'nearby' && !userLocation
                    ? '请先获取您的位置'
                    : '未找到匹配的资源'}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部统计 */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>养老机构: {elderlyData.length} 家</span>
          <span>卫生中心: {healthData.length} 家</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;