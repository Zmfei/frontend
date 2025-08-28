# DeepMarker Backend

## 项目简介

DeepMarker 是一个现代化的细胞标记基因数据库系统，提供高效的数据查询、可视化和分析功能。

## 环境依赖

- Python >= 3.11
- PostgreSQL 数据库

## 快速开始

### 1. 环境配置

复制环境变量模板文件：
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接：
```bash
# PostgreSQL 数据库连接
DATABASE_URL="postgresql://postgres:[PASSWORD]@127.0.0.1:5432/deepmarker?sslmode=disable"

# 可选：LangSmith 监控
LANGSMITH_API_KEY=your_api_key
LANGSMITH_PROJECT=deepmarker
```

### 2. 数据库设置

确保 PostgreSQL 服务已启动，并创建数据库：
```bash
# 创建数据库
createdb deepmarker

# 或使用 psql
psql -c "CREATE DATABASE deepmarker;"
```

**注意**：首次启动服务时，系统会自动连接 PostgreSQL 数据库并创建所需的表结构。

### 3. 安装依赖

```bash
pip install .
```

### 4. 启动服务

```bash
python -m src.main
```

服务将在 http://localhost:8002 启动，并自动：
- 连接 PostgreSQL 数据库
- 创建必要的表结构和视图
- 生成 Swagger API 文档

## 数据导入

### 导入流程

1. 访问 Swagger UI：http://localhost:8002/docs
2. 找到数据导入相关接口
3. 上传以下 Excel 文件：
   - `backend/resources/deepmarker.xlsx` - 主要标记基因数据
   - `backend/resources/pmid_with_dates.xlsx` - 文献发表日期数据

### 数据文件说明

| 文件 | 描述 | 位置 |
|------|------|------|
| `deepmarker.xlsx` | 包含细胞标记基因、组织类型、细胞类型等核心数据 | `backend/resources/` |
| `pmid_with_dates.xlsx` | 包含 PMID 对应的发表年份信息 | `backend/resources/` |

## API 接口概览

### 🔍 查询接口

- **`GET /query/cell-markers`** - 查询细胞标记基因数据
  - 支持按物种、组织、细胞类型、标记基因、发表年份筛选
  - 返回详细的标记基因信息

- **`GET /query/options/*`** - 获取筛选选项
  - `/options/species` - 物种列表
  - `/options/tissues` - 组织类型列表
  - `/options/cell-types` - 细胞类型列表
  - `/options/publication-years` - 发表年份列表

### 📊 统计接口

- **`GET /query/species-stats`** - 物种统计信息
- **`GET /query/publication-stats`** - 发表年份统计
- **`GET /query/tissue-stats`** - 组织分布统计
- **`GET /query/database-info`** - 数据库概览信息

### 📁 数据管理

- **数据导入接口** - 通过 Swagger UI 上传 Excel 文件
- **数据验证接口** - 检查数据完整性和一致性

## 开发文档

### Swagger API 文档

启动服务后访问：http://localhost:8002/docs

- 📋 完整的接口列表和参数说明
- 🧪 在线测试功能
- 📤 文件上传界面
- 📊 响应示例和数据格式

### 项目结构

```
backend/
├── src/
│   ├── api/          # API 路由和接口
│   ├── db/           # 数据库连接和操作
│   ├── agent/        # 数据处理逻辑
│   └── main.py       # 应用入口
├── resources/        # 数据文件
│   ├── deepmarker.xlsx
│   └── pmid_with_dates.xlsx
└── README.md
```

## 技术栈

- **FastAPI** - 现代化 Python Web 框架
- **PostgreSQL** - 关系型数据库
- **asyncpg** - 异步 PostgreSQL 驱动
- **Pandas** - 数据处理和分析
- **Pydantic** - 数据验证和序列化


## 故障排除

### 常见问题

**Q: 数据库连接失败**
- 检查 PostgreSQL 服务是否启动
- 验证 `.env` 文件中的数据库连接字符串
- 确认数据库 `deepmarker` 已创建

**Q: 数据导入失败**
- 确认 Excel 文件路径正确
- 检查文件格式和数据完整性
- 查看服务日志获取详细错误信息

**Q: 接口响应慢**
- 检查数据库索引是否正确创建
- 考虑增加数据库连接池大小
- 监控系统资源使用情况