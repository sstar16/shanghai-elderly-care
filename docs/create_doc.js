/**
 * 上海市公共卫生与养老服务资源智能匹配系统
 * 项目设计文档生成脚本
 */
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

// 表格边框样式
const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

// 表头单元格样式
const headerCell = (text, width) => new TableCell({
  borders: cellBorders,
  width: { size: width, type: WidthType.DXA },
  shading: { fill: "E8F4FC", type: ShadingType.CLEAR },
  children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size: 22, font: "微软雅黑" })]
  })]
});

// 普通单元格
const normalCell = (text, width) => new TableCell({
  borders: cellBorders,
  width: { size: width, type: WidthType.DXA },
  children: [new Paragraph({
    children: [new TextRun({ text, size: 21, font: "微软雅黑" })]
  })]
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "微软雅黑", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: "1E3A5F", font: "微软雅黑" },
        paragraph: { spacing: { before: 400, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "2E5A8C", font: "微软雅黑" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "3D7AB8", font: "微软雅黑" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "4A8BC7", font: "微软雅黑" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-1",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-4",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "上海市公共卫生与养老服务资源智能匹配系统 - 项目设计文档", size: 18, color: "666666", font: "微软雅黑" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "第 ", size: 18, font: "微软雅黑" }), 
                     new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "微软雅黑" }), 
                     new TextRun({ text: " 页 / 共 ", size: 18, font: "微软雅黑" }), 
                     new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, font: "微软雅黑" }),
                     new TextRun({ text: " 页", size: 18, font: "微软雅黑" })]
        })]
      })
    },
    children: [
      // 封面
      new Paragraph({ spacing: { before: 2000 } }),
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("上海市公共卫生与养老服务")] }),
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("资源智能匹配系统")] }),
      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "项目设计文档", size: 36, color: "666666", font: "微软雅黑" })] }),
      new Paragraph({ spacing: { before: 2000 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "同济大学", size: 28, font: "微软雅黑" })] }),
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "杨霁然  2352363", size: 24, font: "微软雅黑" })] }),
      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "2025年12月", size: 24, color: "666666", font: "微软雅黑" })] }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第一章 项目概述
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、项目概述")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 项目背景")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "随着中国社会老龄化程度加深，上海市作为超大城市面临着巨大的养老服务压力。据统计，上海市60岁以上老年人口已超过580万，占户籍人口的36.8%。为了帮助老年人及其家属更便捷地获取养老服务资源信息，本项目开发了一个基于WebGIS技术的公共卫生与养老服务资源智能匹配系统。", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "本系统整合了上海市公共数据开放平台的养老机构数据（627家）和社区卫生服务中心数据（250家），通过地理空间技术实现资源的可视化展示和智能匹配推荐。", size: 22, font: "微软雅黑" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 项目目标")] }),
      new Paragraph({ numbering: { reference: "num-1", level: 0 },
        children: [new TextRun({ text: "实现上海市养老机构和卫生服务中心的地图可视化展示", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-1", level: 0 },
        children: [new TextRun({ text: "支持用户实时定位，自动匹配周边服务资源", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-1", level: 0 },
        children: [new TextRun({ text: "提供多维度筛选功能（区域、类型、关键词）", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-1", level: 0 },
        children: [new TextRun({ text: "精确计算用户与资源点的地理距离", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-1", level: 0 },
        children: [new TextRun({ text: "展示资源详细信息（名称、地址、联系方式等）", size: 22, font: "微软雅黑" })] }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第二章 系统架构
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、系统架构")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 技术选型")] }),
      new Table({
        columnWidths: [2340, 2340, 4680],
        rows: [
          new TableRow({ children: [headerCell("层级", 2340), headerCell("技术", 2340), headerCell("说明", 4680)] }),
          new TableRow({ children: [normalCell("前端框架", 2340), normalCell("React 18", 2340), normalCell("组件化开发，状态管理简洁", 4680)] }),
          new TableRow({ children: [normalCell("地图引擎", 2340), normalCell("高德地图 JS SDK 2.0", 2340), normalCell("国内最佳地图支持，定位/导航功能完善", 4680)] }),
          new TableRow({ children: [normalCell("UI框架", 2340), normalCell("TailwindCSS", 2340), normalCell("原子化CSS，快速构建响应式界面", 4680)] }),
          new TableRow({ children: [normalCell("后端框架", 2340), normalCell("FastAPI", 2340), normalCell("Python异步框架，自动生成API文档", 4680)] }),
          new TableRow({ children: [normalCell("ORM", 2340), normalCell("SQLAlchemy + GeoAlchemy2", 2340), normalCell("支持PostGIS空间数据类型", 4680)] }),
          new TableRow({ children: [normalCell("数据库", 2340), normalCell("PostgreSQL 16 + PostGIS 3.4", 2340), normalCell("强大的空间查询能力", 4680)] }),
          new TableRow({ children: [normalCell("部署", 2340), normalCell("Docker Compose", 2340), normalCell("容器化部署，环境一致性", 4680)] }),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("2.2 系统分层架构")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "系统采用经典的三层架构设计：", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-2", level: 0 },
        children: [new TextRun({ text: "表现层（Presentation Layer）：React前端应用 + 高德地图组件，负责用户界面展示和交互", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-2", level: 0 },
        children: [new TextRun({ text: "业务逻辑层（Business Layer）：FastAPI后端服务，处理业务逻辑、数据验证、空间查询", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-2", level: 0 },
        children: [new TextRun({ text: "数据访问层（Data Layer）：PostgreSQL + PostGIS数据库，存储和管理空间数据", size: 22, font: "微软雅黑" })] }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第三章 数据库设计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、数据库设计")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 数据来源")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "养老机构数据：上海市民政局 - 上海市公共数据开放平台（2025年9月更新）", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "卫生中心数据：上海市卫生健康委员会 - 上海市公共数据开放平台（2025年更新）", size: 22, font: "微软雅黑" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("3.2 数据处理流程")] }),
      new Paragraph({ numbering: { reference: "num-3", level: 0 },
        children: [new TextRun({ text: "数据清洗：去除空行、标准化地址（添加"上海市"前缀）、处理多地址情况", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-3", level: 0 },
        children: [new TextRun({ text: "地理编码：调用高德地图API将地址转换为经纬度坐标", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-3", level: 0 },
        children: [new TextRun({ text: "数据入库：导入PostgreSQL并创建PostGIS空间索引", size: 22, font: "微软雅黑" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("3.3 数据表结构")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "养老服务机构表 (elderly_service)：", bold: true, size: 22, font: "微软雅黑" })] }),
      new Table({
        columnWidths: [2000, 2000, 5360],
        rows: [
          new TableRow({ children: [headerCell("字段名", 2000), headerCell("类型", 2000), headerCell("说明", 5360)] }),
          new TableRow({ children: [normalCell("id", 2000), normalCell("SERIAL", 2000), normalCell("主键，自增", 5360)] }),
          new TableRow({ children: [normalCell("district", 2000), normalCell("TEXT", 2000), normalCell("所属区", 5360)] }),
          new TableRow({ children: [normalCell("name", 2000), normalCell("TEXT", 2000), normalCell("机构名称", 5360)] }),
          new TableRow({ children: [normalCell("address", 2000), normalCell("TEXT", 2000), normalCell("详细地址", 5360)] }),
          new TableRow({ children: [normalCell("phone", 2000), normalCell("TEXT", 2000), normalCell("联系电话", 5360)] }),
          new TableRow({ children: [normalCell("type", 2000), normalCell("TEXT", 2000), normalCell("运营方式（公办/民办等）", 5360)] }),
          new TableRow({ children: [normalCell("beds", 2000), normalCell("INTEGER", 2000), normalCell("核定床位数", 5360)] }),
          new TableRow({ children: [normalCell("lng/lat", 2000), normalCell("DOUBLE", 2000), normalCell("经纬度坐标", 5360)] }),
          new TableRow({ children: [normalCell("geom", 2000), normalCell("GEOGRAPHY(Point)", 2000), normalCell("PostGIS空间字段(SRID 4326)", 5360)] }),
        ]
      }),

      new Paragraph({ spacing: { before: 200, after: 120 },
        children: [new TextRun({ text: "社区卫生服务中心表 (health_center)：", bold: true, size: 22, font: "微软雅黑" })] }),
      new Table({
        columnWidths: [2000, 2000, 5360],
        rows: [
          new TableRow({ children: [headerCell("字段名", 2000), headerCell("类型", 2000), headerCell("说明", 5360)] }),
          new TableRow({ children: [normalCell("id", 2000), normalCell("SERIAL", 2000), normalCell("主键，自增", 5360)] }),
          new TableRow({ children: [normalCell("district", 2000), normalCell("TEXT", 2000), normalCell("所属区", 5360)] }),
          new TableRow({ children: [normalCell("name", 2000), normalCell("TEXT", 2000), normalCell("中心名称", 5360)] }),
          new TableRow({ children: [normalCell("address", 2000), normalCell("TEXT", 2000), normalCell("详细地址", 5360)] }),
          new TableRow({ children: [normalCell("lng/lat", 2000), normalCell("DOUBLE", 2000), normalCell("经纬度坐标", 5360)] }),
          new TableRow({ children: [normalCell("geom", 2000), normalCell("GEOGRAPHY(Point)", 2000), normalCell("PostGIS空间字段(SRID 4326)", 5360)] }),
        ]
      }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第四章 API接口设计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、API接口设计")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 养老机构接口 (/api/elderly)")] }),
      new Table({
        columnWidths: [1400, 3000, 4960],
        rows: [
          new TableRow({ children: [headerCell("方法", 1400), headerCell("路径", 3000), headerCell("说明", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/", 3000), normalCell("获取所有养老机构列表，支持district/type/keyword筛选", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/{id}", 3000), normalCell("根据ID获取单个机构详情", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/nearby", 3000), normalCell("基于位置查询附近机构，参数：lng, lat, radius, limit", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/types", 3000), normalCell("获取所有机构类型列表", 4960)] }),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("4.2 卫生中心接口 (/api/health)")] }),
      new Table({
        columnWidths: [1400, 3000, 4960],
        rows: [
          new TableRow({ children: [headerCell("方法", 1400), headerCell("路径", 3000), headerCell("说明", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/", 3000), normalCell("获取所有卫生中心列表，支持district/keyword筛选", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/{id}", 3000), normalCell("根据ID获取单个中心详情", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/nearby", 3000), normalCell("基于位置查询附近中心，参数：lng, lat, radius, limit", 4960)] }),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("4.3 统计接口 (/api/statistics)")] }),
      new Table({
        columnWidths: [1400, 3000, 4960],
        rows: [
          new TableRow({ children: [headerCell("方法", 1400), headerCell("路径", 3000), headerCell("说明", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/districts", 3000), normalCell("获取上海市所有区列表", 4960)] }),
          new TableRow({ children: [normalCell("GET", 1400), normalCell("/summary", 3000), normalCell("获取各区资源汇总统计", 4960)] }),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("4.4 核心空间查询")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "附近资源查询使用PostGIS的ST_DWithin函数进行空间范围查询，ST_Distance计算精确距离（单位：米）：", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ spacing: { after: 120 }, indent: { left: 720 },
        children: [new TextRun({ text: "SELECT *, ST_Distance(geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography) as distance", size: 20, font: "Consolas" })] }),
      new Paragraph({ indent: { left: 720 },
        children: [new TextRun({ text: "FROM elderly_service WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radius)", size: 20, font: "Consolas" })] }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第五章 前端设计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("五、前端设计")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 界面布局")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "系统采用左侧边栏+右侧地图的经典WebGIS布局：", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "侧边栏（宽度400px）：搜索筛选区、资源列表、详情展示", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "地图区域：高德地图展示、标记点、信息窗口、图例", size: 22, font: "微软雅黑" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("5.2 核心组件")] }),
      new Table({
        columnWidths: [2500, 6860],
        rows: [
          new TableRow({ children: [headerCell("组件", 2500), headerCell("功能说明", 6860)] }),
          new TableRow({ children: [normalCell("App.jsx", 2500), normalCell("主应用组件，管理全局状态、数据加载、事件处理", 6860)] }),
          new TableRow({ children: [normalCell("MapComponent.jsx", 2500), normalCell("高德地图封装，标记点渲染、聚合、信息窗口、用户定位", 6860)] }),
          new TableRow({ children: [normalCell("Sidebar.jsx", 2500), normalCell("侧边栏组件，搜索筛选、资源列表、Tab切换、距离显示", 6860)] }),
          new TableRow({ children: [normalCell("api.js", 2500), normalCell("Axios封装，统一管理后端API调用", 6860)] }),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("5.3 交互功能")] }),
      new Paragraph({ numbering: { reference: "num-4", level: 0 },
        children: [new TextRun({ text: "实时定位：调用浏览器Geolocation API获取用户位置", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-4", level: 0 },
        children: [new TextRun({ text: "附近搜索：根据用户位置和设定半径（1/3/5/10km）查询周边资源", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-4", level: 0 },
        children: [new TextRun({ text: "图层切换：可独立显示/隐藏养老机构和卫生中心", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-4", level: 0 },
        children: [new TextRun({ text: "标记交互：点击标记点显示信息窗口，展示详细信息", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "num-4", level: 0 },
        children: [new TextRun({ text: "列表联动：点击列表项自动定位到地图对应位置", size: 22, font: "微软雅黑" })] }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第六章 部署方案
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("六、部署方案")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Docker Compose 部署")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "系统使用Docker Compose进行容器化部署，包含三个服务：", size: 22, font: "微软雅黑" })] }),
      new Table({
        columnWidths: [2000, 3000, 4360],
        rows: [
          new TableRow({ children: [headerCell("服务", 2000), headerCell("镜像", 3000), headerCell("端口", 4360)] }),
          new TableRow({ children: [normalCell("db", 2000), normalCell("postgis/postgis:16-3.4", 3000), normalCell("5433:5432", 4360)] }),
          new TableRow({ children: [normalCell("backend", 2000), normalCell("自定义 Python 3.11", 3000), normalCell("8000:8000", 4360)] }),
          new TableRow({ children: [normalCell("frontend", 2000), normalCell("node:18-alpine", 3000), normalCell("3000:3000", 4360)] }),
        ]
      }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("6.2 启动步骤")] }),
      new Paragraph({ spacing: { after: 80 }, indent: { left: 400 },
        children: [new TextRun({ text: "# 1. 启动所有服务", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { after: 80 }, indent: { left: 400 },
        children: [new TextRun({ text: "docker-compose up -d", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { after: 80 }, indent: { left: 400 },
        children: [new TextRun({ text: "# 2. 初始化数据库（首次）", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { after: 80 }, indent: { left: 400 },
        children: [new TextRun({ text: "python scripts/init_data.py", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { after: 80 }, indent: { left: 400 },
        children: [new TextRun({ text: "# 3. 访问应用", size: 20, font: "Consolas" })] }),
      new Paragraph({ indent: { left: 400 },
        children: [new TextRun({ text: "前端: http://localhost:3000 | API文档: http://localhost:8000/docs", size: 20, font: "Consolas" })] }),

      // 分页
      new Paragraph({ children: [new PageBreak()] }),

      // 第七章 总结
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("七、总结与展望")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 项目成果")] }),
      new Paragraph({ spacing: { after: 120 },
        children: [new TextRun({ text: "本项目成功实现了上海市公共卫生与养老服务资源的智能匹配系统，主要成果包括：", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "整合627家养老机构和250家卫生中心的数据，完成地理编码", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "基于PostGIS实现高效的空间查询，支持范围搜索和距离计算", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "开发了完整的前后端应用，提供直观的地图可视化界面", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "支持Docker容器化部署，便于推广和维护", size: 22, font: "微软雅黑" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("7.2 技术亮点")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "使用PostGIS Geography类型，距离计算结果为真实地球表面距离（单位：米）", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "高德地图API处理地理编码，解决了30001错误（多地址情况）", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "FastAPI自动生成OpenAPI文档，方便前后端协作", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "React组件化设计，代码结构清晰，易于扩展", size: 22, font: "微软雅黑" })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200 }, children: [new TextRun("7.3 未来展望")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "接入更多数据源：医院、药店、康复中心等", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "增加路径规划功能：公交/驾车/步行导航", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "引入用户评价系统：服务质量反馈", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "开发移动端App：更便捷的用户体验", size: 22, font: "微软雅黑" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 },
        children: [new TextRun({ text: "应用ANN算法：大规模数据下的近似最近邻搜索优化", size: 22, font: "微软雅黑" })] }),
    ]
  }]
});

// 保存文档
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/shanghai-elderly-care/docs/项目设计文档_完整版.docx', buffer);
  console.log('项目设计文档已生成！');
});
