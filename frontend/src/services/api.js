/**
 * API 服务模块
 * 封装所有后端 API 调用
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ 养老服务机构 API ============
export const elderlyApi = {
  // 获取所有养老机构
  getAll: async () => {
    const response = await api.get('/api/elderly/all');
    return response.data;
  },

  // 获取养老机构列表（分页、筛选）
  getList: async (params) => {
    const response = await api.get('/api/elderly', { params });
    return response.data;
  },

  // 获取养老机构详情
  getById: async (id) => {
    const response = await api.get(`/api/elderly/${id}`);
    return response.data;
  },

  // 查询附近的养老机构
  getNearby: async (lng, lat, radius = 5000, limit = 10) => {
    const response = await api.get('/api/elderly/nearby', {
      params: { lng, lat, radius, limit },
    });
    return response.data;
  },

  // 获取运营类型列表
  getTypes: async () => {
    const response = await api.get('/api/elderly/types/list');
    return response.data;
  },
};

// ============ 卫生服务中心 API ============
export const healthApi = {
  // 获取所有卫生服务中心
  getAll: async () => {
    const response = await api.get('/api/health/all');
    return response.data;
  },

  // 获取卫生服务中心列表（分页、筛选）
  getList: async (params) => {
    const response = await api.get('/api/health', { params });
    return response.data;
  },

  // 获取卫生服务中心详情
  getById: async (id) => {
    const response = await api.get(`/api/health/${id}`);
    return response.data;
  },

  // 查询附近的卫生服务中心
  getNearby: async (lng, lat, radius = 5000, limit = 10) => {
    const response = await api.get('/api/health/nearby', {
      params: { lng, lat, radius, limit },
    });
    return response.data;
  },
};

// ============ 统计数据 API ============
export const statisticsApi = {
  // 获取区县列表
  getDistricts: async () => {
    const response = await api.get('/api/districts');
    return response.data;
  },

  // 获取统计数据
  getStatistics: async () => {
    const response = await api.get('/api/statistics');
    return response.data;
  },
};

export default api;
