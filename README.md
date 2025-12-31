# 上海市公共卫生与养老服务资源智能匹配系统

## 项目简介

本系统是一个基于WebGIS技术的上海市公共卫生与养老服务资源智能匹配平台，整合了上海市养老机构（627家）和社区卫生服务中心（250家）的数据，为用户提供直观的地图可视化展示和基于位置的智能资源匹配服务。

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端 | React | 18.x |
| 地图 | 高德地图 JS SDK | 2.0 |
| 样式 | TailwindCSS | 3.x |
| 后端 | FastAPI | 0.100+ |
| 数据库 | PostgreSQL + PostGIS | 16 + 3.4 |
| 容器 | Docker + Docker Compose | 最新版 |

## 功能特性

### 核心功能
- 🗺️ **地图可视化**：在高德地图上展示所有养老机构和卫生中心的地理位置
- 📍 **实时定位**：获取用户当前位置，自动查询附近资源
- 🔍 **智能搜索**：支持按区域、类型、关键词多维度筛选
- 📏 **距离计算**：基于PostGIS空间查询，精确计算用户与资源的距离
- 📊 **信息展示**：点击标记点查看详细信息（名称、地址、联系方式等）

### 辅助功能
- 图层切换：可独立显示/隐藏养老机构和卫生中心
- 搜索半径调节：支持1km/3km/5km/10km范围查询
- 响应式设计：适配不同屏幕尺寸

## 项目结构

```
shanghai-elderly-care/
├── backend/                    # 后端服务
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI应用入口
│   │   ├── database.py        # 数据库连接配置
│   │   ├── models.py          # SQLAlchemy数据模型
│   │   ├── schemas.py         # Pydantic数据验证
│   │   └── routers/           # API路由
│   │       ├── elderly.py     # 养老机构接口
│   │       ├── health.py      # 卫生中心接口
│   │       └── statistics.py  # 统计接口
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                   # 前端应用
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx            # 主应用组件
│   │   ├── index.js           # 入口文件
│   │   ├── components/
│   │   │   ├── MapComponent.jsx    # 地图组件
│   │   │   └── Sidebar.jsx         # 侧边栏组件
│   │   └── services/
│   │       └── api.js         # API服务封装
│   └── package.json
├── data/                       # 数据文件
│   ├── elderly_geocoded.csv   # 养老机构（含经纬度）
│   └── health_geocoded.csv    # 卫生中心（含经纬度）
├── scripts/
│   └── init_data.py           # 数据库初始化脚本
├── docs/
│   └── 项目设计文档.docx
├── docker-compose.yml
└── README.md
```

## 快速开始

### 前置要求
- Docker & Docker Compose
- Node.js 18+ (如本地开发)
- Python 3.11+ (如本地开发)
- 高德地图API Key

### 方式一：Docker Compose 一键部署

```bash
# 1. 克隆项目（或解压项目包）
cd shanghai-elderly-care

# 2. 启动所有服务
docker-compose up -d

# 3. 初始化数据库（首次运行）
pip install psycopg2-binary pandas
python scripts/init_data.py

# 4. 访问应用
# 前端：http://localhost:3000
# 后端API文档：http://localhost:8000/docs
```

### 方式二：本地开发模式

```bash
# 1. 启动数据库
docker run -d \
  --name geodb \
  -e POSTGRES_USER=lzhd \
  -e POSTGRES_PASSWORD=1 \
  -e POSTGRES_DB=elder \
  -p 5433:5432 \
  postgis/postgis:16-3.4

# 2. 初始化数据
python scripts/init_data.py

# 3. 启动后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 4. 启动前端
cd frontend
npm install
npm start
```

## API接口

### 养老机构 `/api/elderly`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取所有养老机构 |
| GET | `/{id}` | 获取单个机构详情 |
| GET | `/nearby` | 按位置查询附近机构 |
| GET | `/types` | 获取机构类型列表 |

### 卫生中心 `/api/health`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 获取所有卫生中心 |
| GET | `/{id}` | 获取单个中心详情 |
| GET | `/nearby` | 按位置查询附近中心 |

### 统计 `/api/statistics`
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/districts` | 获取区域列表 |
| GET | `/summary` | 获取汇总统计 |

## 配置说明

### 高德地图Key
在 `frontend/src/components/MapComponent.jsx` 中配置：
```javascript
const AMAP_KEY = '你的高德地图Key';
```

### 数据库连接
在 `docker-compose.yml` 或 `backend/app/database.py` 中配置：
```
DATABASE_URL=postgresql://lzhd:1@localhost:5433/elder
```

## 数据来源

- **养老机构数据**：上海市民政局 - 上海市公共数据开放平台（2025年9月）
- **卫生中心数据**：上海市卫生健康委员会 - 上海市公共数据开放平台（2025年）

## 技术亮点

1. **PostGIS空间查询**：使用ST_DWithin和ST_Distance实现高效的地理空间查询
2. **Geography类型**：使用WGS84坐标系(SRID 4326)，距离计算结果为米
3. **高德地图集成**：支持地图展示、标记点、信息窗口、用户定位
4. **响应式设计**：TailwindCSS实现移动端适配
5. **Docker容器化**：一键部署，环境隔离

## 开发者

- **姓名**：杨霁然
- **学号**：2352363
- **学校**：同济大学

## 许可证

本项目仅供学术研究和学习使用。
