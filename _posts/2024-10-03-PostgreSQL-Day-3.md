---
title: PostgreSQL - 第 3 天 - 基本資料表操作
date: 2024-10-03 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "今天我們將學習如何在 PostgreSQL 中進行基本的資料表操作，包括創建、修改、刪除資料表等。資料表是數據庫的核心結構，用於儲存和管理數據。掌握資料表的基本操作對於後續資料庫操作非常重要。"
---

## 課程簡介
今天我們將學習如何在 PostgreSQL 中進行基本的資料表操作，包括創建、修改、刪除資料表等。資料表是數據庫的核心結構，用於儲存和管理數據。掌握資料表的基本操作對於後續資料庫操作非常重要。

---

## 建立資料表

要建立一個資料表，可以使用 `CREATE TABLE` 語句來定義資料表的結構、欄位名稱和數據類型。以下是一個基本的範例：

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    職位 VARCHAR(50),
    入職日期 DATE DEFAULT CURRENT_DATE,
    月薪 NUMERIC(10, 2)
);
```

在此範例中：
- `員工ID` 是一個自動遞增的主鍵。
- `姓名` 欄位設定為非空 (`NOT NULL`)。
- `入職日期` 設定預設值為當前日期。
- `月薪` 使用 `NUMERIC(10, 2)`，適合存儲貨幣數據。

---

## 修改資料表

當資料表結構需要變更時，可以使用 `ALTER TABLE` 語句進行修改。以下是一些常用的修改操作：

1. **新增欄位**：
   ```sql
   ALTER TABLE 員工 ADD COLUMN 電子郵件 VARCHAR(255);
   ```

2. **刪除欄位**：
   ```sql
   ALTER TABLE 員工 DROP COLUMN 電子郵件;
   ```

3. **修改欄位類型**：
   ```sql
   ALTER TABLE 員工 ALTER COLUMN 月薪 TYPE INTEGER;
   ```

4. **重新命名欄位**：
   ```sql
   ALTER TABLE 員工 RENAME COLUMN 職位 TO 職稱;
   ```

5. **重新命名資料表**：
   ```sql
   ALTER TABLE 員工 RENAME TO 公司員工;
   ```

---

## 刪除資料表

若不再需要某個資料表，可以使用 `DROP TABLE` 語句將其刪除。

```sql
DROP TABLE 公司員工;
```

**注意**：刪除資料表是不可逆的操作，刪除後表中的所有數據將永久丟失，因此請謹慎使用。

---

## 檢視資料表結構

在操作資料表時，有時需要查看表的結構。可以使用 `\d` 指令來查看特定資料表的欄位和屬性。

```sql
\d 員工
```

這個指令會顯示欄位名稱、數據類型、約束等詳細信息。

---

## 本日總結
今天我們學習了 PostgreSQL 中資料表的基本操作，包括如何創建、修改、刪除資料表，以及查看資料表結構。掌握這些基本操作將有助於我們更靈活地管理數據表結構。明天我們將學習如何在資料表中插入數據並進行簡單查詢。
