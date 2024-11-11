---
title: PostgreSQL - 第 24 天 - 高階 JOIN 操作
date: 2024-10-24 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "今天我們將進一步探索 PostgreSQL 中的高階 JOIN 操作，包括 CROSS JOIN、SELF JOIN、以及結合使用多種 JOIN 來進行複雜查詢。高階 JOIN 能幫助我們處理更複雜的數據關聯，實現多表之間的深入分析。"
---

## 課程簡介
今天我們將進一步探索 PostgreSQL 中的高階 JOIN 操作，包括 CROSS JOIN、SELF JOIN、以及結合使用多種 JOIN 來進行複雜查詢。高階 JOIN 能幫助我們處理更複雜的數據關聯，實現多表之間的深入分析。

---

## 高階 JOIN 類型介紹

### 1. CROSS JOIN

CROSS JOIN 是一種笛卡兒積操作，會將兩個表中的每一行進行組合。當需要生成所有可能的組合（如篩選搭配選項）時，CROSS JOIN 非常有用。

#### 語法

```sql
SELECT 欄位
FROM 表1
CROSS JOIN 表2;
```

#### 範例

假設我們有兩個表，`colors` 和 `sizes`，分別包含顏色和尺寸：

```sql
CREATE TABLE colors (color_name TEXT);
CREATE TABLE sizes (size_name TEXT);

INSERT INTO colors VALUES ('Red'), ('Green'), ('Blue');
INSERT INTO sizes VALUES ('Small'), ('Medium'), ('Large');
```

CROSS JOIN 所有顏色與尺寸的組合：

```sql
SELECT color_name, size_name
FROM colors
CROSS JOIN sizes;
```

結果：

| color_name | size_name |
|------------|-----------|
| Red        | Small     |
| Red        | Medium    |
| Red        | Large     |
| Green      | Small     |
| Green      | Medium    |
| ...        | ...       |

---

### 2. SELF JOIN

SELF JOIN 是將表自己與自己進行 JOIN，適用於需要比對同一表中不同列或不同記錄的情境。SELF JOIN 通常會使用別名來區分同一表的兩個實例。

#### 語法

```sql
SELECT A.欄位, B.欄位
FROM 表 A
JOIN 表 B ON A.條件 = B.條件;
```

#### 範例

假設我們有一個員工表 `employees`，包括 `employee_id` 和 `manager_id`，想查詢每個員工及其上司的名字。

```sql
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    name TEXT,
    manager_id INT
);

INSERT INTO employees (name, manager_id) VALUES
('Alice', NULL),
('Bob', 1),
('Charlie', 1),
('David', 2);

SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.employee_id;
```

結果：

| employee | manager |
|----------|---------|
| Alice    | NULL    |
| Bob      | Alice   |
| Charlie  | Alice   |
| David    | Bob     |

---

## 結合多種 JOIN

在查詢中可以結合多種 JOIN 來實現更複雜的數據關聯，特別適用於多表的分析或數據聚合。

### 範例：多表 JOIN 查詢

假設我們有三個表：`orders`、`customers` 和 `products`，它們之間的關係如下：
- `orders` 包含 `customer_id` 和 `product_id`。
- `customers` 包含 `customer_id` 和 `customer_name`。
- `products` 包含 `product_id` 和 `product_name`。

我們希望查詢每位客戶的訂單及訂購的產品名稱。

```sql
SELECT c.customer_name, o.order_id, p.product_name
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN products p ON o.product_id = p.product_id;
```

這樣的查詢能將客戶、訂單和產品資訊結合起來，結果如下：

| customer_name | order_id | product_name |
|---------------|----------|--------------|
| Alice         | 1        | Laptop       |
| Bob           | 2        | Phone        |
| Alice         | 3        | Tablet       |
| ...           | ...      | ...          |

---

## OUTER JOIN 的進階用法

在使用 LEFT JOIN、RIGHT JOIN 或 FULL JOIN 時，可以結合 `WHERE` 條件進行進一步篩選，以更靈活地提取數據。

### LEFT JOIN 範例

假設我們希望找出所有訂單中沒有對應客戶的記錄，便於查找孤立數據或進行數據清理。

```sql
SELECT o.order_id, o.product_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
```

這樣可以獲取沒有關聯客戶的訂單 ID 和產品 ID，便於後續數據分析。

---

## 使用多重 JOIN 進行數據分析

### 例：銷售報告生成

假設我們有一個銷售系統，包含以下表：
- `sales`：紀錄每筆銷售的 `sale_id`、`product_id` 和 `amount`。
- `products`：包含每個產品的 `product_id` 和 `category`。
- `categories`：包含每個產品類別的 `category_id` 和 `category_name`。

我們希望生成每個產品類別的總銷售金額。

```sql
SELECT cat.category_name, SUM(s.amount) AS total_sales
FROM sales s
JOIN products p ON s.product_id = p.product_id
JOIN categories cat ON p.category = cat.category_id
GROUP BY cat.category_name;
```

結果：

| category_name | total_sales |
|---------------|-------------|
| Electronics   | 5000        |
| Clothing      | 3000        |
| Books         | 1500        |
| ...           | ...         |

---

## 本日總結
今天我們學習了 PostgreSQL 中的高階 JOIN 操作，包括 CROSS JOIN、SELF JOIN 及結合多種 JOIN 進行複雜查詢。透過這些進階 JOIN 技巧，可以輕鬆實現跨多表的關聯查詢與數據分析。明天，我們將繼續深入探討數據庫優化技術，以提升查詢效率。
