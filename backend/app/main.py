"""
上海市公共卫生与养老服务资源智能匹配系统 - 后端API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import elderly, health, statistics, nlq

# 创建 FastAPI 应用
app = FastAPI(
    title="上海市公共卫生与养老服务资源智能匹配系统",
    description="""
    ## 系统简介
    本系统提供上海市养老服务机构和社区卫生服务中心的数据查询服务。
    
    ## 主要功能
    - 养老服务机构查询
    - 社区卫生服务中心查询
    - 基于位置的附近资源搜索
    - 统计数据分析
    
    ## 数据来源
    - 上海市民政局
    - 上海市卫生健康委员会
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(elderly.router)
app.include_router(health.router)
app.include_router(statistics.router)
app.include_router(nlq.router)

@app.get("/")
async def root():
    """API 根路径"""
    return {
        "message": "上海市公共卫生与养老服务资源智能匹配系统 API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health-check")
async def health_check():
    """健康检查接口"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
