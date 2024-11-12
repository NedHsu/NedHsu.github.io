---
title: PostgreSQL - 第 21 天 - 存儲過程與函數 (Stored Procedures and Functions)
date: 2024-10-21 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "存儲過程和函數可以將一組操作封裝在一起，使其成為獨立的執行單位，這樣不僅能減少重複代碼，還能提高數據庫操作的效率和安全性。存儲過程和函數適合用於實現較複雜的業務邏輯、數據檢查以及自動化處理。"
---

## 課程簡介
存儲過程和函數可以將一組操作封裝在一起，使其成為獨立的執行單位，這樣不僅能減少重複代碼，還能提高數據庫操作的效率和安全性。存儲過程和函數適合用於實現較複雜的業務邏輯、數據檢查以及自動化處理。

---

## 存儲過程與函數的差異

- **存儲過程**：可以使用 `CALL` 語句執行，不一定有返回值；支援 `COMMIT` 和 `ROLLBACK` 等控制交易。
- **函數**：使用 `SELECT` 或作為表達式的一部分調用，通常會返回結果（標量、表、或特定類型）；無法在函數內進行交易控制。

---

## 創建存儲過程

### 基本語法

```sql
CREATE PROCEDURE procedure_name (參數名稱 資料類型, ...)
LANGUAGE plpgsql
AS $$
BEGIN
    -- 過程內容
END;
$$;
```

### 範例：創建一個存儲過程

以下是創建一個簡單的存儲過程，根據給定的部門名稱更新所有員工的薪水。

```sql
CREATE PROCEDURE update_salary(dept_name TEXT, increase NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE employees
    SET salary = salary + increase
    WHERE department = dept_name;
END;
$$;
```

### 執行存儲過程

```sql
CALL update_salary('Sales', 500);
```

此操作將對 `Sales` 部門的所有員工加薪 500。

---

## 創建函數

### 基本語法

```sql
CREATE FUNCTION function_name (參數名稱 資料類型, ...) 
RETURNS 返回類型
LANGUAGE plpgsql
AS $$
BEGIN
    -- 函數內容
    RETURN 結果;
END;
$$;
```

### 範例：創建一個函數

以下函數根據員工 ID 返回該員工的全名。

```sql
CREATE FUNCTION get_full_name(emp_id INT) 
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    full_name TEXT;
BEGIN
    SELECT first_name || ' ' || last_name INTO full_name
    FROM employees
    WHERE employee_id = emp_id;
    
    RETURN full_name;
END;
$$;
```

### 調用函數

可以使用 `SELECT` 語句調用此函數。

```sql
SELECT get_full_name(101) AS full_name;
```

此查詢將返回 ID 為 101 的員工全名。

---

## 帶有參數的存儲過程與函數

存儲過程和函數均可接收參數以進行自定義處理。參數可以是輸入參數 (`IN`)、輸出參數 (`OUT`)，或同時兼具輸入輸出 (`INOUT`)。

### 範例：帶有輸出參數的函數

創建一個函數，返回指定部門的員工總數。

```sql
CREATE FUNCTION get_employee_count(dept_name TEXT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    emp_count INT;
BEGIN
    SELECT COUNT(*) INTO emp_count
    FROM employees
    WHERE department = dept_name;
    
    RETURN emp_count;
END;
$$;
```

調用：

```sql
SELECT get_employee_count('Sales') AS employee_count;
```

---

## 錯誤處理與異常處理

在存儲過程或函數中，可以使用 `EXCEPTION` 子句來捕捉和處理錯誤。例如，若插入資料時遇到主鍵重複錯誤，可選擇自定義處理邏輯。

```sql
CREATE FUNCTION insert_employee(emp_name TEXT, dept_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO employees (name, department)
    VALUES (emp_name, dept_name);
EXCEPTION 
    WHEN unique_violation THEN
        RAISE NOTICE '員工名稱 % 已存在，無法重複插入', emp_name;
END;
$$;
```

---

## 動態 SQL 的使用

在某些情況下，可以用動態 SQL 來處理變數或動態表名。動態 SQL 使用 `EXECUTE` 執行。

```sql
CREATE FUNCTION delete_records(table_name TEXT, condition TEXT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    EXECUTE 'DELETE FROM ' || table_name || ' WHERE ' || condition;
END;
$$;
```

呼叫範例：

```sql
SELECT delete_records('employees', 'department = ''Sales''');
```

此範例將刪除 `employees` 表中所有屬於 `Sales` 部門的記錄。

---

## 使用存儲過程和函數的建議

1. **邏輯封裝**：將常用邏輯封裝到存儲過程或函數中，方便重複使用。
2. **錯誤處理**：在過程或函數中加入錯誤處理機制，以便更好的處理異常情況。
3. **提升效率**：使用函數進行複雜查詢時，可提升查詢效率，減少應用程式與資料庫之間的數據傳輸。

---

## 本日總結
今天我們學習了 PostgreSQL 中的存儲過程與函數，了解了其基本語法、參數使用、錯誤處理和動態 SQL 的應用。存儲過程與函數能夠讓我們的數據庫操作更加模組化和高效。明天，我們將繼續探討 PostgreSQL 中的觸發器（Triggers）及其應用。
