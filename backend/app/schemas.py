"""
Pydantic 模式定义
用于请求/响应数据验证
"""
from typing import Optional, List
from pydantic import BaseModel, Field

# ============ 养老服务机构 ============
class ElderlyServiceBase(BaseModel):
    district: Optional[str] = None
    street: Optional[str] = None
    name: str
    beds: Optional[int] = None
    since: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    zipcode: Optional[str] = None
    type: Optional[str] = None
    legal_person: Optional[str] = None
    lng: Optional[float] = None
    lat: Optional[float] = None

class ElderlyServiceResponse(ElderlyServiceBase):
    id: int
    distance: Optional[float] = None  # 距离用户的距离（米）
    
    class Config:
        from_attributes = True

class ElderlyServiceList(BaseModel):
    data: List[ElderlyServiceResponse]
    total: int

# ============ 卫生服务中心 ============
class HealthCenterBase(BaseModel):
    district: Optional[str] = None
    name: Optional[str] = None
    address: Optional[str] = None
    lng: Optional[float] = None
    lat: Optional[float] = None

class HealthCenterResponse(HealthCenterBase):
    id: int
    distance: Optional[float] = None  # 距离用户的距离（米）
    
    class Config:
        from_attributes = True

class HealthCenterList(BaseModel):
    data: List[HealthCenterResponse]
    total: int

# ============ 通用查询参数 ============
class NearbyQuery(BaseModel):
    lng: float = Field(..., description="经度")
    lat: float = Field(..., description="纬度")
    radius: int = Field(default=5000, description="搜索半径(米)")
    limit: int = Field(default=10, description="返回数量")

class SearchQuery(BaseModel):
    keyword: Optional[str] = Field(default=None, description="搜索关键词")
    district: Optional[str] = Field(default=None, description="区县筛选")
    type: Optional[str] = Field(default=None, description="运营类型筛选")
    page: int = Field(default=1, ge=1, description="页码")
    page_size: int = Field(default=20, ge=1, le=100, description="每页数量")

# ============ 统计数据 ============
class DistrictStats(BaseModel):
    district: str
    elderly_count: int
    health_count: int
    total_beds: Optional[int] = None

class Statistics(BaseModel):
    total_elderly: int
    total_health: int
    total_beds: int
    districts: List[DistrictStats]

# ============ 区县列表 ============
class DistrictList(BaseModel):
    districts: List[str]
