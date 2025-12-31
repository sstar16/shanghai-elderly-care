# 上海市公共卫生与养老服务资源智能匹配系统

## 项目简介

本系统是一个基于WebGIS技术的上海市公共卫生与养老服务资源智能匹配平台，整合了上海市养老机构（627家）和社区卫生服务中心（250家）的数据，为用户提供直观的地图可视化展示和基于位置的智能资源匹配服务。

**创新亮点**：系统集成了基于大语言模型（Ollama + Qwen2.5）的自然语言查询（NLQ）功能，用户可以使用自然语言描述需求，系统自动解析并执行数据库查询。

## 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | React | 18.x | 组件化UI开发 |
| 地图服务 | 高德地图 JS API | 2.0 | 地图可视化 |
| 样式框架 | TailwindCSS | 3.x | 原子化CSS |
| 后端框架 | FastAPI | 0.100+ | 异步REST API |
| ORM | SQLAlchemy + GeoAlchemy2 | 2.x | 对象关系映射 |
| 数据库 | PostgreSQL + PostGIS | 16 + 3.4 | 空间数据库 |
| AI模型 | Ollama + Qwen2.5 | latest | 自然语言处理 |
| 容器化 | Docker + Docker Compose | latest | 一键部署 |

## 系统架构

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        表现层 (Presentation Layer)                        │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   React 18   │  │ AMap JS API   │  │ TailwindCSS │  │ NLQueryBox  │  │
│  │   主应用框架  │  │   地图可视化   │  │   样式框架   │  │  自然语言输入 │  │
│  └──────────────┘  └───────────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    ↕ HTTP/REST API
┌──────────────────────────────────────────────────────────────────────────┐
│                      业务逻辑层 (Business Logic Layer)                    │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   FastAPI    │  │  SQLAlchemy   │  │ GeoAlchemy2 │  │ NLQ Service │  │
│  │   路由处理    │  │    ORM映射    │  │   空间查询   │  │  语义解析    │  │
│  └──────────────┘  └───────────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                          ↕ SQL/PostGIS              ↕ Ollama API
┌──────────────────────────────────────────────────────────────────────────┐
│                       数据访问层 (Data Access Layer)                      │
│  ┌────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │   PostgreSQL 16 + PostGIS 3.4  │  │      Ollama + Qwen2.5         │  │
│  │   空间数据存储 | GiST索引       │  │      本地LLM推理服务           │  │
│  └────────────────────────────────┘  └────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

## 功能特性

### 核心功能

| 功能 | 说明 |
|------|------|
| 🗺️ **地图可视化** | 高德地图展示养老机构（橙色）和卫生中心（绿色）分布 |
| 📍 **实时定位** | 获取用户位置，自动搜索附近资源 |
| 🔍 **多维筛选** | 按区域、运营类型、床位数等条件组合查询 |
| 📏 **距离排序** | 基于PostGIS空间查询，按距离由近到远排序 |
| 💬 **自然语言查询** | 输入"找浦东新区床位100张以上的养老院"自动解析执行 |
| 📊 **详情展示** | 点击标记显示名称、地址、街道、床位、运营方式、成立日期、法人、电话等 |

### 辅助功能

- **图层切换**：独立控制养老机构/卫生中心显示
- **搜索半径**：支持1km/3km/5km/10km范围调节
- **响应式设计**：适配桌面和移动设备

## 项目结构

```
shanghai-elderly-care/
├── backend/                        # 后端服务
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI 应用入口
│   │   ├── database.py             # 数据库连接配置
│   │   ├── models.py               # SQLAlchemy 数据模型
│   │   ├── schemas.py              # Pydantic 数据验证模式
│   │   ├── routers/                # API 路由模块
│   │   │   ├── __init__.py
│   │   │   ├── elderly.py          # 养老机构接口
│   │   │   ├── health.py           # 卫生中心接口
│   │   │   ├── nlq.py              # 自然语言查询接口
│   │   │   └── statistics.py       # 统计接口
│   │   └── services/               # 业务服务
│   │       ├── __init__.py
│   │       └── nlq_service.py      # NLQ语义解析服务
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                       # 前端应用
│   ├── public/
│   │   └── index.html              # HTML模板（含TailwindCSS CDN）
│   ├── src/
│   │   ├── index.js                # 应用入口
│   │   ├── App.jsx                 # 主应用组件
│   │   ├── components/             # React 组件
│   │   │   ├── MapComponent.jsx    # 高德地图组件
│   │   │   ├── Sidebar.jsx         # 侧边栏（筛选+列表）
│   │   │   └── NLQueryBox.jsx      # 自然语言查询输入框
│   │   └── services/
│   │       └── api.js              # API 请求封装
│   └── package.json
├── data/                           # 数据文件
│   ├── elderly_cleaned.csv         # 养老机构原始数据
│   ├── elderly_geocoded.csv        # 养老机构（含经纬度）
│   ├── health_cleaned.csv          # 卫生中心原始数据
│   └── health_geocoded.csv         # 卫生中心（含经纬度）
├── scripts/
│   ├── init_data.py                # 数据库初始化脚本
│   └── init_data_fixed.py          # 修复版初始化脚本
├── docs/                           # 文档
│   └── 课程设计报告.docx
├── docker-compose.yml              # Docker编排配置
└── README.md                       # 项目说明
```

## 快速开始

### 前置要求

- Docker & Docker Compose
- Ollama（用于NLQ功能，需安装Qwen2.5模型）
- 高德地图 API Key

### 1. 启动 Ollama（NLQ功能依赖）

```bash
# 安装 Ollama（如未安装）
curl -fsSL https://ollama.com/install.sh | sh

# 下载 Qwen2.5 模型
ollama pull qwen2.5:latest

# 启动 Ollama 服务
ollama serve
```

### 2. Docker Compose 一键部署

```bash
# 克隆项目
cd shanghai-elderly-care

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 初始化数据库（首次运行）
pip install psycopg2-binary pandas
python scripts/init_data_fixed.py

# 访问应用
# 前端界面：http://localhost:3000
# 后端API文档：http://localhost:8000/docs
```

### 3. 本地开发模式

```bash
# 启动数据库
docker run -d \
  --name elderly-care-db \
  -e POSTGRES_USER=lzhd \
  -e POSTGRES_PASSWORD=1 \
  -e POSTGRES_DB=elder \
  -p 5433:5432 \
  postgis/postgis:16-3.4

# 初始化数据
python scripts/init_data_fixed.py

# 启动后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 启动前端（新终端）
cd frontend
npm install
npm start
```

## API 接口

### 养老机构 `/api/elderly`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/all` | 获取所有养老机构 | - |
| GET | `/{id}` | 获取单个机构详情 | id |
| GET | `/nearby` | 查询附近养老机构 | lng, lat, radius, district, type, min_beds, limit |

### 卫生中心 `/api/health`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| GET | `/all` | 获取所有卫生中心 | - |
| GET | `/{id}` | 获取单个中心详情 | id |
| GET | `/nearby` | 查询附近卫生中心 | lng, lat, radius, limit |

### 自然语言查询 `/api/nlq`

| 方法 | 路径 | 说明 | 参数 |
|------|------|------|------|
| POST | `/query` | 自然语言智能查询 | query, lng, lat |

**NLQ 请求示例：**
```json
{
  "query": "找浦东新区床位100张以上的民办养老院",
  "lng": 121.4737,
  "lat": 31.2304
}
```

**NLQ 支持的查询类型：**
- 区域筛选："浦东新区的养老院"
- 类型筛选："民办养老机构"、"公办养老院"
- 床位筛选："床位200张以上"
- 距离查询："附近3公里内的养老院"
- 数量限制："最近的5家养老院"
- 组合查询："找嘉定区床位50张以上的公办养老院"

### 统计 `/api/statistics`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/districts` | 获取所有区域列表 |
| GET | `/summary` | 获取数据汇总统计 |

## 数据库设计

### elderly_service（养老服务机构表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| district | TEXT | 所属区县 |
| street | TEXT | 所属街道/镇 |
| name | TEXT | 机构名称 |
| beds | INTEGER | 核定床位数 |
| since | TEXT | 成立日期 |
| address | TEXT | 详细地址 |
| phone | TEXT | 联系电话 |
| zipcode | TEXT | 邮政编码 |
| type | TEXT | 运营方式（公建公营/公建民营/民建民营） |
| legal_person | TEXT | 法人代表 |
| lng | FLOAT | 经度 |
| lat | FLOAT | 纬度 |
| geom | GEOGRAPHY(Point,4326) | PostGIS空间点（用于空间查询） |

### health_center（社区卫生服务中心表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键 |
| district | TEXT | 所属区县 |
| name | TEXT | 中心名称 |
| address | TEXT | 详细地址 |
| lng | FLOAT | 经度 |
| lat | FLOAT | 纬度 |
| geom | GEOGRAPHY(Point,4326) | PostGIS空间点 |

### 空间索引

```sql
CREATE INDEX idx_elderly_geom ON elderly_service USING GIST(geom);
CREATE INDEX idx_health_geom ON health_center USING GIST(geom);
```

## 配置说明

### 高德地图 API Key

在 `frontend/src/components/MapComponent.jsx` 中配置：
```javascript
const AMAP_KEY = '你的高德地图Web端Key';
```

### 数据库连接

环境变量或 `docker-compose.yml`：
```
DATABASE_URL=postgresql://lzhd:1@db:5432/elder
```

### Ollama 配置

在 `backend/app/services/nlq_service.py` 中配置：
```python
OLLAMA_HOST = "http://host.docker.internal:11434"  # Docker环境
# OLLAMA_HOST = "http://localhost:11434"  # 本地开发
OLLAMA_MODEL = "qwen2.5:latest"
```

## 数据来源

| 数据 | 来源 | 数量 | 更新时间 |
|------|------|------|----------|
| 养老服务机构 | 上海市民政局 - 上海市公共数据开放平台 | 627家 | 2025年9月 |
| 社区卫生服务中心 | 上海市卫生健康委员会 - 上海市公共数据开放平台 | 250家 | 2025年 |

## 技术亮点

1. **PostGIS 空间查询**
   - 使用 `ST_DWithin` 实现高效范围查询
   - 使用 `ST_Distance` 计算精确距离
   - GiST 空间索引加速查询（毫秒级响应）

2. **自然语言查询（NLQ）**
   - 本地部署 Ollama + Qwen2.5，无需云服务
   - Prompt Engineering 实现语义到结构化查询的转换
   - 支持区域、类型、床位、距离等多维度组合查询

3. **Geography 类型**
   - 使用 WGS84 坐标系 (SRID 4326)
   - 距离计算结果直接为米，无需转换

4. **前后端分离架构**
   - FastAPI 提供 RESTful API
   - React 18 组件化开发
   - 高德地图无缝集成

5. **Docker 容器化**
   - 一键部署，环境隔离
   - 开发/生产环境一致性

## 开发者

- **姓名**：杨霁然
- **学号**：2352363
- **专业**：地理信息科学
- **学校**：同济大学

## 许可证

本项目仅供学术研究和学习使用。

---

© 2025 数据库系统原理课程设计
