"""
自然语言查询 API 路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import Optional, List
from pydantic import BaseModel

from ..database import get_db
from ..models import ElderlyService, HealthCenter
from ..services.nlq_service import (
    parse_natural_language, 
    check_ollama_status,
    ParsedQuery,
    OLLAMA_MODEL
)

router = APIRouter(prefix="/api/nlq", tags=["自然语言查询"])


class NLQueryRequest(BaseModel):
    """自然语言查询请求"""
    query: str
    user_lng: Optional[float] = None
    user_lat: Optional[float] = None


class NLQueryResponse(BaseModel):
    """自然语言查询响应"""
    success: bool
    original_query: str
    parsed_query: Optional[dict] = None
    interpretation: str  # 对用户的解释
    elderly_results: List[dict] = []
    health_results: List[dict] = []
    total_count: int = 0
    error: Optional[str] = None


@router.get("/status")
async def get_ollama_status():
    """获取 Ollama 服务状态"""
    status = await check_ollama_status()
    return status


@router.post("/query", response_model=NLQueryResponse)
async def natural_language_query(
    request: NLQueryRequest,
    db: Session = Depends(get_db)
):
    """
    自然语言查询接口
    用户输入自然语言，系统解析后返回匹配的资源
    """
    try:
        # 1. 使用 LLM 解析查询
        parsed = await parse_natural_language(request.query)
        
        # 2. 生成解释文本
        interpretation = generate_interpretation(parsed)
        
        # 3. 执行数据库查询
        elderly_results = []
        health_results = []
        
        if parsed.resource_type in ["elderly", "both", None]:
            elderly_results = query_elderly(
                db, parsed, 
                request.user_lng, 
                request.user_lat
            )
        
        if parsed.resource_type in ["health", "both", None]:
            health_results = query_health(
                db, parsed,
                request.user_lng,
                request.user_lat
            )
        
        return NLQueryResponse(
            success=True,
            original_query=request.query,
            parsed_query=parsed.model_dump(),
            interpretation=interpretation,
            elderly_results=elderly_results,
            health_results=health_results,
            total_count=len(elderly_results) + len(health_results)
        )
        
    except Exception as e:
        return NLQueryResponse(
            success=False,
            original_query=request.query,
            interpretation="",
            error=str(e)
        )


def generate_interpretation(parsed: ParsedQuery) -> str:
    """生成查询解释"""
    parts = []
    
    # 资源类型
    type_map = {
        "elderly": "养老服务机构",
        "health": "社区卫生服务中心",
        "both": "养老机构和卫生服务中心"
    }
    resource = type_map.get(parsed.resource_type, "所有资源")
    parts.append(f"查询{resource}")
    
    # 区域
    if parsed.district:
        parts.append(f"位于{parsed.district}")
    
    # 床位
    if parsed.min_beds and parsed.max_beds:
        parts.append(f"床位数在{parsed.min_beds}-{parsed.max_beds}张之间")
    elif parsed.min_beds:
        parts.append(f"床位数≥{parsed.min_beds}张")
    elif parsed.max_beds:
        parts.append(f"床位数≤{parsed.max_beds}张")
    
    # 运营类型
    if parsed.service_type:
        parts.append(f"运营方式为{parsed.service_type}")
    
    # 关键词
    if parsed.keyword:
        parts.append(f'名称包含"{parsed.keyword}"')
    
    # 距离
    if parsed.radius:
        parts.append(f"在{parsed.radius/1000:.1f}公里范围内")
    
    return "，".join(parts)


def query_elderly(
    db: Session, 
    parsed: ParsedQuery,
    user_lng: Optional[float],
    user_lat: Optional[float]
) -> List[dict]:
    """查询养老机构"""
    query = db.query(ElderlyService)
    
    # 区域过滤
    if parsed.district:
        query = query.filter(ElderlyService.district.ilike(f"%{parsed.district}%"))
    
    # 床位过滤
    if parsed.min_beds:
        query = query.filter(ElderlyService.beds >= parsed.min_beds)
    if parsed.max_beds:
        query = query.filter(ElderlyService.beds <= parsed.max_beds)
    
    # 运营类型过滤
    if parsed.service_type:
        if parsed.service_type in ["民办", "民建民营"]:
            query = query.filter(
                or_(
                    ElderlyService.type.ilike("%民建民营%"),
                    ElderlyService.type.ilike("%公建民营%")
                )
            )
        elif parsed.service_type in ["公办", "公建公营"]:
            query = query.filter(ElderlyService.type.ilike("%公建公营%"))
        else:
            query = query.filter(ElderlyService.type.ilike(f"%{parsed.service_type}%"))
    
    # 关键词过滤
    if parsed.keyword:
        query = query.filter(
            or_(
                ElderlyService.name.ilike(f"%{parsed.keyword}%"),
                ElderlyService.address.ilike(f"%{parsed.keyword}%")
            )
        )
    
    # 如果有用户位置，按距离排序
    if user_lng and user_lat:
        user_point = func.ST_SetSRID(func.ST_MakePoint(user_lng, user_lat), 4326)
        
        # 如果指定了搜索半径，先筛选范围内的
        if parsed.radius:
            query = query.filter(
                func.ST_DWithin(
                    ElderlyService.geom,
                    user_point,
                    parsed.radius
                )
            )
        
        # 按距离升序排序（最近的在前面）
        query = query.order_by(
            func.ST_Distance(ElderlyService.geom, user_point)
        )
    
    # 限制数量
    limit = parsed.limit or 20
    results = query.limit(limit).all()
    
    # 转换为字典并计算距离
    output = []
    for item in results:
        d = {
            "id": item.id,
            "name": item.name,
            "district": item.district,
            "address": item.address,
            "beds": item.beds,
            "type": item.type,
            "phone": item.phone,
            "lng": item.lng,
            "lat": item.lat,
        }
        
        # 计算距离
        if user_lng and user_lat and item.lng and item.lat:
            from math import radians, sin, cos, sqrt, atan2
            R = 6371000  # 地球半径（米）
            lat1, lon1 = radians(user_lat), radians(user_lng)
            lat2, lon2 = radians(item.lat), radians(item.lng)
            dlat, dlon = lat2 - lat1, lon2 - lon1
            a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
            d["distance"] = R * 2 * atan2(sqrt(a), sqrt(1-a))
        
        output.append(d)
    
    return output


def query_health(
    db: Session,
    parsed: ParsedQuery,
    user_lng: Optional[float],
    user_lat: Optional[float]
) -> List[dict]:
    """查询卫生服务中心"""
    query = db.query(HealthCenter)
    
    # 区域过滤
    if parsed.district:
        query = query.filter(HealthCenter.district.ilike(f"%{parsed.district}%"))
    
    # 关键词过滤
    if parsed.keyword:
        query = query.filter(
            or_(
                HealthCenter.name.ilike(f"%{parsed.keyword}%"),
                HealthCenter.address.ilike(f"%{parsed.keyword}%")
            )
        )
    
    # 如果有用户位置，按距离排序
    if user_lng and user_lat:
        user_point = func.ST_SetSRID(func.ST_MakePoint(user_lng, user_lat), 4326)
        
        # 如果指定了搜索半径，先筛选范围内的
        if parsed.radius:
            query = query.filter(
                func.ST_DWithin(
                    HealthCenter.geom,
                    user_point,
                    parsed.radius
                )
            )
        
        # 按距离升序排序
        query = query.order_by(
            func.ST_Distance(HealthCenter.geom, user_point)
        )
    
    # 限制数量
    limit = parsed.limit or 20
    results = query.limit(limit).all()
    
    # 转换为字典
    output = []
    for item in results:
        d = {
            "id": item.id,
            "name": item.name,
            "district": item.district,
            "address": item.address,
            "lng": item.lng,
            "lat": item.lat,
        }
        
        # 计算距离
        if user_lng and user_lat and item.lng and item.lat:
            from math import radians, sin, cos, sqrt, atan2
            R = 6371000
            lat1, lon1 = radians(user_lat), radians(user_lng)
            lat2, lon2 = radians(item.lat), radians(item.lng)
            dlat, dlon = lat2 - lat1, lon2 - lon1
            a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
            d["distance"] = R * 2 * atan2(sqrt(a), sqrt(1-a))
        
        output.append(d)
    
    return output


@router.get("/examples")
async def get_query_examples():
    """获取查询示例"""
    return {
        "examples": [
            "浦东新区有哪些养老院",
            "找床位超过200张的养老机构",
            "附近3公里内的社区卫生服务中心",
            "静安区公办的敬老院",
            "徐汇区的护理院",
            "嘉定区民办养老院床位100张以上",
            "找离我最近的5家养老院",
            "虹口区有几个社区医院",
        ]
    }
