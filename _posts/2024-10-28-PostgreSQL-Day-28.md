---
title: PostgreSQL - 第 28 天 - 查詢優化
date: 2024-10-28 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "查詢優化有助於縮短查詢時間、降低資源消耗，從而提升數據庫整體效率。我們將探討索引的應用、查詢計劃的分析、篩選條件的使用和查詢結構的優化等技巧。"
---

## 課程簡介
查詢優化有助於縮短查詢時間、降低資源消耗，從而提升數據庫整體效率。我們將探討索引的應用、查詢計劃的分析、篩選條件的使用和查詢結構的優化等技巧。

---

## 查詢優化方法

### 1. 使用合適的索引
索引能加速查詢，尤其在大數據表中更為顯著。然而，過多或不當的索引反而會拖慢性能，因此需要合理規劃。

- **單列索引**：適用於常用查詢中使用的單一列。
- **多列索引**：適用於多列一起出現在 WHERE 子句中的查詢。
- **唯一索引**：確保數據唯一性的同時提升查詢速度。
- **部分索引**：針對特定條件建立索引，減少不必要的數據範圍。

#### 範例

對 `users` 表中的 `email` 列建立索引：

```sql
CREATE INDEX idx_users_email ON users (email);
```

對 `orders` 表中的 `user_id` 和 `status` 建立多列索引：

```sql
CREATE INDEX idx_orders_userid_status ON orders (user_id, status);
```

---

### 2. 分析查詢計劃 (`EXPLAIN`)

`EXPLAIN` 指令可用於查看查詢的執行計劃，分析數據庫如何執行該查詢。通過查詢計劃，可以找到瓶頸並改進查詢效率。

#### 使用 `EXPLAIN` 指令

```sql
EXPLAIN SELECT * FROM orders WHERE user_id = 123;
```

#### 使用 `EXPLAIN ANALYZE` 獲取實際執行時間

`EXPLAIN ANALYZE` 執行查詢並顯示實際運行時間和數據庫的執行計劃：

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
```

查看輸出中的 `Seq Scan`（全表掃描）和 `Index Scan`（索引掃描）可以幫助識別是否需新增索引。

---

### 3. 避免 SELECT * 查詢

`SELECT *` 會返回所有欄位，可能導致不必要的數據傳輸。建議只選擇必要的欄位，減少數據庫的負擔。

#### 範例

**避免**：

```sql
SELECT * FROM users WHERE user_id = 1;
```

**優化後**：

```sql
SELECT user_id, username FROM users WHERE user_id = 1;
```

---

### 4. 使用合適的 WHERE 條件

在查詢中應合理使用 WHERE 條件篩選數據，避免不必要的全表掃描。對大數據表，盡量使用索引列作為查詢條件。

#### 範例

**避免**：不加條件會進行全表掃描

```sql
SELECT * FROM orders;
```

**優化後**：篩選特定條件，並確保 `user_id` 列上有索引

```sql
SELECT * FROM orders WHERE user_id = 123;
```

---

### 5. 使用 LIMIT 限制結果

當查詢僅需部分結果時，可使用 `LIMIT` 限制返回的行數，減少數據庫的計算量。

#### 範例

僅返回前 10 筆數據：

```sql
SELECT * FROM orders WHERE user_id = 123 ORDER BY order_date DESC LIMIT 10;
```

---

## 使用索引條件下推 (Index Condition Pushdown)

PostgreSQL 支援索引條件下推 (Index Condition Pushdown)，當條件符合索引列時，能夠直接在索引層級上過濾數據，減少數據讀取量。

#### 範例

查詢 `orders` 表中 `user_id` 和 `status` 符合條件的記錄，若建立了多列索引，查詢速度會更快：

```sql
SELECT * FROM orders WHERE user_id = 123 AND status = 'completed';
```

---

## 善用聚合函數

當查詢涉及數據聚合（如計算總和、平均值等）時，使用聚合函數可提升效率，尤其是在索引列上執行。

#### 範例

計算用戶總消費額：

```sql
SELECT user_id, SUM(amount) FROM orders WHERE status = 'completed' GROUP BY user_id;
```

---

### 6. 善用 `JOIN` 操作

對於多表查詢，應合理使用 `JOIN`，並確保 `JOIN` 使用的列有適當的索引。避免多層嵌套的 `JOIN`，盡量簡化查詢結構。

#### 範例

在 `orders` 和 `users` 表上執行 `JOIN`，並在 `user_id` 上加索引：

```sql
SELECT users.username, orders.order_date
FROM orders
JOIN users ON orders.user_id = users.user_id
WHERE orders.status = 'completed';
```

---

### 7. 使用臨時表優化複雜查詢

對於非常複雜的查詢，可將中間結果儲存於臨時表中，再執行後續查詢，減少計算量。

#### 範例

首先查詢活躍用戶，再基於結果執行進一步查詢：

```sql
CREATE TEMP TABLE active_users AS
SELECT user_id FROM users WHERE last_login > NOW() - INTERVAL '30 days';

SELECT orders.order_id
FROM orders
JOIN active_users ON orders.user_id = active_users.user_id
WHERE orders.status = 'completed';
```

---

## 查詢優化的最佳實踐

1. **合理設計索引**：為常用查詢的條件列建立索引，避免不必要的全表掃描。
2. **分析查詢計劃**：使用 `EXPLAIN` 分析查詢，找出可能的性能瓶頸。
3. **避免 `SELECT *`**：只選取所需欄位，減少不必要的數據傳輸。
4. **使用 WHERE 條件過濾數據**：在查詢中合理使用 WHERE 條件，過濾不必要的數據。
5. **使用 LIMIT 限制行數**：當查詢結果不需全部數據時，使用 LIMIT 優化查詢。
6. **善用聚合與索引條件下推**：對聚合操作和索引條件優化，提高查詢效率。
7. **簡化 JOIN 和使用臨時表**：對於複雜查詢，簡化 JOIN 結構或分步查詢，降低計算成本。

---

## 本日總結
今天我們深入學習了 PostgreSQL 的查詢優化技術，涵蓋索引的使用、查詢計劃的分析、過濾條件的優化及查詢結構的改進。通過這些優化技巧，查詢的執行效率可以顯著提升。明天我們將繼續探討性能監控技術，以進一步優化 PostgreSQL 的運行效能。
