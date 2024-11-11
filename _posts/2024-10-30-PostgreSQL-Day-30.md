---
title: PostgreSQL - 第 30 天 - 設計完整的資料庫
date: 2024-10-30 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "今天是 PostgreSQL 系列教學的最後一天，我們將綜合之前的知識，設計並實現一個完整的資料庫專案。這個專案將包括資料表設計、約束條件、關聯、視圖、索引、以及高可用性設計等多方面的內容，幫助你將理論應用於實際場景。"
---

## 課程簡介
今天是 PostgreSQL 系列教學的最後一天，我們將綜合之前的知識，設計並實現一個完整的資料庫專案。這個專案將包括資料表設計、約束條件、關聯、視圖、索引、以及高可用性設計等多方面的內容，幫助你將理論應用於實際場景。

---

## 專案背景：線上書店管理系統

設計一個簡單的線上書店管理系統資料庫，以支持以下核心功能：

1. 管理書籍及其分類。
2. 處理客戶訂單。
3. 追蹤庫存與供應商資訊。
4. 支援基本的數據查詢和報表生成。

---

## 專案需求分析

### 主要資料表
1. **books**：存儲書籍基本資訊，包括書名、作者、分類、價格等。
2. **categories**：存儲書籍分類，支持分類查詢。
3. **customers**：記錄客戶資訊。
4. **orders**：記錄訂單資訊，包括訂單日期、客戶、總金額等。
5. **order_items**：記錄訂單明細，包括每本書的數量與價格。
6. **suppliers**：存儲供應商資訊。
7. **inventory**：追蹤庫存量。

---

## 資料表設計

### 1. 書籍資訊表 (books)

```sql
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category_id INT REFERENCES categories(category_id),
    price DECIMAL(10, 2) NOT NULL,
    publish_date DATE,
    stock_quantity INT DEFAULT 0
);
```

### 2. 分類表 (categories)

```sql
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);
```

### 3. 客戶資訊表 (customers)

```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT
);
```

### 4. 訂單表 (orders)

```sql
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL
);
```

### 5. 訂單明細表 (order_items)

```sql
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    book_id INT REFERENCES books(book_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);
```

### 6. 供應商表 (suppliers)

```sql
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255)
);
```

### 7. 庫存表 (inventory)

```sql
CREATE TABLE inventory (
    book_id INT REFERENCES books(book_id),
    supplier_id INT REFERENCES suppliers(supplier_id),
    quantity INT NOT NULL,
    PRIMARY KEY (book_id, supplier_id)
);
```

---

## 建立索引

為了提高查詢效率，特別是高頻查詢的欄位上建立索引。

```sql
CREATE INDEX idx_books_category ON books (category_id);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_order_items_order ON order_items (order_id);
```

---

## 視圖設計

### 1. 熱銷書籍視圖

顯示銷量最高的書籍，以便進行銷售分析。

```sql
CREATE VIEW popular_books AS
SELECT b.book_id, b.title, SUM(oi.quantity) AS total_sold
FROM books b
JOIN order_items oi ON b.book_id = oi.book_id
GROUP BY b.book_id, b.title
ORDER BY total_sold DESC;
```

### 2. 客戶訂單報表視圖

顯示每位客戶的訂單數量和總金額。

```sql
CREATE VIEW customer_order_summary AS
SELECT c.customer_id, c.full_name, COUNT(o.order_id) AS order_count, SUM(o.total_amount) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.full_name;
```

---

## 高可用性設計

為了確保數據庫的穩定性，應該配置**主從複製**和**自動故障轉移**。

### 1. 配置主從複製

將主數據庫的數據複製到備援節點，提升可靠性，確保在主節點失效時仍能提供服務。

### 2. 配置自動故障轉移

使用 Patroni 或 pg_auto_failover 工具來實現自動故障轉移，使主數據庫出現故障時從節點能迅速接手。

---

## 權限管理

為了數據庫安全性，我們需要限制不同角色的操作權限。

### 1. 創建角色

```sql
CREATE ROLE bookstore_admin WITH LOGIN PASSWORD 'admin_password';
CREATE ROLE bookstore_user WITH LOGIN PASSWORD 'user_password';
```

### 2. 賦予權限

- **管理員角色 (bookstore_admin)**：具有對所有表的完全控制權限。
- **普通用戶角色 (bookstore_user)**：僅具有查詢權限，無法插入、更新或刪除數據。

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bookstore_admin;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bookstore_user;
```

---

## 本日總結
今天的實戰專案讓我們綜合運用了 PostgreSQL 的各種功能，包括資料表設計、約束、索引、視圖、高可用性設計及權限管理。通過這個專案，你應該對 PostgreSQL 的核心功能及其在實際應用中的操作有了更深的理解。恭喜完成 PostgreSQL 30 天的學習之旅！
