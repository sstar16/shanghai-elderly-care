"""
统计数据 API 路由
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models import ElderlyService, HealthCenter
from ..schemas import Statistics, DistrictStats, DistrictList

router = APIRouter(prefix="/api", tags=["统计与筛选"])

@router.get("/districts", response_model=DistrictList)
async def get_districts(db: Session = Depends(get_db)):
    """获取所有区县列表"""
    # 从养老机构获取区县
    elderly_districts = db.query(ElderlyService.district).distinct().filter(
        ElderlyService.district.isnot(None)
    ).all()
    
    # 从卫生服务中心获取区县
    health_districts = db.query(HealthCenter.district).distinct().filter(
        HealthCenter.district.isnot(None)
    ).all()
    
    # 合并去重
    all_districts = set()
    for d in elderly_districts:
        if d[0]:
            all_districts.add(d[0])
    for d in health_districts:
        if d[0]:
            all_districts.add(d[0])
    
    # 排序返回
    return DistrictList(districts=sorted(list(all_districts)))

@router.get("/statistics", response_model=Statistics)
async def get_statistics(db: Session = Depends(get_db)):
    """获取统计数据"""
    # 总体统计
    total_elderly = db.query(func.count(ElderlyService.id)).scalar()
    total_health = db.query(func.count(HealthCenter.id)).scalar()
    total_beds = db.query(func.sum(ElderlyService.beds)).scalar() or 0
    
    # 按区县统计
    elderly_by_district = db.query(
        ElderlyService.district,
        func.count(ElderlyService.id).label('count'),
        func.sum(ElderlyService.beds).label('beds')
    ).filter(
        ElderlyService.district.isnot(None)
    ).group_by(ElderlyService.district).all()
    
    health_by_district = db.query(
        HealthCenter.district,
        func.count(HealthCenter.id).label('count')
    ).filter(
        HealthCenter.district.isnot(None)
    ).group_by(HealthCenter.district).all()
    
    # 合并统计
    district_stats = {}
    for item in elderly_by_district:
        district_stats[item.district] = DistrictStats(
            district=item.district,
            elderly_count=item.count,
            health_count=0,
            total_beds=item.beds or 0
        )
    
    for item in health_by_district:
        if item.district in district_stats:
            district_stats[item.district].health_count = item.count
        else:
            district_stats[item.district] = DistrictStats(
                district=item.district,
                elderly_count=0,
                health_count=item.count,
                total_beds=0
            )
    
    return Statistics(
        total_elderly=total_elderly,
        total_health=total_health,
        total_beds=total_beds,
        districts=sorted(district_stats.values(), key=lambda x: x.district)
    )
