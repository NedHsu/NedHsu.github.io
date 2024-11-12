---
title: PostgreSQL - 第 16 天 - 高級索引
date: 2024-10-16 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "高級索引能進一步提高數據庫查詢效率，特別是在大型數據集上。今天我們將介紹不同的索引類型，包括 B-tree 索引、Hash 索引、GIN 索引和 GiST 索引等，以及如何選擇和使用合適的索引以最佳化查詢。"
---

## 課程簡介
高級索引能進一步提高數據庫查詢效率，特別是在大型數據集上。今天我們將介紹不同的索引類型，包括 B-tree 索引、Hash 索引、GIN 索引和 GiST 索引等，以及如何選擇和使用合適的索引以最佳化查詢。

---

## 索引概述

索引是數據庫中的一種數據結構，旨在快速定位和檢索數據。雖然索引可以大幅提高查詢性能，但也會佔用存儲空間，並在數據更新時引發額外的維護成本。因此，選擇適當的索引至關重要。

---

## B-tree 索引

**B-tree 索引**是 PostgreSQL 中的默認索引類型，適用於大多數情況，尤其是用於單列數值或字串類型的查詢。B-tree 索引適合 `<`、`<=`、`=`、`>=` 和 `>` 這類比較運算符。

### 語法

```sql
CREATE INDEX 索引名稱 ON 表名 (列名);
```

### 範例

```sql
CREATE INDEX 員工_年齡_idx ON 員工 (年齡);
```

此範例在 `員工` 表的 `年齡` 列上創建了 B-tree 索引，有助於加速年齡篩選條件的查詢。

---

## Hash 索引

**Hash 索引**使用哈希算法來儲存數據，適用於 `=` 比較，但不支援範圍查詢。Hash 索引性能出色，但在數據更新頻繁時效果較差。通常適用於需要頻繁進行等值查詢的列。

### 語法

```sql
CREATE INDEX 索引名稱 ON 表名 USING HASH (列名);
```

### 範例

```sql
CREATE INDEX 員工_電子郵件_hash_idx ON 員工 USING HASH (電子郵件);
```

在此範例中，我們在 `員工` 表的 `電子郵件` 列上創建了 Hash 索引，適用於等值查詢，如通過電子郵件查找員工。

---

## GIN 索引

**GIN 索引**（Generalized Inverted Index）適用於全文檢索和多值列（如陣列、JSONB 等）。GIN 索引支援包含、重疊等多種操作，但建立時間和存儲空間需求較大。

### 語法

```sql
CREATE INDEX 索引名稱 ON 表名 USING GIN (列名);
```

### 範例

```sql
CREATE INDEX 員工_技能_gin_idx ON 員工 USING GIN (技能);
```

在此範例中，我們假設 `技能` 列為 JSONB 或陣列類型，存儲員工的技能數據。GIN 索引有助於快速查找具有特定技能的員工。

---

## GiST 索引

**GiST 索引**（Generalized Search Tree）是高度靈活的索引類型，適合空間數據、範圍查詢和全文檢索。GiST 支援範圍操作，並在地理位置數據和模糊查詢上表現優秀。

### 語法

```sql
CREATE INDEX 索引名稱 ON 表名 USING GiST (列名);
```

### 範例

```sql
CREATE TABLE 區域 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    地理位置 GEOMETRY(Point, 4326)
);

CREATE INDEX 區域_地理位置_gist_idx ON 區域 USING GiST (地理位置);
```

在此範例中，我們在 `區域` 表的 `地理位置` 列上創建了 GiST 索引，適合進行地理範圍查詢。

---

## BRIN 索引

**BRIN 索引**（Block Range INdex）適用於非常大的表，並以塊為單位進行數據查詢，適合用於時間序列數據或其他按順序儲存的數據。BRIN 索引佔用空間較小，但僅適合順序數據，且查詢速度受限於索引的精確度。

### 語法

```sql
CREATE INDEX 索引名稱 ON 表名 USING BRIN (列名);
```

### 範例

```sql
CREATE TABLE 日誌 (
    id SERIAL PRIMARY KEY,
    記錄日期 DATE,
    記錄內容 TEXT
);

CREATE INDEX 日誌_記錄日期_brin_idx ON 日誌 USING BRIN (記錄日期);
```

此範例中，我們在 `日誌` 表的 `記錄日期` 列上建立了 BRIN 索引，用於加速基於日期範圍的查詢。

---

## 索引的選擇指南

- **頻繁進行範圍查詢**：使用 B-tree 或 GiST 索引。
- **頻繁進行等值查詢**：對大量數據使用 Hash 索引（僅限 `=` 操作）。
- **全文檢索或多值列**：使用 GIN 索引。
- **地理位置或空間數據查詢**：使用 GiST 索引。
- **時間序列數據**：使用 BRIN 索引。

---

## 維護索引

在大量數據操作後，索引可能變得不夠高效。可以使用 `REINDEX` 命令重建索引以提升性能：

```sql
REINDEX INDEX 索引名稱;
```

或對整個表進行重建：

```sql
REINDEX TABLE 表名;
```

---

## 範例：綜合使用高級索引

```sql
CREATE TABLE 產品 (
    產品ID SERIAL PRIMARY KEY,
    名稱 VARCHAR(50),
    類別 VARCHAR(50),
    價格 NUMERIC,
    發布日期 DATE,
    標籤 JSONB
);

-- B-tree 索引：適用於範圍查詢
CREATE INDEX 產品_價格_idx ON 產品 (價格);

-- GIN 索引：適用於 JSONB 欄位中的標籤
CREATE INDEX 產品_標籤_gin_idx ON 產品 USING GIN (標籤);

-- BRIN 索引：適用於順序的日期欄位
CREATE INDEX 產品_發布日期_brin_idx ON 產品 USING BRIN (發布日期);
```

這個範例中，我們綜合使用了 B-tree、GIN 和 BRIN 索引來加速不同類型的查詢。

---

## 本日總結
今天我們學習了 PostgreSQL 中的高級索引，包括 B-tree、Hash、GIN、GiST 和 BRIN 索引。了解如何選擇合適的索引類型，並根據數據特徵應用於不同的查詢場景，能顯著提升數據庫性能。明天，我們將深入學習數據完整性相關的進階約束。
