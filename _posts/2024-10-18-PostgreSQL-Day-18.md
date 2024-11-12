---
title: PostgreSQL - 第 18 天 - 字符串處理
date: 2024-10-18 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "字符串處理是數據庫操作中的常見需求，無論是查詢、格式化還是數據清理。PostgreSQL 提供了豐富的字符串函數，如 `LENGTH`、`SUBSTRING`、`UPPER`、`LOWER` 等，幫助我們靈活地操作和處理文字數據。"
---

## 課程簡介
字符串處理是數據庫操作中的常見需求，無論是查詢、格式化還是數據清理。PostgreSQL 提供了豐富的字符串函數，如 `LENGTH`、`SUBSTRING`、`UPPER`、`LOWER` 等，幫助我們靈活地操作和處理文字數據。

---

## 基本字符串函數

### 1. `LENGTH` - 獲取字符串長度
`LENGTH` 函數返回字符串的字元數，適用於計算字段內容的長度。

```sql
SELECT LENGTH('Hello World') AS 字符串長度;
```

### 2. `UPPER` 與 `LOWER` - 大小寫轉換
- `UPPER`：將字符串轉換為大寫。
- `LOWER`：將字符串轉換為小寫。

```sql
SELECT UPPER('hello') AS 大寫, LOWER('WORLD') AS 小寫;
```

### 3. `SUBSTRING` - 提取子字符串
`SUBSTRING` 函數從字符串中提取指定位置和長度的子串。

```sql
SELECT SUBSTRING('PostgreSQL Database' FROM 1 FOR 10) AS 子字符串;
```

此查詢從第 1 個字元開始，提取 10 個字元的子串。

---

## 字符串拼接

### 1. 使用 `||` 運算符
在 PostgreSQL 中，使用 `||` 運算符可以將兩個或多個字符串拼接起來。

```sql
SELECT 'Hello ' || 'World' AS 拼接結果;
```

### 2. 使用 `CONCAT` 函數
`CONCAT` 函數可以拼接多個字符串，並且會自動忽略 `NULL` 值。

```sql
SELECT CONCAT('Postgre', 'SQL ', 'Database') AS 拼接結果;
```

---

## 字符串替換

### `REPLACE` - 替換字符串
`REPLACE` 函數可以將字符串中的某部分內容替換為另一字符串。

```sql
SELECT REPLACE('Hello World', 'World', 'PostgreSQL') AS 替換結果;
```

此範例中，`World` 被替換為 `PostgreSQL`，最終結果為 `Hello PostgreSQL`。

---

## 去除空白字符

### 1. `TRIM` - 去除兩端空白字符
`TRIM` 函數移除字符串兩端的空白字符，也可以去除指定字符。

```sql
SELECT TRIM('   PostgreSQL   ') AS 去除空白;
```

### 2. `LTRIM` 與 `RTRIM`
- `LTRIM`：去除左側的空白字符。
- `RTRIM`：去除右側的空白字符。

```sql
SELECT LTRIM('   Hello') AS 去除左側空白, RTRIM('World   ') AS 去除右側空白;
```

---

## 正規表達式查詢與替換

### `REGEXP_MATCHES` - 正規表達式匹配
`REGEXP_MATCHES` 函數使用正則表達式查找符合模式的子字符串。

```sql
SELECT REGEXP_MATCHES('123-456-7890', '\d{3}-\d{3}-\d{4}') AS 匹配結果;
```

### `REGEXP_REPLACE` - 正規表達式替換
`REGEXP_REPLACE` 函數根據正則表達式將匹配的子字符串替換為指定字符串。

```sql
SELECT REGEXP_REPLACE('abc123xyz', '\d+', '456') AS 替換結果;
```

此範例將數字部分替換為 `456`，結果為 `abc456xyz`。

---

## 常見字符串操作範例

### 1. 從字符串中提取域名
```sql
SELECT SUBSTRING('user@example.com' FROM '@(.*)$') AS 域名;
```

此查詢將提取電子郵件中的域名 `example.com`。

### 2. 檢查字符串是否包含特定單詞
```sql
SELECT 'PostgreSQL Database' LIKE '%Database%' AS 是否包含;
```

此查詢檢查字符串中是否包含 `Database`，返回 `TRUE` 或 `FALSE`。

### 3. 計算字符串中某個字符的出現次數
```sql
SELECT LENGTH('banana') - LENGTH(REPLACE('banana', 'a', '')) AS 字符次數;
```

此查詢將計算字母 `a` 在 `banana` 中出現的次數。

---

## 本日總結
今天我們學習了 PostgreSQL 中的字符串處理函數，涵蓋了長度計算、大小寫轉換、拼接、替換、去空白字符和正規表達式處理等操作。掌握這些技巧將有助於有效地處理和操作字符串數據。明天我們將深入探討數值數據類型及其處理技巧。
