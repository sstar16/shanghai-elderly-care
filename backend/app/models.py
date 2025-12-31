"""
数据库模型定义
"""
from sqlalchemy import Column, Integer, String, Float, Text
from geoalchemy2 import Geography
from .database import Base

class ElderlyService(Base):
    """养老服务机构模型"""
    __tablename__ = "elderly_service"
    
    id = Column(Integer, primary_key=True, index=True)
    district = Column(Text)                    # 区
    street = Column(Text)                      # 街道/镇
    name = Column(Text, nullable=False)        # 机构名称
    beds = Column(Integer)                     # 核定床位数
    since = Column(Text)                       # 执业年月
    address = Column(Text)                     # 地址
    phone = Column(Text)                       # 联系电话
    zipcode = Column(Text)                     # 邮政编码
    type = Column(Text)                        # 运营方式
    legal_person = Column(Text)                # 法定代表人
    lng = Column(Float)                        # 经度
    lat = Column(Float)                        # 纬度
    geom = Column(Geography(geometry_type='POINT', srid=4326))  # 空间几何


class HealthCenter(Base):
    """社区卫生服务中心模型"""
    __tablename__ = "health_center"
    
    id = Column(Integer, primary_key=True, index=True)
    district = Column(Text)                    # 区
    name = Column(Text)                        # 中心名称
    address = Column(Text)                     # 地址
    lng = Column(Float)                        # 经度
    lat = Column(Float)                        # 纬度
    geom = Column(Geography(geometry_type='POINT', srid=4326))  # 空间几何
