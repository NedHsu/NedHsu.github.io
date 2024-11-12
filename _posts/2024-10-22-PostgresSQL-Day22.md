---
title: PostgreSQL - 第 22 天 - 觸發器 (Triggers)
date: 2024-10-22 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "觸發器是一種自動執行的數據庫機制，當特定事件 (如插入、更新或刪除操作) 發生時，會自動執行指定的操作。觸發器可用於維護數據完整性、紀錄變更歷史、以及執行自動化數據處理流程。"
---

## 課程簡介
觸發器是一種自動執行的數據庫機制，當特定事件 (如插入、更新或刪除操作) 發生時，會自動執行指定的操作。觸發器可用於維護數據完整性、紀錄變更歷史、以及執行自動化數據處理流程。

---

## 觸發器的組成

觸發器主要由兩部分組成：
1. **觸發條件**：指定在何時觸發，包括執行的動作 (INSERT、UPDATE、DELETE)、觸發的時間點 (BEFORE 或 AFTER)。
2. **觸發動作**：一個函數，用於定義觸發器的具體操作。觸發器函數通常使用 `PL/pgSQL` 撰寫。

---

## 創建觸發器函數

在 PostgreSQL 中，觸發器函數不需要返回具體數據，而是使用 `RETURN NULL` 或 `RETURN NEW`。

### 範例：創建觸發器函數

假設我們希望在每次新增員工時，自動將員工的名字轉為大寫。我們先創建一個觸發器函數。

```sql
CREATE OR REPLACE FUNCTION uppercase_employee_name()
RETURNS TRIGGER AS $$
BEGIN
    NEW.name := UPPER(NEW.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

這個函數會在插入操作時將 `name` 欄位轉為大寫。

---

## 創建觸發器

在定義了觸發器函數後，可以將其綁定到表上，並指定觸發條件。

### 基本語法

```sql
CREATE TRIGGER trigger_name
BEFORE INSERT ON table_name
FOR EACH ROW
EXECUTE FUNCTION function_name();
```

### 範例：綁定觸發器到表

接著，我們將剛才的 `uppercase_employee_name` 函數應用到 `employees` 表，確保每次新增員工時名字自動大寫。

```sql
CREATE TRIGGER before_insert_uppercase_name
BEFORE INSERT ON employees
FOR EACH ROW
EXECUTE FUNCTION uppercase_employee_name();
```

---

## 觸發器應用範例

### 1. 自動生成時間戳

假設我們有一個 `orders` 表，需要在每次新增訂單時自動填入訂單創建時間。

```sql
CREATE OR REPLACE FUNCTION set_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_order_timestamp();
```

### 2. 更新紀錄表

當某表中的數據被更新時，可以使用觸發器來記錄變更歷史。例如，每次更新 `employees` 表時，將舊的數據保存到 `employees_history` 表。

```sql
CREATE OR REPLACE FUNCTION log_employee_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO employees_history(employee_id, old_salary, change_date)
    VALUES (OLD.employee_id, OLD.salary, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_employee_update
AFTER UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION log_employee_changes();
```

這樣，更新 `employees` 表時，舊的薪資將自動保存到 `employees_history` 表中。

---

## BEFORE 與 AFTER 觸發器的選擇

- **BEFORE 觸發器**：在資料行為執行之前觸發。適合用於驗證數據或修改輸入數據。
- **AFTER 觸發器**：在資料行為執行之後觸發。適合用於日誌紀錄、通知或其他後置操作。

---

## 觸發器的應用場景

1. **數據驗證**：在數據插入或更新前檢查條件，確保數據的完整性。
2. **自動日誌**：在數據更新或刪除時自動保存歷史記錄。
3. **數據自動填充**：自動生成時間戳、自增欄位等。
4. **複雜數據處理**：根據業務需求執行自動化的數據處理流程。

---

## 刪除觸發器

使用 `DROP TRIGGER` 語句可以刪除觸發器。

```sql
DROP TRIGGER trigger_name ON table_name;
```

例如，刪除剛才創建的 `before_insert_uppercase_name` 觸發器：

```sql
DROP TRIGGER before_insert_uppercase_name ON employees;
```

---

## 注意事項與建議

1. **避免過多觸發器**：過多的觸發器可能會增加系統負擔，影響性能。
2. **謹慎使用 AFTER 觸發器**：由於 AFTER 觸發器會在操作完成後執行，若處理不當可能會產生數據不一致的情況。
3. **測試觸發器邏輯**：務必測試觸發器，確保其按預期執行，避免引入潛在錯誤。

---

## 本日總結
今天我們學習了 PostgreSQL 中的觸發器及其應用場景，並了解了如何創建、管理和刪除觸發器。觸發器能夠在數據庫操作的特定時機自動執行邏輯，增強數據處理的自動化。明天我們將探討視圖管理與物化視圖 (Materialized Views)，以進一步優化查詢效率。
