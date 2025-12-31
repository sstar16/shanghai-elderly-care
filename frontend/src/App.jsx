/**
 * 上海市公共卫生与养老服务资源智能匹配系统
 * 主应用组件
 */
import React, { useState, useEffect, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import NLQueryBox from './components/NLQueryBox';
import { elderlyApi, healthApi, statisticsApi } from './services/api';

function App() {
  // 数据状态
  const [elderlyData, setElderlyData] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [types, setTypes] = useState([]);
  
  // 附近资源
  const [nearbyElderly, setNearbyElderly] = useState([]);
  const [nearbyHealth, setNearbyHealth] = useState([]);
  
  // UI状态
  const [showElderly, setShowElderly] = useState(true);
  const [showHealth, setShowHealth] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NLQ 自然语言查询结果
  const [nlQueryActive, setNlQueryActive] = useState(false);
  const [nlElderlyResults, setNlElderlyResults] = useState([]);
  const [nlHealthResults, setNlHealthResults] = useState([]);

  // 加载初始数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 并行加载所有数据
        const [elderlyRes, healthRes, districtsRes, typesRes] = await Promise.all([
          elderlyApi.getAll(),
          healthApi.getAll(),
          statisticsApi.getDistricts(),
          elderlyApi.getTypes(),
        ]);
        
        setElderlyData(elderlyRes.data || []);
        setHealthData(healthRes.data || []);
        setDistricts(districtsRes.districts || []);
        setTypes(typesRes.types || []);
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请检查后端服务是否正常运行。');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 查询附近资源
  const fetchNearbyResources = useCallback(async (lng, lat, searchRadius) => {
    try {
      const [elderlyRes, healthRes] = await Promise.all([
        elderlyApi.getNearby(lng, lat, searchRadius, 20),
        healthApi.getNearby(lng, lat, searchRadius, 20),
      ]);
      
      setNearbyElderly(elderlyRes.data || []);
      setNearbyHealth(healthRes.data || []);
    } catch (err) {
      console.error('查询附近资源失败:', err);
    }
  }, []);

  // 获取用户位置
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      alert('您的浏览器不支持地理定位');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        const location = { lng: longitude, lat: latitude };
        setUserLocation(location);
        fetchNearbyResources(longitude, latitude, radius);
      },
      (err) => {
        console.error('定位失败:', err);
        // 默认使用上海市中心
        const defaultLocation = { lng: 121.473701, lat: 31.230416 };
        setUserLocation(defaultLocation);
        fetchNearbyResources(defaultLocation.lng, defaultLocation.lat, radius);
        alert('定位失败，已使用默认位置（上海市中心）');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [radius, fetchNearbyResources]);

  // 半径变化时重新查询
  useEffect(() => {
    if (userLocation) {
      fetchNearbyResources(userLocation.lng, userLocation.lat, radius);
    }
  }, [radius, userLocation, fetchNearbyResources]);

  // 处理标记点点击
  const handleMarkerClick = useCallback((item, type) => {
    setSelectedItem({ ...item, type });
  }, []);

  // 处理列表项点击
  const handleItemClick = useCallback((item, type) => {
    setSelectedItem({ ...item, type });
  }, []);

  // 处理自然语言查询结果
  const handleNLQueryResults = useCallback((results) => {
    setNlQueryActive(true);
    setNlElderlyResults(results.elderlyResults || []);
    setNlHealthResults(results.healthResults || []);
    
    // 如果有结果，聚焦到第一个
    const allResults = [...(results.elderlyResults || []), ...(results.healthResults || [])];
    if (allResults.length > 0) {
      const first = results.elderlyResults?.[0] || results.healthResults?.[0];
      const type = results.elderlyResults?.[0] ? 'elderly' : 'health';
      setSelectedItem({ ...first, type });
    }
  }, []);

  // 清除NL查询结果，恢复正常显示
  const clearNLQuery = useCallback(() => {
    setNlQueryActive(false);
    setNlElderlyResults([]);
    setNlHealthResults([]);
  }, []);

  // 筛选地图显示的数据（NL查询优先）
  const displayElderlyData = nlQueryActive 
    ? nlElderlyResults 
    : elderlyData.filter((item) => {
        if (selectedDistrict && item.district !== selectedDistrict) return false;
        if (selectedType && item.type !== selectedType) return false;
        return true;
      });

  const displayHealthData = nlQueryActive
    ? nlHealthResults
    : healthData.filter((item) => {
        if (selectedDistrict && item.district !== selectedDistrict) return false;
        return true;
      });

  return (
    <div className="h-screen flex">
      {/* 侧边栏 */}
      <Sidebar
        districts={districts}
        types={types}
        elderlyData={elderlyData}
        healthData={healthData}
        nearbyElderly={nearbyElderly}
        nearbyHealth={nearbyHealth}
        showElderly={showElderly}
        showHealth={showHealth}
        onToggleElderly={() => setShowElderly(!showElderly)}
        onToggleHealth={() => setShowHealth(!showHealth)}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        onItemClick={handleItemClick}
        selectedItem={selectedItem}
        userLocation={userLocation}
        onLocate={handleLocate}
        radius={radius}
        onRadiusChange={setRadius}
        loading={loading}
      />

      {/* 地图区域 */}
      <div className="flex-1 relative">
        {/* 智能查询框 - 悬浮在地图上方 */}
        <div className="absolute top-4 left-4 right-4 z-10 max-w-xl">
          <NLQueryBox
            userLocation={userLocation}
            onQueryResults={handleNLQueryResults}
          />
          {/* NL查询激活时显示清除按钮 */}
          {nlQueryActive && (
            <div className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
              <span className="text-sm">
                🎯 智能查询结果：{nlElderlyResults.length + nlHealthResults.length} 条
              </span>
              <button
                onClick={clearNLQuery}
                className="ml-auto text-sm px-2 py-1 bg-white rounded hover:bg-gray-100"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
              <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重新加载
              </button>
            </div>
          </div>
        ) : (
          <MapComponent
            elderlyData={displayElderlyData}
            healthData={displayHealthData}
            showElderly={showElderly}
            showHealth={showHealth}
            userLocation={userLocation}
            onMarkerClick={handleMarkerClick}
            selectedItem={selectedItem}
            nearbyResults={[...nearbyElderly, ...nearbyHealth]}
          />
        )}

        {/* 图例 */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">图例</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
              <span className="text-xs text-gray-600">养老服务机构</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-600">社区卫生服务中心</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              <span className="text-xs text-gray-600">您的位置</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
