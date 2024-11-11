---
title: PostgreSQL - 第 17 天 - JSON 資料類型
date: 2024-10-17 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "JSON（JavaScript Object Notation）是一種輕量級的數據交換格式，適合儲存結構化的非結構化數據。在 PostgreSQL 中，JSON 和 JSONB（Binary JSON）資料類型提供了強大的功能來儲存和查詢 JSON 資料。今天我們將探討 JSON 與 JSONB 的差異、基本操作和查詢方式。"
---

## 課程簡介
JSON（JavaScript Object Notation）是一種輕量級的數據交換格式，適合儲存結構化的非結構化數據。在 PostgreSQL 中，JSON 和 JSONB（Binary JSON）資料類型提供了強大的功能來儲存和查詢 JSON 資料。今天我們將探討 JSON 與 JSONB 的差異、基本操作和查詢方式。

---

## JSON 與 JSONB 的差異

PostgreSQL 提供了兩種 JSON 資料類型：

1. **JSON**：以原始格式儲存 JSON 資料，並保留原始格式。插入 JSON 資料時不進行解析，查詢速度較慢。
2. **JSONB**：以二進制格式儲存 JSON 資料，進行解析後儲存，不保留原始格式。JSONB 支援索引，查詢速度更快。

**選擇建議**：如果需要頻繁查詢 JSON 資料，建議使用 JSONB，否則可以使用 JSON。

---

## 建立 JSON 或 JSONB 列

### 語法

```sql
CREATE TABLE 表名 (
    id SERIAL PRIMARY KEY,
    資料 JSON  -- 或 JSONB
);
```

### 範例

```sql
CREATE TABLE 產品 (
    產品ID SERIAL PRIMARY KEY,
    名稱 VARCHAR(50),
    詳細資訊 JSONB
);
```

此範例中，`詳細資訊` 欄位使用 JSONB 儲存每個產品的詳細資訊。

---

## 插入 JSON 資料

插入 JSON 資料時，可以直接使用 JSON 格式的字串，PostgreSQL 會自動解析。

### 語法

```sql
INSERT INTO 表名 (列名) VALUES ('{"key": "value"}');
```

### 範例

```sql
INSERT INTO 產品 (名稱, 詳細資訊) 
VALUES ('智慧手機', '{"顏色": "黑色", "存儲": "128GB", "價格": 600}'),
       ('平板電腦', '{"顏色": "白色", "存儲": "256GB", "價格": 800}');
```

此範例將兩個產品的詳細資訊以 JSON 格式插入到 `詳細資訊` 欄位中。

---

## 查詢 JSON 資料

PostgreSQL 支援多種 JSON 查詢運算符，適用於 JSON 和 JSONB。以下是常見的查詢方法。

### 使用 `->` 和 `->>` 操作符

- `->`：返回 JSON 對象的子對象或陣列。
- `->>`：返回 JSON 對象的子對象或陣列的文本值。

### 範例

```sql
-- 查詢產品的存儲空間
SELECT 名稱, 詳細資訊->>'存儲' AS 存儲空間
FROM 產品;
```

此查詢將返回每個產品的名稱和存儲空間。

---

## JSONB 索引

JSONB 支援使用 GIN 索引來加速查詢操作。

### 建立 GIN 索引

```sql
CREATE INDEX 產品_詳細資訊_gin_idx ON 產品 USING GIN (詳細資訊);
```

### 範例：使用索引查詢

```sql
SELECT * 
FROM 產品
WHERE 詳細資訊 @> '{"顏色": "黑色"}';
```

此查詢查找顏色為黑色的產品，GIN 索引將顯著提高查詢速度。

---

## JSON 常用函數

1. **`jsonb_each`**：將 JSONB 對象轉換為鍵值對集。
2. **`jsonb_array_elements`**：將 JSONB 陣列轉換為各元素的集合。
3. **`jsonb_set`**：更新 JSONB 中指定的鍵值。

### 範例

```sql
-- 使用 jsonb_set 更新 JSONB 中的值
UPDATE 產品 
SET 詳細資訊 = jsonb_set(詳細資訊, '{價格}', '650')
WHERE 名稱 = '智慧手機';
```

此範例將智慧手機的價格更新為 650。

---

## JSONB 進階查詢範例

### 查詢包含特定鍵的資料

```sql
SELECT * 
FROM 產品 
WHERE 詳細資訊 ? '價格';
```

此查詢查找包含 `價格` 鍵的所有產品。

### 查詢價格大於某值的產品

```sql
SELECT * 
FROM 產品 
WHERE (詳細資訊->>'價格')::NUMERIC > 700;
```

此查詢返回價格大於 700 的產品。

---

## 本日總結
今天我們學習了 PostgreSQL 中的 JSON 與 JSONB 資料類型，並了解了如何儲存、查詢和更新 JSON 資料。JSON 資料類型適合儲存靈活的結構化數據，在使用 JSONB 時可通過索引提升查詢效率。明天我們將探討 PostgreSQL 的進階查詢技巧。
