"""
社区卫生服务中心 API 路由
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db
from ..models import HealthCenter
from ..schemas import HealthCenterResponse, HealthCenterList

router = APIRouter(prefix="/api/health", tags=["社区卫生服务中心"])

@router.get("", response_model=HealthCenterList)
async def get_health_centers(
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    district: Optional[str] = Query(None, description="区县筛选"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """获取社区卫生服务中心列表"""
    query = db.query(HealthCenter)
    
    # 关键词搜索
    if keyword:
        query = query.filter(
            (HealthCenter.name.ilike(f"%{keyword}%")) |
            (HealthCenter.address.ilike(f"%{keyword}%"))
        )
    
    # 区县筛选
    if district:
        query = query.filter(HealthCenter.district == district)
    
    # 获取总数
    total = query.count()
    
    # 分页
    offset = (page - 1) * page_size
    centers = query.offset(offset).limit(page_size).all()
    
    return HealthCenterList(
        data=[HealthCenterResponse.model_validate(c) for c in centers],
        total=total
    )

@router.get("/all", response_model=HealthCenterList)
async def get_all_health_centers(db: Session = Depends(get_db)):
    """获取所有社区卫生服务中心（用于地图展示）"""
    centers = db.query(HealthCenter).filter(
        HealthCenter.lng.isnot(None),
        HealthCenter.lat.isnot(None)
    ).all()
    
    return HealthCenterList(
        data=[HealthCenterResponse.model_validate(c) for c in centers],
        total=len(centers)
    )

@router.get("/nearby", response_model=HealthCenterList)
async def get_nearby_health_centers(
    lng: float = Query(..., description="经度"),
    lat: float = Query(..., description="纬度"),
    radius: int = Query(5000, description="搜索半径(米)"),
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db)
):
    """查询附近的社区卫生服务中心"""
    # 使用 PostGIS 的 ST_DWithin 进行空间查询
    point = f"SRID=4326;POINT({lng} {lat})"
    
    query = text("""
        SELECT 
            id, district, name, address, lng, lat,
            ST_Distance(geom::geography, ST_GeogFromText(:point)) as distance
        FROM health_center
        WHERE geom IS NOT NULL
            AND ST_DWithin(geom::geography, ST_GeogFromText(:point), :radius)
        ORDER BY distance
        LIMIT :limit
    """)
    
    result = db.execute(query, {"point": point, "radius": radius, "limit": limit})
    rows = result.fetchall()
    
    centers = []
    for row in rows:
        centers.append(HealthCenterResponse(
            id=row.id,
            district=row.district,
            name=row.name,
            address=row.address,
            lng=row.lng,
            lat=row.lat,
            distance=round(row.distance, 2) if row.distance else None
        ))
    
    return HealthCenterList(data=centers, total=len(centers))

@router.get("/{center_id}", response_model=HealthCenterResponse)
async def get_health_center(center_id: int, db: Session = Depends(get_db)):
    """获取社区卫生服务中心详情"""
    center = db.query(HealthCenter).filter(HealthCenter.id == center_id).first()
    if not center:
        raise HTTPException(status_code=404, detail="卫生服务中心不存在")
    return HealthCenterResponse.model_validate(center)
