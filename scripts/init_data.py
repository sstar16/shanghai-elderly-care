"""
数据初始化脚本（修复版）
1. 合并 cleaned 和 geocoded CSV，生成完整的 geocoded 文件
2. 导入数据到 PostgreSQL 数据库
"""
import os
import csv
import sys
import time
import psycopg2

# 数据库连接配置
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5433'),
    'dbname': os.getenv('DB_NAME', 'elder'),
    'user': os.getenv('DB_USER', 'lzhd'),
    'password': os.getenv('DB_PASSWORD', '1')
}

def wait_for_db(max_retries=30, delay=2):
    """等待数据库就绪"""
    for i in range(max_retries):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            conn.close()
            print("✓ 数据库连接成功")
            return True
        except psycopg2.OperationalError:
            print(f"等待数据库就绪... ({i+1}/{max_retries})")
            time.sleep(delay)
    return False

def read_csv_as_dict(filepath, key_field='id'):
    """读取 CSV 文件，返回以指定字段为 key 的字典"""
    data = {}
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = row.get(key_field)
            if key:
                data[key] = row
    return data

def merge_and_export_elderly(cleaned_csv, geocoded_csv, output_csv):
    """合并养老机构数据并导出新的 geocoded CSV"""
    print(f"正在合并养老机构数据...")
    
    # 读取两个文件
    cleaned_data = read_csv_as_dict(cleaned_csv, 'id')
    geocoded_data = read_csv_as_dict(geocoded_csv, 'id')
    
    # 定义输出字段
    fieldnames = ['id', 'district', 'street', 'name', 'beds', 'since', 
                  'address', 'phone', 'zipcode', 'type', 'legal_person', 'lng', 'lat']
    
    merged_rows = []
    for key, cleaned in cleaned_data.items():
        geocoded = geocoded_data.get(key, {})
        
        merged_row = {
            'id': cleaned.get('id'),
            'district': cleaned.get('district'),
            'street': cleaned.get('street'),
            'name': cleaned.get('name'),
            'beds': cleaned.get('beds'),
            'since': cleaned.get('since'),
            'address': cleaned.get('address'),
            'phone': cleaned.get('phone'),
            'zipcode': cleaned.get('zipcode'),
            'type': cleaned.get('type'),
            'legal_person': cleaned.get('legal_person'),
            'lng': geocoded.get('lng', ''),
            'lat': geocoded.get('lat', '')
        }
        merged_rows.append(merged_row)
    
    # 写入新的 CSV 文件
    with open(output_csv, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged_rows)
    
    print(f"✓ 已生成新的养老机构数据文件: {output_csv} ({len(merged_rows)} 条)")
    return merged_rows

def merge_and_export_health(cleaned_csv, geocoded_csv, output_csv):
    """合并卫生中心数据并导出新的 geocoded CSV"""
    print(f"正在合并卫生中心数据...")
    
    # 读取两个文件
    cleaned_data = read_csv_as_dict(cleaned_csv, 'id')
    geocoded_data = read_csv_as_dict(geocoded_csv, 'id')
    
    # 定义输出字段
    fieldnames = ['id', 'district', 'name', 'address', 'lng', 'lat']
    
    merged_rows = []
    for key, cleaned in cleaned_data.items():
        geocoded = geocoded_data.get(key, {})
        
        merged_row = {
            'id': cleaned.get('id'),
            'district': cleaned.get('district'),
            'name': cleaned.get('name'),
            'address': cleaned.get('address'),
            'lng': geocoded.get('lng', ''),
            'lat': geocoded.get('lat', '')
        }
        merged_rows.append(merged_row)
    
    # 写入新的 CSV 文件
    with open(output_csv, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged_rows)
    
    print(f"✓ 已生成新的卫生中心数据文件: {output_csv} ({len(merged_rows)} 条)")
    return merged_rows

def create_tables(conn):
    """创建数据表"""
    cur = conn.cursor()
    
    # 确保 PostGIS 扩展已启用
    cur.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
    
    # 创建养老服务机构表
    cur.execute("""
        DROP TABLE IF EXISTS elderly_service CASCADE;
        CREATE TABLE elderly_service (
            id SERIAL PRIMARY KEY,
            district TEXT,
            street TEXT,
            name TEXT NOT NULL,
            beds INTEGER,
            since TEXT,
            address TEXT,
            phone TEXT,
            zipcode TEXT,
            type TEXT,
            legal_person TEXT,
            lng DOUBLE PRECISION,
            lat DOUBLE PRECISION,
            geom GEOGRAPHY(Point, 4326)
        );
    """)
    
    # 创建卫生服务中心表
    cur.execute("""
        DROP TABLE IF EXISTS health_center CASCADE;
        CREATE TABLE health_center (
            id SERIAL PRIMARY KEY,
            district TEXT,
            name TEXT,
            address TEXT,
            lng DOUBLE PRECISION,
            lat DOUBLE PRECISION,
            geom GEOGRAPHY(Point, 4326)
        );
    """)
    
    # 创建空间索引
    cur.execute("CREATE INDEX IF NOT EXISTS idx_elderly_geom ON elderly_service USING GIST(geom);")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_health_geom ON health_center USING GIST(geom);")
    
    conn.commit()
    cur.close()
    print("✓ 数据表创建成功")

def import_elderly_data(conn, rows):
    """导入养老机构数据到数据库"""
    cur = conn.cursor()
    count = 0
    
    for row in rows:
        try:
            # 处理床位数
            beds = None
            if row.get('beds'):
                try:
                    beds = int(row['beds'])
                except ValueError:
                    pass
            
            # 处理经纬度
            lng = float(row['lng']) if row.get('lng') else None
            lat = float(row['lat']) if row.get('lat') else None
            
            cur.execute("""
                INSERT INTO elderly_service 
                (district, street, name, beds, since, address, phone, zipcode, type, legal_person, lng, lat, geom)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                        CASE WHEN %s IS NOT NULL AND %s IS NOT NULL 
                             THEN ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography 
                             ELSE NULL END)
            """, (
                row.get('district'), row.get('street'), row.get('name'),
                beds, row.get('since'), row.get('address'),
                row.get('phone'), row.get('zipcode'), row.get('type'),
                row.get('legal_person'), lng, lat, lng, lat, lng, lat
            ))
            count += 1
        except Exception as e:
            print(f"导入养老机构数据错误: {e}, 行: {row}")
    
    conn.commit()
    cur.close()
    print(f"✓ 成功导入 {count} 条养老机构数据到数据库")

def import_health_data(conn, rows):
    """导入卫生服务中心数据到数据库"""
    cur = conn.cursor()
    count = 0
    
    for row in rows:
        try:
            lng = float(row['lng']) if row.get('lng') else None
            lat = float(row['lat']) if row.get('lat') else None
            
            cur.execute("""
                INSERT INTO health_center 
                (district, name, address, lng, lat, geom)
                VALUES (%s, %s, %s, %s, %s,
                        CASE WHEN %s IS NOT NULL AND %s IS NOT NULL 
                             THEN ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography 
                             ELSE NULL END)
            """, (
                row.get('district'), row.get('name'), row.get('address'),
                lng, lat, lng, lat, lng, lat
            ))
            count += 1
        except Exception as e:
            print(f"导入卫生中心数据错误: {e}, 行: {row}")
    
    conn.commit()
    cur.close()
    print(f"✓ 成功导入 {count} 条卫生服务中心数据到数据库")

def main():
    # 数据文件路径
    data_dir = os.getenv('DATA_DIR', './data')
    
    elderly_cleaned = os.path.join(data_dir, 'elderly_cleaned.csv')
    elderly_geocoded = os.path.join(data_dir, 'elderly_geocoded.csv')
    health_cleaned = os.path.join(data_dir, 'health_cleaned.csv')
    health_geocoded = os.path.join(data_dir, 'health_geocoded.csv')
    
    # 检查 cleaned 文件是否存在
    for f in [elderly_cleaned, health_cleaned]:
        if not os.path.exists(f):
            print(f"✗ 找不到文件: {f}")
            print("请确保 data 目录下有 elderly_cleaned.csv 和 health_cleaned.csv 文件")
            sys.exit(1)
    
    # 检查 geocoded 文件（旧版），如果不存在给出警告
    for f in [elderly_geocoded, health_geocoded]:
        if not os.path.exists(f):
            print(f"⚠ 找不到旧的 geocoded 文件: {f}，将创建新文件")
    
    print("=" * 60)
    print("数据初始化脚本（修复版）")
    print("=" * 60)
    
    # 步骤1：合并并生成新的 geocoded CSV 文件
    print("\n【步骤1】合并 CSV 数据并生成新的 geocoded 文件")
    print("-" * 60)
    
    elderly_rows = merge_and_export_elderly(
        elderly_cleaned, elderly_geocoded, elderly_geocoded
    )
    
    health_rows = merge_and_export_health(
        health_cleaned, health_geocoded, health_geocoded
    )
    
    # 步骤2：导入数据库
    print("\n【步骤2】导入数据到 PostgreSQL 数据库")
    print("-" * 60)
    
    # 等待数据库
    if not wait_for_db():
        print("✗ 无法连接到数据库")
        sys.exit(1)
    
    # 连接数据库
    conn = psycopg2.connect(**DB_CONFIG)
    
    try:
        # 创建表
        create_tables(conn)
        
        # 导入数据
        import_elderly_data(conn, elderly_rows)
        import_health_data(conn, health_rows)
        
        print("\n" + "=" * 60)
        print("✓ 数据初始化完成！")
        print("=" * 60)
        print(f"\n生成的文件：")
        print(f"  - {elderly_geocoded}")
        print(f"  - {health_geocoded}")
        print(f"\n数据库已更新，可以重启后端服务查看效果。")
    finally:
        conn.close()

if __name__ == "__main__":
    main()