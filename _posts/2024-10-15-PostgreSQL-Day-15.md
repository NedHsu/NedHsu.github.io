---
title: PostgreSQL - 第 15 天 - 基本約束條件
date: 2024-10-15 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "約束條件（Constraints）是一組規則，用來限制表中的數據，以確保數據的完整性和正確性。通過設置約束條件，我們可以控制數據的有效性，避免無效或錯誤數據的插入。"
---

## 課程簡介
約束條件（Constraints）是一組規則，用來限制表中的數據，以確保數據的完整性和正確性。通過設置約束條件，我們可以控制數據的有效性，避免無效或錯誤數據的插入。

---

## 什麼是約束條件？

約束條件是一種應用於表的規則，可以防止無效數據進入數據庫。常見的約束條件包括：
- **PRIMARY KEY**：唯一標識表中的每一行數據。
- **FOREIGN KEY**：確保數據與另一張表中的數據關聯。
- **UNIQUE**：確保某一列或多列的數據在表中唯一。
- **NOT NULL**：確保列中的數據不為空。
- **CHECK**：定義特定條件，數據必須滿足該條件。
- **DEFAULT**：為列指定默認值。

---

## PRIMARY KEY 主鍵約束

`PRIMARY KEY` 是用來唯一標識表中每一行的列。每個表只能有一個主鍵，且該主鍵的值不能為空。當設置 `PRIMARY KEY` 時，會自動生成唯一索引以提高查詢速度。

### 語法

```sql
CREATE TABLE 表名 (
    列名 數據類型 PRIMARY KEY,
    其他列 ...
);
```

### 範例

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    職位 VARCHAR(50)
);
```

在此範例中，`員工ID` 是主鍵，每位員工都有唯一的 `員工ID`。

---

## FOREIGN KEY 外鍵約束

`FOREIGN KEY` 用來確保表中的某列值必須存在於另一張表的主鍵或唯一鍵中，用於建立表之間的關聯。

### 語法

```sql
CREATE TABLE 表名 (
    列名 數據類型,
    外鍵列名 數據類型,
    FOREIGN KEY (外鍵列名) REFERENCES 另一表名(主鍵列名)
);
```

### 範例

```sql
CREATE TABLE 部門 (
    部門ID SERIAL PRIMARY KEY,
    部門名稱 VARCHAR(50)
);

CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    部門ID INT,
    FOREIGN KEY (部門ID) REFERENCES 部門(部門ID)
);
```

在這個範例中，`員工` 表中的 `部門ID` 是外鍵，參照了 `部門` 表中的 `部門ID`，確保每位員工的部門 ID 必須存在於 `部門` 表中。

---

## UNIQUE 唯一約束

`UNIQUE` 約束保證列中的值在整個表中唯一。`UNIQUE` 約束可以應用於單列或多列組合。

### 語法

```sql
CREATE TABLE 表名 (
    列名 數據類型 UNIQUE,
    其他列 ...
);
```

### 範例

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    電子郵件 VARCHAR(100) UNIQUE,
    姓名 VARCHAR(50)
);
```

此範例中，`電子郵件` 列具有唯一約束，確保每位員工的電子郵件在表中唯一。

---

## NOT NULL 非空約束

`NOT NULL` 約束保證列中的值不能為空，強制要求每一行必須包含該列的值。

### 語法

```sql
CREATE TABLE 表名 (
    列名 數據類型 NOT NULL,
    其他列 ...
);
```

### 範例

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    職位 VARCHAR(50)
);
```

此範例中，`姓名` 列具有 `NOT NULL` 約束，確保所有員工都有姓名值。

---

## CHECK 檢查約束

`CHECK` 約束用於定義特定的條件，並要求插入或更新的數據必須滿足該條件。

### 語法

```sql
CREATE TABLE 表名 (
    列名 數據類型 CHECK (條件),
    其他列 ...
);
```

### 範例

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    年齡 INT CHECK (年齡 >= 18),
    工資 NUMERIC CHECK (工資 > 0)
);
```

在這個範例中，`年齡` 列必須大於或等於 18，`工資` 列必須大於 0。

---

## DEFAULT 預設值約束

`DEFAULT` 約束用於指定列的默認值，當插入數據時，如果未提供該列的值，則使用默認值。

### 語法

```sql
CREATE TABLE 表名 (
    列名 數據類型 DEFAULT 預設值,
    其他列 ...
);
```

### 範例

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    入職日期 DATE DEFAULT CURRENT_DATE
);
```

此範例中，`入職日期` 列具有預設值 `CURRENT_DATE`，表示如果未指定入職日期，將自動填入當天的日期。

---

## 綜合範例：創建帶有多種約束的表

```sql
CREATE TABLE 員工 (
    員工ID SERIAL PRIMARY KEY,
    姓名 VARCHAR(50) NOT NULL,
    電子郵件 VARCHAR(100) UNIQUE,
    年齡 INT CHECK (年齡 >= 18),
    工資 NUMERIC CHECK (工資 > 0),
    部門ID INT,
    入職日期 DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (部門ID) REFERENCES 部門(部門ID)
);
```

此範例展示了如何在一張表中綜合使用多種約束條件，以確保數據的完整性和有效性。

---

## 本日總結
今天我們學習了 PostgreSQL 中的基本約束條件，包括 `PRIMARY KEY`、`FOREIGN KEY`、`UNIQUE`、`NOT NULL`、`CHECK` 和 `DEFAULT` 等約束。這些約束能幫助我們維持數據的正確性和一致性，避免無效數據的插入。明天我們將學習如何使用索引來提高查詢效率。
