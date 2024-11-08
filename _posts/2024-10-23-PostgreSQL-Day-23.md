---
title: PostgreSQL - 第 23 天 - 視圖管理與物化視圖
date: 2024-10-23 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "視圖(View)和物化視圖(Materialized View)都是將查詢結果儲存在數據庫中的方法，讓我們能夠更方便地處理複雜查詢。視圖能夠節省查詢代碼，提高代碼可讀性，而物化視圖則能加快查詢速度，特別適合大型數據量的操作。"
---

## 課程簡介
視圖和物化視圖都是將查詢結果儲存在數據庫中的方法，讓我們能夠更方便地處理複雜查詢。視圖能夠節省查詢代碼，提高代碼可讀性，而物化視圖則能加快查詢速度，特別適合大型數據量的操作。

---

## 視圖 (View)

### 1. 視圖的作用
視圖是基於查詢語句創建的虛擬表，並不真正儲存數據。使用視圖可以簡化查詢操作、提高代碼重用性，並在一定程度上加強數據安全性，因為我們可以根據需要限制視圖返回的欄位和數據。

### 2. 創建視圖

#### 基本語法

```sql
CREATE VIEW view_name AS
SELECT 欄位
FROM 表
WHERE 條件;
```

#### 範例

假設有一個 `orders` 資料表，我們可以創建一個視圖來顯示 VIP 客戶的訂單。

```sql
CREATE VIEW vip_orders AS
SELECT order_id, customer_id, total_amount
FROM orders
WHERE vip_status = 'Y';
```

使用此視圖可以方便查詢所有 VIP 客戶的訂單：

```sql
SELECT * FROM vip_orders;
```

---

## 管理視圖

### 更新視圖

在修改視圖的查詢條件或結構時，可以使用 `CREATE OR REPLACE VIEW` 語句。

```sql
CREATE OR REPLACE VIEW vip_orders AS
SELECT order_id, customer_id, total_amount, order_date
FROM orders
WHERE vip_status = 'Y';
```

### 刪除視圖

使用 `DROP VIEW` 語句可以刪除視圖。

```sql
DROP VIEW vip_orders;
```

### 使用限制

視圖的查詢結果並不會儲存實體數據，因此對於大數據量的操作，複雜的視圖查詢可能會對性能產生影響。對於頻繁使用的複雜查詢，建議使用物化視圖。

---

## 物化視圖 (Materialized View)

### 1. 物化視圖的作用
物化視圖是將查詢結果實體化儲存的表，適用於需要頻繁查詢且查詢代價較高的情況。物化視圖能顯著提高查詢速度，但需要手動刷新以確保數據的最新性。

### 2. 創建物化視圖

#### 基本語法

```sql
CREATE MATERIALIZED VIEW materialized_view_name AS
SELECT 欄位
FROM 表
WHERE 條件;
```

#### 範例

假設我們有一個銷售數據表 `sales`，可以創建一個物化視圖來儲存每月銷售額的總計。

```sql
CREATE MATERIALIZED VIEW monthly_sales_summary AS
SELECT EXTRACT(MONTH FROM sale_date) AS month,
       EXTRACT(YEAR FROM sale_date) AS year,
       SUM(sale_amount) AS total_sales
FROM sales
GROUP BY year, month;
```

這樣就可以直接從物化視圖中查詢每月的銷售總額，而不用每次都重新執行複雜的聚合查詢：

```sql
SELECT * FROM monthly_sales_summary;
```

---

## 刷新物化視圖

### 1. 手動刷新

物化視圖中的數據不會自動更新，需要使用 `REFRESH MATERIALIZED VIEW` 命令來手動刷新。

```sql
REFRESH MATERIALIZED VIEW monthly_sales_summary;
```

### 2. 自動更新 (適用於定期更新需求)

如果需要定期更新物化視圖，可以考慮使用 PostgreSQL 的定時任務工具 (如 `cron` 或 `pg_cron`) 來自動刷新視圖。

---

## 比較：視圖與物化視圖

| 特性            | 視圖 (View)                      | 物化視圖 (Materialized View)              |
|-----------------|---------------------------------|-------------------------------------------|
| 數據儲存方式     | 不儲存實體數據                    | 儲存實體數據                              |
| 更新頻率        | 查詢時實時更新                    | 需手動或自動刷新                          |
| 查詢性能        | 依賴查詢結構，查詢慢時可能影響性能 | 儲存結果，查詢速度較快                    |
| 適用場景        | 輕量級查詢、簡化查詢語句          | 大數據量頻繁查詢，需加快查詢速度的場景     |
| 適合的數據量    | 小至中型數據量                   | 中至大型數據量                            |

---

## 使用範例：視圖和物化視圖的搭配

### 情境：電商平台報表生成

1. **建立銷售訂單視圖**：假設有 `orders` 和 `customers` 表，先建立一個簡化的銷售訂單視圖。

    ```sql
    CREATE VIEW order_summary AS
    SELECT o.order_id, o.order_date, o.total_amount, c.customer_name
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id;
    ```

2. **建立每月銷售物化視圖**：根據 `order_summary` 視圖，再建立物化視圖以獲取每月銷售額，便於生成月度報表。

    ```sql
    CREATE MATERIALIZED VIEW monthly_sales_report AS
    SELECT EXTRACT(MONTH FROM order_date) AS month,
           EXTRACT(YEAR FROM order_date) AS year,
           SUM(total_amount) AS monthly_sales
    FROM order_summary
    GROUP BY year, month;
    ```

3. **刷新物化視圖**：定期更新以確保數據的準確性。

    ```sql
    REFRESH MATERIALIZED VIEW monthly_sales_report;
    ```

此方法可以分階段處理數據，使查詢和報表生成效率更高。

---

## 本日總結
今天我們學習了視圖與物化視圖的基本操作與應用場景。視圖有助於簡化查詢，物化視圖則適合提升查詢效率。在實際業務中，合理使用這兩種工具可以大幅提高數據庫操作的靈活性和性能。明天，我們將學習 PostgreSQL 中的索引管理技巧，以進一步提升查詢性能。
