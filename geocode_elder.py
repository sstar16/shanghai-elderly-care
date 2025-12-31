import os
import time
import csv
import requests
import psycopg2
import subprocess

# ========== 你的配置 ==========
API_KEY = "770ef757ce3d1aea282891bf2c03d221"

# 确保使用data文件夹中的cleaned文件
LOCAL_ELDER_CSV = r"D:\geodb\data\elderly_cleaned.csv"
LOCAL_HEALTH_CSV = r"D:\geodb\data\health_cleaned.csv"

CONTAINER_NAME = "geodb"

DB_HOST = "localhost"
DB_PORT = "5433"
DB_NAME = "elder"
DB_USER = "lzhd"
DB_PASSWORD = "1"
# ==============================
MAX_RETRIES = 5

# -------- 打印美观日志 --------
def info(msg):
    print(f"👉 {msg}")

def success(msg):
    print(f"✔ {msg}")

def error(msg):
    print(f"❌ {msg}")


# -------- 1. 将 CSV 复制进容器 --------
def copy_csv_to_container():
    info("开始复制 CSV 文件到 Docker 容器中...")
    
    # 先检查文件是否存在于data文件夹中
    if not os.path.exists(LOCAL_ELDER_CSV):
        error(f"错误：文件不存在 - {LOCAL_ELDER_CSV}")
        raise FileNotFoundError(f"文件不存在: {LOCAL_ELDER_CSV}")
    
    if not os.path.exists(LOCAL_HEALTH_CSV):
        error(f"错误：文件不存在 - {LOCAL_HEALTH_CSV}")
        raise FileNotFoundError(f"文件不存在: {LOCAL_HEALTH_CSV}")
    
    # 先在容器中创建data目录（如果不存在）
    subprocess.run(["docker", "exec", CONTAINER_NAME, "mkdir", "-p", "/data"], check=True)
    
    # 复制文件到容器的data目录
    subprocess.run(["docker", "cp", LOCAL_ELDER_CSV, f"{CONTAINER_NAME}:/data/elderly_cleaned.csv"], check=True)
    subprocess.run(["docker", "cp", LOCAL_HEALTH_CSV, f"{CONTAINER_NAME}:/data/health_cleaned.csv"], check=True)

    success("CSV 文件复制成功！")


# -------- 2. 初始化数据库表结构 --------
def init_tables():
    info("创建数据库表结构...")

    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER, password=DB_PASSWORD
    )
    cur = conn.cursor()

    sql = """
    DROP TABLE IF EXISTS elderly_service;
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

    DROP TABLE IF EXISTS health_center;
    CREATE TABLE health_center (
        id SERIAL PRIMARY KEY,
        district TEXT,
        name TEXT,
        address TEXT,
        lng DOUBLE PRECISION,
        lat DOUBLE PRECISION,
        geom GEOGRAPHY(Point, 4326)
    );
    """

    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()
    success("表结构创建完成。")


# -------- 3. 导入 CSV → 数据库 --------
def import_csv():
    info("开始导入 CSV 到数据库...")

    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER, password=DB_PASSWORD
    )
    cur = conn.cursor()

    # 养老机构
    cur.execute("""
        COPY elderly_service(id, district, street, name, beds, since, address, phone, zipcode, type, legal_person)
        FROM '/data/elderly_cleaned.csv'
        CSV HEADER ENCODING 'UTF8';
    """)

    # 社区卫生服务中心
    cur.execute("""
        COPY health_center(id, district, name, address)
        FROM '/data/health_cleaned.csv'
        CSV HEADER ENCODING 'UTF8';
    """)

    conn.commit()
    cur.close()
    conn.close()
    success("CSV 数据成功导入数据库！")


# -------- 4. 调用高德 API → 经纬度 --------
# 修改geocode函数，添加处理返回码30001的逻辑
def geocode(address):
    url = "https://restapi.amap.com/v3/geocode/geo"
    params = {"key": API_KEY, "address": address, "city": "上海"}
    retries = 0
    
    # 保存原始地址，用于记录日志
    original_address = address
    
    while retries < MAX_RETRIES:
        try:
            r = requests.get(url, params=params, timeout=5).json()
            
            if r["status"] == "1" and r["geocodes"]:
                lng, lat = r["geocodes"][0]["location"].split(",")
                return float(lng), float(lat)
            else:
                # 获取错误信息和返回码
                error_info = r.get('info')
                status = r.get('status')
                infocode = r.get('infocode')
                
                # 检查是否是返回码30001且地址中包含"、"
                if infocode == "30001" and "、" in address:
                    # 分割地址并取第一部分
                    first_address = address.split("、")[0].strip()
                    info(f"地址解析失败(30001)，尝试使用第一个地址部分: {first_address}")
                    
                    # 使用第一个地址部分重新请求
                    params["address"] = first_address
                    r_retry = requests.get(url, params=params, timeout=5).json()
                    
                    if r_retry["status"] == "1" and r_retry["geocodes"]:
                        lng, lat = r_retry["geocodes"][0]["location"].split(",")
                        success(f"使用部分地址成功获取坐标: {first_address}")
                        return float(lng), float(lat)
                    else:
                        error(f"分割地址后仍解析失败，地址：{first_address}，返回信息：{r_retry.get('info')}")
                else:
                    error(f"地理编码失败，地址：{original_address}，返回信息：{error_info}，状态：{status}，返回码：{infocode}")
                
        except Exception as e:
            retries += 1
            info(f"地理编码请求异常，重试({retries}/{MAX_RETRIES})，错误：{str(e)}")
            time.sleep(0.5)

    error(f"多次尝试后地理编码失败，地址：{original_address}")
    return None, None


def update_coordinates(table):
    info(f"开始地理编码（{table}）...")

    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER, password=DB_PASSWORD
    )
    cur = conn.cursor()

    cur.execute(f"SELECT id, address FROM {table} WHERE address IS NOT NULL;")
    rows = cur.fetchall()

    for id_, addr in rows:
        lng, lat = geocode(addr)
        if lng is None:
            error(f"地址失败：{addr}")
            continue

        cur.execute(f"""
            UPDATE {table}
            SET lng=%s, lat=%s,
                geom = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
            WHERE id=%s;
        """, (lng, lat, lng, lat, id_))

        conn.commit()

        success(f"{addr} → {lng}, {lat}")
        time.sleep(0.2)

    cur.close()
    conn.close()


# 在update_coordinates函数之后添加导出函数
def export_geocoded_data():
    """从数据库导出包含经纬度的CSV文件到本地data文件夹"""
    info("开始导出地理编码数据到本地CSV文件...")
    
    conn = psycopg2.connect(
        host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
        user=DB_USER, password=DB_PASSWORD
    )
    cur = conn.cursor()
    
    # 导出养老服务机构数据
    info("导出养老服务机构数据...")
    cur.execute("""
        SELECT id, district, name, address, lng, lat 
        FROM elderly_service 
        ORDER BY id;
    """)
    rows = cur.fetchall()
    
    # 定义导出文件路径
    elderly_export_path = r"D:\geodb\data\elderly_geocoded.csv"
    with open(elderly_export_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        # 写入表头
        writer.writerow(['id', 'district', 'name', 'address', 'lng', 'lat'])
        # 写入数据
        for row in rows:
            writer.writerow(row)
    success(f"养老服务机构数据已导出到: {elderly_export_path}")
    
    # 导出社区卫生服务中心数据
    info("导出社区卫生服务中心数据...")
    cur.execute("""
        SELECT id, district, name, address, lng, lat 
        FROM health_center 
        ORDER BY id;
    """)
    rows = cur.fetchall()
    
    health_export_path = r"D:\geodb\data\health_geocoded.csv"
    with open(health_export_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.writer(f)
        # 写入表头
        writer.writerow(['id', 'district', 'name', 'address', 'lng', 'lat'])
        # 写入数据
        for row in rows:
            writer.writerow(row)
    success(f"社区卫生服务中心数据已导出到: {health_export_path}")
    
    cur.close()
    conn.close()
    success("地理编码数据导出完成！")

# 修改主函数，在地理编码后添加导出操作
if __name__ == "__main__":
    print("\n======= 🚀 一键导入系统启动 =======\n")

    copy_csv_to_container()
    init_tables()
    import_csv()
    update_coordinates("elderly_service")
    update_coordinates("health_center")
    export_geocoded_data()  # 添加这行来导出地理编码后的数据

    print("\n======= 🎉 全部完成，可以上地图了！ =======")