---
title: PostgreSQL - 第 4 天 - 插入數據
date: 2024-10-04 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "插入數據的操作是資料庫管理中最基本且常用的操作之一，因為它允許我們將實際數據填入資料表。我們會介紹使用 `INSERT INTO` 語句插入單筆或多筆數據的不同方法。"
---

## 課程簡介
插入數據的操作是資料庫管理中最基本且常用的操作之一，因為它允許我們將實際數據填入資料表。我們會介紹使用 `INSERT INTO` 語句插入單筆或多筆數據的不同方法。

---

## 使用 INSERT INTO 插入單筆數據

`INSERT INTO` 語句可用於插入單筆數據。基本語法如下：

```sql
INSERT INTO 表名 (欄位1, 欄位2, ...) VALUES (值1, 值2, ...);
```

### 範例
假設我們有一個名為 `員工` 的資料表，其結構如下：

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    職位 VARCHAR(50),
    入職日期 DATE DEFAULT CURRENT_DATE,
    月薪 NUMERIC(10, 2)
);
```

可以使用以下語句插入一筆員工數據：

```sql
INSERT INTO 員工 (姓名, 職位, 月薪) VALUES ('王小明', '工程師', 60000.00);
```

此語句將姓名為「王小明」、職位為「工程師」、月薪為 60000 的員工數據插入到 `員工` 表中。由於 `員工ID` 是自動遞增欄位且已設置預設值，無需手動插入。

---

## 插入多筆數據

在同一語句中插入多筆數據，可以節省時間並提高效率。語法與單筆插入相似，但 `VALUES` 中包含多組值。

### 範例
```sql
INSERT INTO 員工 (姓名, 職位, 月薪) VALUES 
    ('李美麗', '設計師', 55000.00),
    ('張偉', '產品經理', 70000.00),
    ('陳大衛', '數據分析師', 65000.00);
```

這將一次性插入三名員工的數據。

---

## 使用預設值插入數據

如果某些欄位已設定了預設值（例如 `入職日期`），可以在插入時省略這些欄位，系統會自動使用預設值。

### 範例
```sql
INSERT INTO 員工 (姓名, 職位) VALUES ('林志豪', '行銷專員');
```

在這個例子中，`入職日期` 將自動設為當前日期，而 `月薪` 欄位將會存為 `NULL`（若不允許 `NULL` 則會報錯）。

---

## 檢視插入結果

插入數據後，可以使用 `SELECT` 語句檢視資料表中的內容，確認數據已正確插入。

### 範例
```sql
SELECT * FROM 員工;
```

這個語句會列出 `員工` 資料表中的所有記錄。

---

## 本日總結
今天我們學習了在 PostgreSQL 中如何使用 `INSERT INTO` 語句插入數據，包括插入單筆和多筆數據，並使用預設值插入資料表。明天我們將進一步學習數據的查詢操作，瞭解如何使用 `SELECT` 語句來檢索數據。