import csv
import os
import re

# 清洗elderly.csv文件
def clean_elderly_csv(input_file, output_file):
    print("开始清洗elderly.csv文件...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
    
    # 添加标题行（根据数据结构推断）
    headers = ['id', 'district', 'street', 'name', 'beds', 'since', 'address', 'phone', 'zipcode', 'type', 'legal_person']
    
    # 处理每一行数据
    cleaned_rows = []
    for i, row in enumerate(rows):
        # 确保id是整数
        try:
            row[0] = str(int(row[0]))
        except (ValueError, IndexError):
            print(f"警告：第{i+1}行的ID无法转换为整数，跳过该行")
            continue
        
        # 清洗地址字段
        if len(row) > 6:
            # 去除多余空格，确保格式规范
            address = row[6].strip()
            # 添加上海市前缀（如果没有）
            if not address.startswith('上海市') and not address.startswith('上海'):
                address = f"上海市{address}"
            row[6] = address
        
        cleaned_rows.append(row)
    
    # 写入清洗后的数据
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(cleaned_rows)
    
    print(f"elderly.csv清洗完成，保存到{output_file}，共处理{len(cleaned_rows)}条数据")

# 清洗health.csv文件
# 修改clean_health_csv函数中的地址处理逻辑
def clean_health_csv(input_file, output_file):
    print("开始清洗health.csv文件...")
    
    # 添加缺失的csv导入
    import csv
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
    
    # 添加标题行
    headers = ['id', 'district', 'name', 'address']
    
    # 处理每一行数据
    cleaned_rows = []
    i = 0
    bias=0
    while i < len(rows):
        row = rows[i]
        # 跳过空行
        if not any(field.strip() for field in row):
            i += 1
            continue
        
        # 处理序号
        try:
            if row[0] and row[0].strip():
                row[0] = str(int(float(row[0])+bias))
            else:
                # 如果没有序号，跳过
                i += 1
                continue
        except (ValueError, IndexError):
            print(f"警告：第{i+1}行的ID无法转换为整数，跳过该行")
            i += 1
            continue
        
        # 处理地址字段
        if len(row) > 3:
            # 去除多余空格
            address = row[3].strip()
            # 添加上海市前缀
            if not address.startswith('上海市') and not address.startswith('上海'):
                address = f"上海市{address}"
            row[3] = address
            
            # 只保留必要的列
            cleaned_row = row[:4]
            cleaned_rows.append(cleaned_row)
            # 检查下一行是否是当前机构的另一个地址（如第15行的情况）
            if i + 1 < len(rows) and not rows[i+1][0].strip() and len(rows[i+1]) > 3 and rows[i+1][3].strip():
                # 为额外地址创建新记录，使用相同的id、district和name
                additional_address = rows[i+1][3].strip()
                if not additional_address.startswith('上海市') and not additional_address.startswith('上海'):
                    additional_address = f"上海市{additional_address}"
                
                # 创建新记录
                new_record = [
                    str(int(float(row[0])+1)),  # 相同的id
                    row[1] if len(row) > 1 else '',  # 相同的district
                    row[2] if len(row) > 2 else '',  # 相同的name
                    additional_address  # 新的地址
                ]
                cleaned_rows.append(new_record)
                print(f"为ID {row[0]} 创建了额外地址记录: {additional_address}")
                bias+=1
                i += 1  # 跳过下一行
        else:
            # 即使没有地址，也保留其他信息
            print(f"警告：第{i+1}行地址缺失，保留其他信息")

        
        i += 1
    
    # 写入清洗后的数据
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(cleaned_rows)
    
    print(f"health.csv清洗完成，保存到{output_file}，共处理{len(cleaned_rows)}条数据")

# 主函数
if __name__ == "__main__":
    # 定义文件路径
    elderly_input = r"d:\geodb\data\elderly.csv"
    elderly_output = r"d:\geodb\data\elderly_cleaned.csv"
    health_input = r"d:\geodb\data\health.csv"
    health_output = r"d:\geodb\data\health_cleaned.csv"
    
    # 执行清洗
    clean_elderly_csv(elderly_input, elderly_output)
    clean_health_csv(health_input, health_output)
    
    print("\n数据清洗完成！")
    print(f"清洗后的文件：")
    print(f"- {elderly_output}")
    print(f"- {health_output}")
    print("\n请在geocode_elder.py中更新文件路径以使用这些清洗后的文件。")