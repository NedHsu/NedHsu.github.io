---
title: PostgreSQL - 第 27 天 - 儲存最佳化
date: 2024-10-27 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "有效的儲存最佳化不僅能減少磁碟空間使用，還可以提升查詢速度和數據庫整體性能。本文將涵蓋數據壓縮、表和索引的整理、以及高效的數據存儲類型選擇等關鍵技巧。"
---

## 課程簡介
有效的儲存最佳化不僅能減少磁碟空間使用，還可以提升查詢速度和數據庫整體性能。本文將涵蓋數據壓縮、表和索引的整理、以及高效的數據存儲類型選擇等關鍵技巧。

---

## 儲存最佳化方法

### 1. 使用適當的數據類型
選擇合適的數據類型能顯著減少磁碟空間佔用並加快讀寫速度。以下是一些建議：

- **整數類型**：選擇適合範圍的整數類型，如 `SMALLINT` (2 bytes)、`INTEGER` (4 bytes)、`BIGINT` (8 bytes)。
- **浮點數**：若不需要高精度浮點數，`REAL` (4 bytes) 比 `DOUBLE PRECISION` (8 bytes) 更節省空間。
- **字串類型**：避免使用 `TEXT` 和 `VARCHAR(n)`，而使用 `CHAR(n)` 或短字符串能降低空間使用。
- **日期與時間**：若無需時間區間的支持，使用 `DATE` 或 `TIME` 替代 `TIMESTAMP WITH TIME ZONE`。

#### 範例

使用適當的數據類型創建一個表：

```sql
CREATE TABLE optimized_table (
    id SERIAL PRIMARY KEY,
    age SMALLINT,
    salary NUMERIC(10, 2),
    hire_date DATE
);
```

---

### 2. 壓縮數據

PostgreSQL 自帶 TOAST (The Oversized-Attribute Storage Technique)，可對大於一定大小的數據進行壓縮。TOAST 能自動壓縮大型 `TEXT`、`BYTEA` 和 `JSON` 數據，但無需用戶手動配置。若表中包含大量大數據，可以利用 TOAST 的壓縮機制。

### 3. 使用稀疏列（Sparse Columns）

PostgreSQL 支持存儲 NULL 值時不佔用空間。因此，當表中多數數據為 NULL 時，可以通過設計儲存多 NULL 值的列來節省空間。

---

## 表和索引的整理

隨著插入、更新和刪除操作的增多，數據表和索引會產生碎片，導致查詢效率下降。PostgreSQL 提供了一些整理工具來優化儲存空間。

### 1. `VACUUM` 指令

`VACUUM` 用於清除過期數據和釋放未使用的磁碟空間，並重組表的物理佈局。

- **普通 VACUUM**：釋放無用空間，但不會鎖定表。
- **VACUUM FULL**：完全重組表並釋放最大空間，但會鎖住表，應謹慎使用。

#### 範例

```sql
VACUUM ANALYZE table_name;
```

### 2. 自動整理 - 自動 `VACUUM`

PostgreSQL 中有自動 `VACUUM` 功能，能夠自動整理表和索引，確保數據庫維持良好的性能。可以在 `postgresql.conf` 中設置自動 `VACUUM`。

---

### 3. `REINDEX` 重建索引

隨著時間推移，索引可能會變得臃腫和低效。使用 `REINDEX` 可以重建索引，改善查詢性能。

#### 範例

重建特定索引：

```sql
REINDEX INDEX index_name;
```

重建整個表的索引：

```sql
REINDEX TABLE table_name;
```

---

## 壓縮和分區表

### 1. 分區表

當表的數據量非常龐大時，可以使用分區表來減少查詢時間。分區表將數據分為多個物理片段，每次查詢只需訪問相關分區，節省資源並提升性能。

#### 範例

假設我們要對一個大表 `sales` 按年度進行分區：

```sql
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    sale_date DATE,
    amount NUMERIC
) PARTITION BY RANGE (sale_date);

CREATE TABLE sales_2023 PARTITION OF sales
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE sales_2024 PARTITION OF sales
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

### 2. 壓縮表空間

使用表空間壓縮可以顯著減少數據存儲的磁碟需求，特別是在存放歷史數據或存取不頻繁的數據時。

#### 範例

首先創建一個壓縮表空間：

```bash
CREATE TABLESPACE compress_space LOCATION '/data/compress_space' WITH (compression=true);
```

然後將大表移動到此表空間：

```sql
ALTER TABLE large_table SET TABLESPACE compress_space;
```

---

## 使用外部數據表

對於只需偶爾查詢的龐大數據，考慮使用外部數據表以減少本地數據庫負擔。

PostgreSQL 支持 `FDW`（外部數據包）功能，允許數據庫查詢外部數據表。可通過 FDW 訪問 CSV 文件、其他數據庫或非結構化數據源。

#### 範例

使用 PostgreSQL 外部數據包 `postgres_fdw` 訪問外部數據庫：

```sql
CREATE EXTENSION postgres_fdw;

CREATE SERVER foreign_server
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'remote_host', dbname 'remote_db', port '5432');

CREATE USER MAPPING FOR current_user
    SERVER foreign_server
    OPTIONS (user 'remote_user', password 'remote_password');

IMPORT FOREIGN SCHEMA public
    FROM SERVER foreign_server
    INTO local_schema;
```

---

## 儲存最佳化的最佳實踐

1. **定期執行 `VACUUM` 和 `REINDEX`**：維護表和索引的高效性，保持數據庫性能。
2. **使用適合的數據類型**：選擇適當的數據類型能夠節省存儲空間並加快讀取速度。
3. **儲存外部數據**：考慮將非關鍵數據存放於外部系統，減少本地數據庫負荷。
4. **使用分區表**：當表數據量大時，使用分區表優化查詢效率。
5. **選擇性使用壓縮**：僅對大表或歷史數據使用壓縮，以節省磁碟空間。

---

## 本日總結
今天我們探討了 PostgreSQL 中的儲存最佳化技術，包括數據類型選擇、分區表、壓縮、`VACUUM` 和 `REINDEX` 的使用。通過這些技巧，數據庫的儲存效率和查詢性能都能顯著提升。明天，我們將深入學習數據庫的性能監控，幫助優化 PostgreSQL 的運行狀態。
