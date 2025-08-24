# DeepMarker Backend

## 项目简介

本项目是一个生物cellmarker信息数据处理系统.


## 环境依赖

- Python >= 3.11
- PostgreSQL 数据库（本地或Supabase均可）

## 环境变量配置

在项目根目录创建 `.env` 文件，内容示例：

```
# 必需
DATABASE_URL=postgresql://用户名:密码@主机:端口/数据库名
DASHSCOPE_API_KEY=你的阿里云百炼API密钥
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 可选
LANGSMITH_API_KEY=xxx
LANGSMITH_PROJECT=benchmark
```

### 环境变量详细说明

#### `DATABASE_URL` - 数据库连接字符串
- **Supabase在线服务（推荐）**：
  1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
  2. 选择你的项目
  3. 进入 "Settings" → "Database"
  4. 在 "Connection string" 部分找到 "URI" 格式
  5. 格式：`postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`
  6. 如果不支持IPV6，可以使用 "Transaction pooler" 连接

- **本地PostgreSQL**：
  1. 确保PostgreSQL服务已启动
  2. 创建数据库：`createdb benchmark_system`
  3. 格式：`postgresql://用户名:密码@localhost:5432/数据库名`

#### `SUPABASE_URL` - Supabase项目URL
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 "Settings" → "API"
4. 在 "Project URL" 部分复制URL
5. 格式：`https://[YOUR-PROJECT-REF].supabase.co`

#### `SUPABASE_ANON_KEY` - Supabase匿名密钥
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 "Settings" → "API"
4. 在 "Project API keys" 部分找到 "anon public" 密钥
5. 格式：`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（以"eyJhbG"开头）

#### `DASHSCOPE_API_KEY` - 阿里云百炼API密钥
1. 登录 [阿里云百炼控制台](https://bailian.console.aliyun.com/)
2. 进入 "API密钥管理"
3. 创建新的API密钥
4. 复制密钥到环境变量

#### `LANGSMITH_API_KEY` (可选)
- 用于LangSmith监控和调试
- 在 [LangSmith](https://smith.langchain.com/) 创建账户并获取API密钥

#### `LANGSMITH_PROJECT` (可选)
- LangSmith项目名称，默认为 "benchmark"


## 安装依赖

```bash
pip install .
```

## 运行方式

### 1. 启动API服务（推荐开发/生产）

```bash
python -m src.main
```
- 服务默认监听 http://localhost:8000
- Swagger文档自动生成，访问 http://localhost:8000/docs

### 2. LangGraph CLI开发模式

```bash
langgraph dev
```
- 支持多流程图调试，配置见 `langgraph.json`
- 推荐用于流程开发、调试和可视化

## Swagger API 文档

- 启动API服务后，访问 [http://localhost:8000/docs](http://localhost:8000/docs) 查看所有接口、参数和示例