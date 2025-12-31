/**
 * 地图组件
 * 使用高德地图展示养老机构和卫生服务中心
 */
window._AMapSecurityConfig = {
  securityJsCode: '101ab874e4882728f6bf6885bdc7f4f3',
};
import React, { useEffect, useRef, useState, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

// 高德地图 API Key（需要替换为实际的 Key）
const AMAP_KEY = '274f9915a5b99a872c19a62aa0844fd9';

const MapComponent = ({ 
  elderlyData = [], 
  healthData = [], 
  showElderly = true,
  showHealth = true,
  userLocation = null,
  onMarkerClick,
  selectedItem = null,
  nearbyResults = []
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const infoWindowRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 初始化地图
  useEffect(() => {
    AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Geolocation', 'AMap.Geocoder', 'AMap.MarkerCluster'],
    })
      .then((AMap) => {
        if (!mapContainerRef.current) return;

        const map = new AMap.Map(mapContainerRef.current, {
          zoom: 11,
          center: [121.473701, 31.230416], // 上海市中心
          mapStyle: 'amap://styles/light',
        });

        mapRef.current = map;
        window.AMap = AMap;
        
        // 创建信息窗口
        infoWindowRef.current = new AMap.InfoWindow({
          isCustom: true,
          offset: new AMap.Pixel(0, -30),
        });

        setMapLoaded(true);
      })
      .catch((e) => {
        console.error('地图加载失败:', e);
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
  }, []);

  // 创建标记点内容
  const createMarkerContent = useCallback((type, isSelected = false) => {
    const color = type === 'elderly' ? '#F97316' : '#22C55E';
    const selectedColor = type === 'elderly' ? '#EA580C' : '#16A34A';
    const bgColor = isSelected ? selectedColor : color;
    const size = isSelected ? 32 : 24;
    
    return `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${bgColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        transition: transform 0.2s;
      ">
        <span style="color: white; font-size: ${isSelected ? 14 : 12}px; font-weight: bold;">
          ${type === 'elderly' ? '养' : '医'}
        </span>
      </div>
    `;
  }, []);

  // 创建信息窗口内容
  const createInfoWindowContent = useCallback((item, type) => {
    const isElderly = type === 'elderly';
    const bgColor = isElderly ? 'bg-orange-50' : 'bg-green-50';
    const borderColor = isElderly ? 'border-orange-200' : 'border-green-200';
    const titleColor = isElderly ? 'text-orange-800' : 'text-green-800';
    
    let detailHtml = '';
    if (isElderly) {
      detailHtml = `
        ${item.street ? `<p class="text-sm text-gray-600"><span class="font-medium">街道：</span>${item.street}</p>` : ''}
        ${item.beds ? `<p class="text-sm text-gray-600"><span class="font-medium">床位数：</span>${item.beds}张</p>` : ''}
        ${item.type ? `<p class="text-sm text-gray-600"><span class="font-medium">运营方式：</span>${item.type}</p>` : ''}
        ${item.since ? `<p class="text-sm text-gray-600"><span class="font-medium">成立日期：</span>${item.since}</p>` : ''}
        ${item.legal_person ? `<p class="text-sm text-gray-600"><span class="font-medium">法人代表：</span>${item.legal_person}</p>` : ''}
        ${item.phone ? `<p class="text-sm text-gray-600"><span class="font-medium">联系电话：</span><a href="tel:${item.phone}" class="text-blue-600">${item.phone}</a></p>` : ''}
      `;
    }
    
    return `
      <div class="p-3 ${bgColor} border ${borderColor} rounded-lg shadow-lg max-w-xs" style="min-width: 220px;">
        <h3 class="font-bold ${titleColor} text-sm mb-2">${item.name}</h3>
        <p class="text-sm text-gray-600 mb-1"><span class="font-medium">地址：</span>${item.address || '暂无'}</p>
        ${item.distance ? `<p class="text-sm text-gray-500"><span class="font-medium">距离：</span>${(item.distance / 1000).toFixed(2)} 公里</p>` : ''}
        ${detailHtml}
        <div class="mt-2 pt-2 border-t ${borderColor}">
          <span class="text-xs text-gray-400">${item.district || ''}</span>
        </div>
      </div>
    `;
  }, []);

  // 更新标记点
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.AMap) return;

    const AMap = window.AMap;
    const map = mapRef.current;

    // 清除旧标记
    markersRef.current.forEach((marker) => {
      map.remove(marker);
    });
    markersRef.current = [];

    const markers = [];

    // 添加养老机构标记
    if (showElderly) {
      elderlyData.forEach((item) => {
        if (!item.lng || !item.lat) return;

        const isSelected = selectedItem?.id === item.id && selectedItem?.type === 'elderly';
        const marker = new AMap.Marker({
          position: new AMap.LngLat(item.lng, item.lat),
          content: createMarkerContent('elderly', isSelected),
          anchor: 'center',
          extData: { ...item, type: 'elderly' },
        });

        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(item, 'elderly');
          }
          // 显示信息窗口
          infoWindowRef.current.setContent(createInfoWindowContent(item, 'elderly'));
          infoWindowRef.current.open(map, marker.getPosition());
        });

        markers.push(marker);
      });
    }

    // 添加卫生服务中心标记
    if (showHealth) {
      healthData.forEach((item) => {
        if (!item.lng || !item.lat) return;

        const isSelected = selectedItem?.id === item.id && selectedItem?.type === 'health';
        const marker = new AMap.Marker({
          position: new AMap.LngLat(item.lng, item.lat),
          content: createMarkerContent('health', isSelected),
          anchor: 'center',
          extData: { ...item, type: 'health' },
        });

        marker.on('click', () => {
          if (onMarkerClick) {
            onMarkerClick(item, 'health');
          }
          // 显示信息窗口
          infoWindowRef.current.setContent(createInfoWindowContent(item, 'health'));
          infoWindowRef.current.open(map, marker.getPosition());
        });

        markers.push(marker);
      });
    }

    // 批量添加标记
    map.add(markers);
    markersRef.current = markers;
  }, [mapLoaded, elderlyData, healthData, showElderly, showHealth, selectedItem, createMarkerContent, createInfoWindowContent, onMarkerClick]);

  // 用户位置标记
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.AMap) return;

    const AMap = window.AMap;
    const map = mapRef.current;

    // 清除旧的用户标记
    if (userMarkerRef.current) {
      map.remove(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      const userMarker = new AMap.Marker({
        position: new AMap.LngLat(userLocation.lng, userLocation.lat),
        content: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: #3B82F6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          "></div>
        `,
        anchor: 'center',
      });

      map.add(userMarker);
      userMarkerRef.current = userMarker;

      // 移动到用户位置
      map.setCenter(new AMap.LngLat(userLocation.lng, userLocation.lat));
      map.setZoom(14);
    }
  }, [mapLoaded, userLocation]);

  // 当选中项改变时，移动地图
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedItem || !window.AMap) return;

    const AMap = window.AMap;
    const map = mapRef.current;

    if (selectedItem.lng && selectedItem.lat) {
      map.setCenter(new AMap.LngLat(selectedItem.lng, selectedItem.lat));
      map.setZoom(15);
    }
  }, [mapLoaded, selectedItem]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default MapComponent;