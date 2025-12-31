"""
养老服务机构 API 路由
"""
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from ..database import get_db
from ..models import ElderlyService
from ..schemas import ElderlyServiceResponse, ElderlyServiceList

router = APIRouter(prefix="/api/elderly", tags=["养老服务机构"])

@router.get("", response_model=ElderlyServiceList)
async def get_elderly_services(
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    district: Optional[str] = Query(None, description="区县筛选"),
    type: Optional[str] = Query(None, description="运营类型筛选"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db)
):
    """获取养老服务机构列表"""
    query = db.query(ElderlyService)
    
    # 关键词搜索
    if keyword:
        query = query.filter(
            (ElderlyService.name.ilike(f"%{keyword}%")) |
            (ElderlyService.address.ilike(f"%{keyword}%"))
        )
    
    # 区县筛选
    if district:
        query = query.filter(ElderlyService.district == district)
    
    # 运营类型筛选
    if type:
        query = query.filter(ElderlyService.type == type)
    
    # 获取总数
    total = query.count()
    
    # 分页
    offset = (page - 1) * page_size
    services = query.offset(offset).limit(page_size).all()
    
    return ElderlyServiceList(
        data=[ElderlyServiceResponse.model_validate(s) for s in services],
        total=total
    )

@router.get("/all", response_model=ElderlyServiceList)
async def get_all_elderly_services(db: Session = Depends(get_db)):
    """获取所有养老服务机构（用于地图展示）"""
    services = db.query(ElderlyService).filter(
        ElderlyService.lng.isnot(None),
        ElderlyService.lat.isnot(None)
    ).all()
    
    return ElderlyServiceList(
        data=[ElderlyServiceResponse.model_validate(s) for s in services],
        total=len(services)
    )

@router.get("/nearby", response_model=ElderlyServiceList)
async def get_nearby_elderly_services(
    lng: float = Query(..., description="经度"),
    lat: float = Query(..., description="纬度"),
    radius: int = Query(5000, description="搜索半径(米)"),
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db)
):
    """查询附近的养老服务机构"""
    # 使用 PostGIS 的 ST_DWithin 进行空间查询
    point = f"SRID=4326;POINT({lng} {lat})"
    
    query = text("""
        SELECT 
            id, district, street, name, beds, since, address, phone, 
            zipcode, type, legal_person, lng, lat,
            ST_Distance(geom::geography, ST_GeogFromText(:point)) as distance
        FROM elderly_service
        WHERE geom IS NOT NULL
            AND ST_DWithin(geom::geography, ST_GeogFromText(:point), :radius)
        ORDER BY distance
        LIMIT :limit
    """)
    
    result = db.execute(query, {"point": point, "radius": radius, "limit": limit})
    rows = result.fetchall()
    
    services = []
    for row in rows:
        services.append(ElderlyServiceResponse(
            id=row.id,
            district=row.district,
            street=row.street,
            name=row.name,
            beds=row.beds,
            since=row.since,
            address=row.address,
            phone=row.phone,
            zipcode=row.zipcode,
            type=row.type,
            legal_person=row.legal_person,
            lng=row.lng,
            lat=row.lat,
            distance=round(row.distance, 2) if row.distance else None
        ))
    
    return ElderlyServiceList(data=services, total=len(services))

@router.get("/{service_id}", response_model=ElderlyServiceResponse)
async def get_elderly_service(service_id: int, db: Session = Depends(get_db)):
    """获取养老服务机构详情"""
    service = db.query(ElderlyService).filter(ElderlyService.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="机构不存在")
    return ElderlyServiceResponse.model_validate(service)

@router.get("/types/list")
async def get_elderly_types(db: Session = Depends(get_db)):
    """获取所有运营类型"""
    types = db.query(ElderlyService.type).distinct().filter(
        ElderlyService.type.isnot(None)
    ).all()
    return {"types": [t[0] for t in types if t[0]]}
