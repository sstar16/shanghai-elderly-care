const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber,
        LevelFormat, PageBreak } = require('docx');
const fs = require('fs');

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Microsoft YaHei", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 52, bold: true, color: "1E3A8A", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 240, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: "1E40AF", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "2563EB", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: "3B82F6", font: "Microsoft YaHei" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-1", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-3", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-4", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "num-list-5", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "上海市公共卫生与养老服务资源智能匹配系统 - 项目设计文档", size: 18, color: "666666" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "第 ", size: 20 }), new TextRun({ children: [PageNumber.CURRENT], size: 20 }), new TextRun({ text: " 页", size: 20 })]
      })] })
    },
    children: [
      // 封面
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("上海市公共卫生与养老服务资源智能匹配系统")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: "项目设计文档", size: 36, bold: true, color: "374151" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: "版本: 1.0", size: 24, color: "6B7280" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: "日期: 2025年1月", size: 24, color: "6B7280" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: "作者: 杨霁然 (2352363)", size: 24, color: "6B7280" })] }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 1. 项目概述
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. 项目概述")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 项目背景")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("随着上海市老龄化程度不断加深，如何高效地为老年人匹配合适的养老服务资源和医疗卫生资源成为重要的社会课题。本系统旨在构建一个智能化的资源匹配平台，帮助老年人及其家属快速找到周边的养老机构和社区卫生服务中心。")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 项目目标")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("实现上海市养老机构和卫生服务中心的地图可视化展示")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持用户定位功能，获取当前位置")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("根据用户位置智能匹配最近的养老和医疗资源")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("提供资源详情查看、筛选和搜索功能")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持路线规划和导航功能")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 技术选型")] }),
      new Table({
        columnWidths: [2500, 3000, 3860],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: { fill: "DBEAFE", type: ShadingType.CLEAR }, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "层次", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "DBEAFE", type: ShadingType.CLEAR }, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "技术", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "DBEAFE", type: ShadingType.CLEAR }, width: { size: 3860, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "说明", bold: true })] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("前端框架")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("React 18")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("组件化开发，生态丰富")] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("地图SDK")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("高德地图JS API 2.0")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("国内地图支持最好，定位准确")] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("后端框架")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("FastAPI (Python)")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("异步高性能，自动API文档")] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("数据库")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("PostgreSQL + PostGIS")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("空间数据查询性能优异")] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("部署方案")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("Docker + Nginx")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3860, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("容器化部署，易于扩展")] })] })]
          })]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 2. 系统架构
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. 系统架构")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 整体架构")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("系统采用前后端分离的B/S架构，分为表现层、业务逻辑层和数据访问层三层结构。")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("架构图")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 100 }, children: [new TextRun({ text: "┌─────────────────────────────────────────────────────────────────┐", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│                     表现层 (Presentation Layer)                 │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   │  React UI  │  │ AMap SDK    │  │   TailwindCSS      │    │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   └─────────────┘  └─────────────┘  └─────────────────────┘    │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "└─────────────────────────────────────────────────────────────────┘", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "                              ↕ HTTP/REST API", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "┌─────────────────────────────────────────────────────────────────┐", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│                   业务逻辑层 (Business Logic Layer)            │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   ┌────────────┐  ┌────────────┐  ┌────────────────────┐     │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   │  FastAPI   │  │ SQLAlchemy │  │  Spatial Services │     │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   └────────────┘  └────────────┘  └────────────────────┘     │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "└─────────────────────────────────────────────────────────────────┘", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "                              ↕ SQL/PostGIS", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "┌─────────────────────────────────────────────────────────────────┐", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│                   数据访问层 (Data Access Layer)               │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   ┌────────────────────┐  ┌─────────────────────────────┐     │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   │   PostgreSQL       │  │         PostGIS             │     │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "│   └────────────────────┘  └─────────────────────────────┘     │", size: 18, font: "Consolas" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "└─────────────────────────────────────────────────────────────────┘", size: 18, font: "Consolas" })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 目录结构")] }),
      new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "shanghai-elderly-care/", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "├── backend/                    # 后端服务", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   ├── app/", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── main.py             # FastAPI 应用入口", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── models.py           # 数据模型", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── schemas.py          # Pydantic 模式", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── database.py         # 数据库连接", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   └── routers/            # API 路由", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   ├── requirements.txt", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   └── Dockerfile", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "├── frontend/                   # 前端应用", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   ├── src/", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── components/         # React 组件", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── pages/              # 页面组件", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   ├── services/           # API 服务", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   │   └── App.jsx", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "│   └── package.json", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "└── docker-compose.yml          # 容器编排", size: 20, font: "Consolas" })] }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 3. 数据库设计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. 数据库设计")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 数据表结构")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("养老服务机构表 (elderly_service)")] }),
      new Table({
        columnWidths: [2000, 2000, 5360],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: { fill: "FEF3C7", type: ShadingType.CLEAR }, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "字段名", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "FEF3C7", type: ShadingType.CLEAR }, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "类型", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "FEF3C7", type: ShadingType.CLEAR }, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "说明", bold: true })] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("id")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("SERIAL PK")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("主键，自增ID")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("district")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("所属区县")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("street")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("所属街道/镇")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("name")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT NOT NULL")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("机构名称")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("beds")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("INTEGER")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("核定床位数")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("since")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("执业年月")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("address")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("详细地址")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("phone")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("联系电话")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("type")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("运营方式（公建公营/民建民营等）")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("lng, lat")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("DOUBLE")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("经度、纬度坐标")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("geom")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("GEOGRAPHY")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("PostGIS空间几何对象")] })] })] })]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 300 }, children: [new TextRun("社区卫生服务中心表 (health_center)")] }),
      new Table({
        columnWidths: [2000, 2000, 5360],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: { fill: "DCFCE7", type: ShadingType.CLEAR }, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "字段名", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "DCFCE7", type: ShadingType.CLEAR }, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "类型", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "DCFCE7", type: ShadingType.CLEAR }, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "说明", bold: true })] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("id")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("SERIAL PK")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("主键，自增ID")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("district")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("所属区县")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("name")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("中心名称")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("address")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("TEXT")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("详细地址")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("lng, lat")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("DOUBLE")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("经度、纬度坐标")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("geom")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("GEOGRAPHY")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("PostGIS空间几何对象")] })] })] })]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 4. API接口设计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. API接口设计")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 接口列表")] }),
      new Table({
        columnWidths: [1500, 2500, 5360],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: { fill: "E0E7FF", type: ShadingType.CLEAR }, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "方法", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "E0E7FF", type: ShadingType.CLEAR }, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "路径", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "E0E7FF", type: ShadingType.CLEAR }, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "说明", bold: true })] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/elderly")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("获取所有养老机构列表")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/elderly/{id}")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("获取养老机构详情")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/elderly/nearby")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("查询附近养老机构（需经纬度和半径参数）")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/health")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("获取所有卫生服务中心列表")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/health/{id}")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("获取卫生服务中心详情")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/health/nearby")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("查询附近卫生服务中心")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/districts")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("获取所有区县列表")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 1500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "GET", color: "059669" })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("/api/statistics")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 5360, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("获取统计数据")] })] })] })]
      }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun("4.2 接口详情示例")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("GET /api/elderly/nearby")] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "请求参数：", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: "  lng: float       # 经度", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "  lat: float       # 纬度", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "  radius: int      # 搜索半径(米)，默认5000", size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: "  limit: int       # 返回数量，默认10", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { before: 150, after: 100 }, children: [new TextRun({ text: "响应示例：", bold: true })] }),
      new Paragraph({ children: [new TextRun({ text: '{', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '  "data": [{', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '    "id": 1,', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '    "name": "上海信养养老服务有限公司",', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '    "address": "上海市场中路4098弄8号",', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '    "distance": 1234.5,', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '    "lng": 121.415111, "lat": 31.300448', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '  }],', size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '  "total": 1', size: 20, font: "Consolas" })] }),
      new Paragraph({ children: [new TextRun({ text: '}', size: 20, font: "Consolas" })] }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 5. 前端功能设计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. 前端功能设计")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 页面布局")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("系统采用左侧边栏+右侧地图的经典布局，主要包含以下组件：")] }),
      new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "顶部导航栏：", bold: true }), new TextRun("包含系统标题、用户定位按钮、设置入口")] }),
      new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "左侧边栏：", bold: true }), new TextRun("资源筛选、搜索框、资源列表、资源详情")] }),
      new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "地图区域：", bold: true }), new TextRun("高德地图展示，标记点、信息窗口、路线规划")] }),
      new Paragraph({ numbering: { reference: "num-list-1", level: 0 }, children: [new TextRun({ text: "底部状态栏：", bold: true }), new TextRun("显示统计信息、当前筛选条件")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 核心功能")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.2.1 地图展示")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("使用高德地图JS API 2.0加载上海市地图")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("养老机构使用橙色标记，卫生服务中心使用绿色标记")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持点聚合，优化大量标记点的展示性能")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持地图缩放、平移、全屏等交互")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.2.2 用户定位")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("调用高德定位API获取用户当前位置")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持手动设置起点位置")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("定位后自动查询周边资源")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.2.3 智能匹配")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("基于用户位置查询最近的养老机构和卫生服务中心")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持设置搜索半径（1km/3km/5km/10km）")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("显示距离排序的资源列表")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.2.4 资源筛选")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("按区县筛选")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("按资源类型筛选（养老机构/卫生服务中心）")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("按运营方式筛选（公建公营/民建民营等）")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("关键词搜索")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("5.2.5 详情展示")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("点击标记点显示信息窗口")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("显示机构详细信息（名称、地址、电话、床位数等）")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持一键拨打电话")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("支持查看路线规划")] }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 6. 部署方案
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. 部署方案")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Docker容器化部署")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("系统采用Docker Compose进行容器编排，包含以下服务：")] }),
      new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "db：", bold: true }), new TextRun("PostgreSQL + PostGIS数据库服务")] }),
      new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "backend：", bold: true }), new TextRun("FastAPI后端服务")] }),
      new Paragraph({ numbering: { reference: "num-list-2", level: 0 }, children: [new TextRun({ text: "frontend：", bold: true }), new TextRun("React前端服务（开发环境）/ Nginx静态服务（生产环境）")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 启动命令")] }),
      new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "# 开发环境启动", size: 20, font: "Consolas", color: "6B7280" })] }),
      new Paragraph({ children: [new TextRun({ text: "docker-compose up -d", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { before: 150 }, children: [new TextRun({ text: "# 查看日志", size: 20, font: "Consolas", color: "6B7280" })] }),
      new Paragraph({ children: [new TextRun({ text: "docker-compose logs -f", size: 20, font: "Consolas" })] }),
      new Paragraph({ spacing: { before: 150 }, children: [new TextRun({ text: "# 停止服务", size: 20, font: "Consolas", color: "6B7280" })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "docker-compose down", size: 20, font: "Consolas" })] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 访问地址")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "前端界面：", bold: true }), new TextRun("http://localhost:3000")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "后端API：", bold: true }), new TextRun("http://localhost:8000")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "API文档：", bold: true }), new TextRun("http://localhost:8000/docs")] }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 7. 数据统计
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("7. 数据概览")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("本系统收录的数据来自上海市公共数据开放平台，数据截至2025年。")] }),
      new Table({
        columnWidths: [4680, 4680],
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: { fill: "FEE2E2", type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "数据类型", bold: true })] })] }),
            new TableCell({ borders: cellBorders, shading: { fill: "FEE2E2", type: ShadingType.CLEAR }, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "数量", bold: true })] })] })]
          }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("养老服务机构")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("627家")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("社区卫生服务中心")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("250家")] })] })] }),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun("覆盖区县")] })] }),
            new TableCell({ borders: cellBorders, width: { size: 4680, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun("16个区")] })] })] })]
      }),
      
      new Paragraph({ children: [new PageBreak()] }),
      
      // 8. 总结
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("8. 总结与展望")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.1 已完成工作")] }),
      new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun("完成数据采集：从上海市公共数据开放平台获取养老机构和卫生服务中心数据")] }),
      new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun("完成数据清洗：处理地址标准化、多地址拆分等问题")] }),
      new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun("完成地理编码：使用高德API将地址转换为经纬度坐标")] }),
      new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun("完成数据库设计：构建PostGIS空间数据库")] }),
      new Paragraph({ numbering: { reference: "num-list-3", level: 0 }, children: [new TextRun("完成系统设计：制定完整的技术方案和接口规范")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.2 后续计划")] }),
      new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun("完成后端API开发和测试")] }),
      new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun("完成前端界面开发和交互优化")] }),
      new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun("集成高德地图各项功能")] }),
      new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun("进行系统测试和性能优化")] }),
      new Paragraph({ numbering: { reference: "num-list-4", level: 0 }, children: [new TextRun("部署上线并收集用户反馈")] }),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("8.3 未来展望")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("引入更多数据源，如医院、药店等医疗资源")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("开发移动端APP，提升用户体验")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("引入AI推荐算法，提供个性化资源匹配")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("研究近似最近邻搜索(ANN)算法，优化大规模空间查询性能")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/home/claude/shanghai-elderly-care/docs/项目设计文档.docx', buffer);
  console.log('设计文档创建成功！');
});
