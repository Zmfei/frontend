# Cell Marker Database Schema

## 概述
本数据库用于存储细胞标记物（Cell Marker）相关数据，包括物种、组织类型、细胞名称、标记物及相关的文献信息。

## 数据库设计原则
- **规范化**: 避免数据冗余，采用适当的关系型设计
- **可扩展性**: 支持未来添加新的物种、组织、细胞类型和标记物
- **完整性**: 通过外键约束保证数据一致性
- **性能**: 为常用查询添加适当的索引

## 字段类型选择说明

### 统一使用TEXT的优势：
- **简化设计**: 不需要预估字段长度，避免设计时的纠结
- **灵活性**: 完全避免因长度限制导致的数据截断问题
- **维护性**: 减少后期因字段长度不够而修改schema的需要
- **PostgreSQL优化**: 在PostgreSQL中，TEXT与VARCHAR性能完全相同
- **存储效率**: 实际存储大小只与数据内容相关，不受声明长度影响
- **一致性**: 统一的字段类型使得代码和维护更加一致

## 表结构设计

### 1. 文献表 (publications)
存储文献的基本信息
```sql
CREATE TABLE publications (
    id SERIAL PRIMARY KEY,
    pmid BIGINT UNIQUE NOT NULL,
    publication_year INTEGER,
    publication_month TEXT,
    title TEXT,
    authors TEXT,
    journal TEXT, -- 期刊名称可能很长
    doi TEXT, -- DOI长度不固定，用TEXT更安全
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_publications_pmid ON publications(pmid);
CREATE INDEX idx_publications_year ON publications(publication_year);
```

### 2. 物种表 (species)
存储物种信息
```sql
CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    latin_name TEXT,
    common_name TEXT,
    taxonomy_id INTEGER, -- NCBI Taxonomy ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE UNIQUE INDEX idx_species_name ON species(name);
CREATE INDEX idx_species_taxonomy_id ON species(taxonomy_id);

-- 初始数据
INSERT INTO species (name, latin_name, common_name) VALUES 
('Human', 'Homo sapiens', 'Human'),
('Mouse', 'Mus musculus', 'Mouse'),
('Rat', 'Rattus norvegicus', 'Rat');
```

### 3. 组织类型表 (tissue_types)
存储组织类型信息
```sql
CREATE TABLE tissue_types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES tissue_types(id), -- 支持层级结构
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE UNIQUE INDEX idx_tissue_types_name ON tissue_types(name);
CREATE INDEX idx_tissue_types_parent_id ON tissue_types(parent_id);
```

### 4. 细胞类型表 (cell_types)
存储细胞类型信息
```sql
CREATE TABLE cell_types (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    parent_id INTEGER REFERENCES cell_types(id), -- 支持层级结构
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, category)
);

-- 索引
CREATE INDEX idx_cell_types_name ON cell_types(name);
CREATE INDEX idx_cell_types_category ON cell_types(category);
CREATE INDEX idx_cell_types_parent_id ON cell_types(parent_id);
```

### 5. 标记物表 (markers)
存储标记物信息
```sql
CREATE TABLE markers (
    id SERIAL PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    full_name TEXT,
    gene_id INTEGER, -- NCBI Gene ID
    aliases TEXT[], -- 别名数组
    marker_type TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE UNIQUE INDEX idx_markers_symbol ON markers(symbol);
CREATE INDEX idx_markers_gene_id ON markers(gene_id);
CREATE INDEX idx_markers_type ON markers(marker_type);
CREATE INDEX idx_markers_aliases ON markers USING GIN(aliases);
```

### 6. 细胞标记物关系表 (cell_markers)
核心关系表，存储细胞类型与标记物的关联关系
```sql
CREATE TABLE cell_markers (
    id SERIAL PRIMARY KEY,
    species_id INTEGER NOT NULL REFERENCES species(id),
    tissue_type_id INTEGER NOT NULL REFERENCES tissue_types(id),
    cell_type_id INTEGER NOT NULL REFERENCES cell_types(id),
    marker_id INTEGER NOT NULL REFERENCES markers(id),
    publication_id INTEGER NOT NULL REFERENCES publications(id),
    expression_level TEXT,
    confidence_score DECIMAL(3,2), -- 0.00-1.00
    validation_method TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 复合唯一约束，防止重复记录
CREATE UNIQUE INDEX idx_cell_markers_unique ON cell_markers(
    species_id, tissue_type_id, cell_type_id, marker_id, publication_id
);

-- 查询优化索引
CREATE INDEX idx_cell_markers_species ON cell_markers(species_id);
CREATE INDEX idx_cell_markers_tissue ON cell_markers(tissue_type_id);
CREATE INDEX idx_cell_markers_cell_type ON cell_markers(cell_type_id);
CREATE INDEX idx_cell_markers_marker ON cell_markers(marker_id);
CREATE INDEX idx_cell_markers_publication ON cell_markers(publication_id);
CREATE INDEX idx_cell_markers_expression ON cell_markers(expression_level);
```

### 7. 数据来源表 (data_sources)
记录数据的来源和版本信息
```sql
CREATE TABLE data_sources (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, -- 数据源名称
    version TEXT,
    url TEXT,
    description TEXT,
    import_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. 审计日志表 (audit_logs)
记录数据变更历史
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    operation TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

## 视图定义

### 1. 完整的细胞标记物信息视图
```sql
CREATE VIEW v_cell_marker_details AS
SELECT 
    cm.id,
    s.name as species_name,
    tt.name as tissue_type,
    ct.name as cell_type,
    m.symbol as marker_symbol,
    m.full_name as marker_full_name,
    cm.expression_level,
    cm.confidence_score,
    cm.validation_method,
    p.pmid,
    p.publication_year,
    p.publication_month,
    p.title as publication_title,
    cm.created_at
FROM cell_markers cm
JOIN species s ON cm.species_id = s.id
JOIN tissue_types tt ON cm.tissue_type_id = tt.id
JOIN cell_types ct ON cm.cell_type_id = ct.id
JOIN markers m ON cm.marker_id = m.id
JOIN publications p ON cm.publication_id = p.id;
```

### 2. 统计视图
```sql
-- 每个物种的标记物统计
CREATE VIEW v_species_stats AS
SELECT 
    s.name as species_name,
    COUNT(DISTINCT cm.marker_id) as marker_count,
    COUNT(DISTINCT cm.cell_type_id) as cell_type_count,
    COUNT(DISTINCT cm.tissue_type_id) as tissue_type_count,
    COUNT(DISTINCT cm.publication_id) as publication_count
FROM species s
LEFT JOIN cell_markers cm ON s.id = cm.species_id
GROUP BY s.id, s.name;

-- 每年发表的文献统计
CREATE VIEW v_publication_yearly_stats AS
SELECT 
    publication_year,
    COUNT(*) as publication_count,
    COUNT(DISTINCT cm.marker_id) as unique_markers,
    COUNT(DISTINCT cm.cell_type_id) as unique_cell_types
FROM publications p
LEFT JOIN cell_markers cm ON p.id = cm.publication_id
WHERE publication_year IS NOT NULL
GROUP BY publication_year
ORDER BY publication_year DESC;
```

## 数据导入建议

### 1. 数据预处理
在导入Excel数据前，建议进行以下预处理：
- 标准化物种名称（如统一使用"Human"而非"human"或"Homo sapiens"）
- 清理组织类型名称，建立统一的命名规范
- 验证和标准化标记物符号
- 验证PMID的有效性

### 2. 导入顺序
1. 先导入基础数据：species, tissue_types, cell_types, markers, publications
2. 最后导入关系数据：cell_markers

### 3. 示例导入脚本
```sql
-- 1. 插入物种数据
INSERT INTO species (name) VALUES ('Human') ON CONFLICT (name) DO NOTHING;

-- 2. 插入组织类型数据
INSERT INTO tissue_types (name) VALUES ('Muscle organ') ON CONFLICT (name) DO NOTHING;

-- 3. 插入细胞类型数据
INSERT INTO cell_types (name) VALUES ('glial cell') ON CONFLICT (name) DO NOTHING;

-- 4. 插入标记物数据
INSERT INTO markers (symbol) VALUES ('S100A15A'), ('S100A7L2') ON CONFLICT (symbol) DO NOTHING;

-- 5. 插入文献数据
INSERT INTO publications (pmid, publication_year, publication_month) 
VALUES (35549404, NULL, NULL), (389309, 1979, 'Dec') 
ON CONFLICT (pmid) DO NOTHING;

-- 6. 插入关系数据
INSERT INTO cell_markers (species_id, tissue_type_id, cell_type_id, marker_id, publication_id)
SELECT 
    s.id, tt.id, ct.id, m.id, p.id
FROM species s, tissue_types tt, cell_types ct, markers m, publications p
WHERE s.name = 'Human' 
    AND tt.name = 'Muscle organ' 
    AND ct.name = 'glial cell' 
    AND m.symbol = 'S100A15A' 
    AND p.pmid = 35549404;
```

## 扩展建议

### 1. 未来可能的扩展
- 添加蛋白质相互作用数据
- 集成基因表达数据
- 添加疾病关联信息
- 集成单细胞测序数据
- 添加空间转录组数据支持

### 2. 性能优化
- 根据查询模式添加复合索引
- 考虑分区表（按物种或年份分区）
- 实现缓存机制
- 定期更新统计信息

### 3. 数据质量
- 实现数据验证规则
- 建立数据清洗流程
- 定期进行数据一致性检查
- 建立数据更新和同步机制

## 性能优化索引策略

### 概述
针对30万+ cell_marker记录的性能优化方案，主要优化模糊搜索、多条件查询和排序性能。

### 完整优化SQL
```sql
-- ========================================
-- 数据库性能优化索引 - 完整版
-- 适用于30万+ cell_marker记录
-- 只创建索引，不创建额外表
-- ========================================

-- 第一步：启用必要的扩展
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 第二步：优化 cell_markers 表的核心索引
-- 针对最常见的多条件查询组合
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_species_tissue 
ON cell_markers(species_id, tissue_type_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_species_tissue_cell 
ON cell_markers(species_id, tissue_type_id, cell_type_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_species_tissue_year 
ON cell_markers(species_id, tissue_type_id, publication_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_tissue_species_year 
ON cell_markers(tissue_type_id, species_id, publication_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_marker 
ON cell_markers(marker_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_publication 
ON cell_markers(publication_id);

-- 第三步：优化 publications 表
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_publications_year 
ON publications(publication_year DESC) 
WHERE publication_year IS NOT NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_publications_pmid 
ON publications(pmid);

-- 第四步：优化模糊搜索（最重要）
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_markers_symbol_gin 
ON markers USING gin(symbol gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_species_name_gin 
ON species USING gin(name gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tissue_types_name_gin 
ON tissue_types USING gin(name gin_trgm_ops);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_types_name_gin 
ON cell_types USING gin(name gin_trgm_ops);

-- 第五步：优化排序和统计查询
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_created_at 
ON cell_markers(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_expression 
ON cell_markers(expression_level);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_markers_confidence 
ON cell_markers(confidence_score);

-- 第六步：优化基础表的查询
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_species_name 
ON species(name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_tissue_types_name 
ON tissue_types(name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cell_types_name 
ON cell_types(name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_markers_symbol 
ON markers(symbol);

-- 第七步：更新所有表的统计信息
ANALYZE cell_markers;
ANALYZE species;
ANALYZE tissue_types;
ANALYZE cell_types;
ANALYZE markers;
ANALYZE publications;

-- 第八步：验证索引创建成功
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('cell_markers', 'species', 'tissue_types', 'cell_types', 'markers', 'publications')
ORDER BY tablename, indexname;
```

### 优化效果预期
- **模糊搜索性能**：提升 10-100倍
- **多条件查询性能**：提升 5-20倍  
- **排序查询性能**：提升 3-10倍
- **30万条数据查询时间**：从几秒降到几百毫秒

### 执行建议
1. **备份数据库**：执行前务必备份
2. **低峰期执行**：避免影响正常业务
3. **监控进度**：使用 `CONCURRENTLY` 避免锁表
4. **验证效果**：执行完成后测试查询性能

### 索引说明
- **GIN索引**：优化模糊搜索（ILIKE查询）
- **复合索引**：优化多条件组合查询
- **单列索引**：优化基础筛选和排序
- **条件索引**：针对非空值优化

这个schema设计具有良好的可扩展性和规范性，能够支持你当前的数据需求，同时为未来的功能扩展预留了空间。
