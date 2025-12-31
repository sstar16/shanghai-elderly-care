"""
自然语言查询服务
使用 Ollama 解析用户自然语言，生成结构化查询
"""
import json
import httpx
from typing import Optional
from pydantic import BaseModel

# Ollama 配置
OLLAMA_BASE_URL = "http://host.docker.internal:11434"
OLLAMA_MODEL = "Qwen2.5:latest"

class ParsedQuery(BaseModel):
    """解析后的查询结构"""
    resource_type: Optional[str] = None  # elderly/health/both
    district: Optional[str] = None       # 区县
    min_beds: Optional[int] = None       # 最小床位数
    max_beds: Optional[int] = None       # 最大床位数
    keyword: Optional[str] = None        # 关键词
    service_type: Optional[str] = None   # 公办/民办等
    radius: Optional[float] = None       # 搜索半径(米)
    near_location: Optional[str] = None  # 参考位置描述
    limit: Optional[int] = 20000            # 返回数量限制

# 系统提示词
SYSTEM_PROMPT = """你是一个上海市养老和医疗资源查询助手。你的任务是将用户的自然语言查询解析为结构化的JSON格式。

可用的资源类型：
- elderly: 养老服务机构
- health: 社区卫生服务中心
- both: 两者都查询

你要灵活辨别某些近义词，比如"养老院"、"敬老院"、"护理院"等都指养老服务机构。
而"社区医院"、"卫生服务中心"等都指社区卫生服务中心。

上海市的区县包括：
黄浦区、徐汇区、长宁区、静安区、普陀区、虹口区、杨浦区、闵行区、宝山区、嘉定区、浦东新区、金山区、松江区、青浦区、奉贤区、崇明区

养老机构运营类型说明：
- 数据库中的实际类型：民建民营、公建民营、公建公营
- 用户说"民办"时，应匹配：民建民营、公建民营（两种都算民办）
- 用户说"公办"时，应匹配：公建公营
- 如果用户说具体类型如"民建民营"、"公建民营"、"公建公营"，则精确匹配

注意：当用户查询"民办"时，service_type 应设为 "民建民营"（系统会同时匹配民建民营和公建民营）；
      当用户查询"公办"时，service_type 应设为 "公建公营"

请将用户查询解析为以下JSON格式（只输出JSON，不要其他内容）：
{
    "resource_type": "elderly/health/both",
    "district": "区县名称或null",
    "min_beds": 最小床位数或null,
    "max_beds": 最大床位数或null,
    "keyword": "关键词或null",
    "service_type": "运营类型或null",
    "radius": 搜索半径米数或null,
    "near_location": "位置描述或null",
    "limit": 返回数量
}

示例：
用户: "找浦东新区床位超过100张的养老院"
输出: {"resource_type": "elderly", "district": "浦东新区", "min_beds": 100, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "附近3公里内的社区医院"
输出: {"resource_type": "health", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": 3000, "near_location": null, "limit": 20000}

用户: "静安区公办的敬老院"
输出: {"resource_type": "elderly", "district": "静安区", "min_beds": null, "max_beds": null, "keyword": "敬老院", "service_type": "公办", "radius": null, "near_location": null, "limit": 20000}

用户: "找浦东新区床位超过100张的养老院"
输出: {"resource_type": "elderly", "district": "浦东新区", "min_beds": 100, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "附近3公里内的社区医院"
输出: {"resource_type": "health", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": 3000, "near_location": null, "limit": 20000}

用户: "静安区公办的敬老院"
输出: {"resource_type": "elderly", "district": "静安区", "min_beds": null, "max_beds": null, "keyword": "敬老院", "service_type": "公办", "radius": null, "near_location": null, "limit": 20000}

用户: "徐汇区有哪些养老院"
输出: {"resource_type": "elderly", "district": "徐汇区", "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "找5家离我最近的养老院"
输出: {"resource_type": "elderly", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 5}

用户: "找离我最近的3家民办养老院"
输出: {"resource_type": "elderly", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": "民办", "radius": null, "near_location": null, "limit": 3}

用户: "找离我最近的公办养老院"
输出: {"resource_type": "elderly", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": "公办", "radius": null, "near_location": null, "limit": 1}

用户: "最近的养老院"
输出: {"resource_type": "elderly", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 1}

用户: "黄浦区的社区卫生服务中心"
输出: {"resource_type": "health", "district": "黄浦区", "min_beds": null, "max_bytes": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "床位50到100张的民办养老院"
输出: {"resource_type": "elderly", "district": null, "min_beds": 50, "max_beds": 100, "keyword": null, "service_type": "民办", "radius": null, "near_location": null, "limit": 20000}

用户: "嘉定区公建民营的护理院"
输出: {"resource_type": "elderly", "district": "嘉定区", "min_beds": null, "max_beds": null, "keyword": "护理院", "service_type": "公建民营", "radius": null, "near_location": null, "limit": 20000}

用户: "附近5公里有什么养老机构和医院"
输出: {"resource_type": "both", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": 5000, "near_location": null, "limit": 20000}

用户: "松江区床位200张以上的大型养老院"
输出: {"resource_type": "elderly", "district": "松江区", "min_beds": 200, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "奉贤区有几个卫生中心"
输出: {"resource_type": "health", "district": "奉贤区", "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "闵行区公办民营养老机构"
输出: {"resource_type": "elderly", "district": "闵行区", "min_beds": null, "max_beds": null, "keyword": null, "service_type": "公办民营", "radius": null, "near_location": null, "limit": 20000}

用户: "附近1公里内的医疗资源"
输出: {"resource_type": "health", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": 1000, "near_location": null, "limit": 20000}

用户: "崇明区所有养老服务设施"
输出: {"resource_type": "elderly", "district": "崇明区", "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "找10家床位最多的养老院"
输出: {"resource_type": "elderly", "district": null, "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 10}

用户: "长宁区和普陀区的养老院"
输出: {"resource_type": "elderly", "district": "长宁区", "min_beds": null, "max_beds": null, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

用户: "宝山区小型养老院床位50张以下"
输出: {"resource_type": "elderly", "district": "宝山区", "min_beds": null, "max_beds": 50, "keyword": null, "service_type": null, "radius": null, "near_location": null, "limit": 20000}

注意：
- 当用户说"找最近的X家"或"离我最近的X个"时，X是limit（返回数量），radius应设为null以确保能找到足够的结果
- 当用户说"X公里内"时，X*1000是radius
- 如果用户只说"最近"没有指定数量，limit设为1，radius设为null
"""

async def parse_natural_language(query: str) -> ParsedQuery:
    """
    使用 Ollama 解析自然语言查询
    """
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": f"用户查询: {query}",
                    "system": SYSTEM_PROMPT,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,  # 低温度，更确定性的输出
                    }
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Ollama API 错误: {response.status_code}")
            
            result = response.json()
            llm_output = result.get("response", "")
            
            # 提取JSON
            parsed_json = extract_json(llm_output)
            
            if parsed_json:
                return ParsedQuery(**parsed_json)
            else:
                # 解析失败，返回默认查询
                return ParsedQuery(resource_type="both", keyword=query)
                
    except httpx.ConnectError:
        raise Exception("无法连接到 Ollama 服务，请确保 Ollama 正在运行")
    except Exception as e:
        raise Exception(f"解析失败: {str(e)}")


def extract_json(text: str) -> Optional[dict]:
    """从LLM输出中提取JSON"""
    import re
    
    # 尝试直接解析
    try:
        return json.loads(text.strip())
    except:
        pass
    
    # 尝试提取 ```json ... ``` 代码块
    json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', text)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except:
            pass
    
    # 尝试找到 { } 之间的内容
    brace_match = re.search(r'\{[\s\S]*\}', text)
    if brace_match:
        try:
            return json.loads(brace_match.group())
        except:
            pass
    
    return None


async def check_ollama_status() -> dict:
    """检查 Ollama 服务状态"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            # 检查服务
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m.get("name", "") for m in models]
                return {
                    "status": "online",
                    "models": model_names,
                    "current_model": OLLAMA_MODEL,
                    "model_available": any(OLLAMA_MODEL in name for name in model_names)
                }
    except:
        pass
    
    return {
        "status": "offline",
        "models": [],
        "current_model": OLLAMA_MODEL,
        "model_available": False
    }
