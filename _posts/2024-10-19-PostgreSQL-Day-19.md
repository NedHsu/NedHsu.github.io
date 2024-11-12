---
title: PostgreSQL - 第 19 天 - 日期與時間處理
date: 2024-10-19 19:00:00 +0800
categories: [Software, PostgreSQL]
tags: [PostgreSQL] 
excerpt: "日期與時間是許多數據庫應用中不可或缺的部分，例如記錄交易時間、計算時間差等。PostgreSQL 支援多種日期與時間資料類型和強大的函數，幫助我們靈活地操作時間數據。"
---

## 課程簡介
日期與時間是許多數據庫應用中不可或缺的部分，例如記錄交易時間、計算時間差等。PostgreSQL 支援多種日期與時間資料類型和強大的函數，幫助我們靈活地操作時間數據。

---

## 日期與時間資料類型

### 1. `DATE`
儲存日期（年、月、日），不包含時間。

```sql
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_date DATE
);
```

### 2. `TIME`
儲存時間（小時、分鐘、秒），不包含日期。

```sql
CREATE TABLE work_hours (
    employee_id SERIAL PRIMARY KEY,
    start_time TIME,
    end_time TIME
);
```

### 3. `TIMESTAMP`
儲存日期和時間（年、月、日、時、分、秒），不包含時區。

```sql
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    transaction_time TIMESTAMP
);
```

### 4. `TIMESTAMPTZ`
儲存日期和時間（包含時區資訊），適用於跨時區應用。

```sql
CREATE TABLE global_events (
    event_id SERIAL PRIMARY KEY,
    event_time TIMESTAMPTZ
);
```

---

## 插入日期與時間資料

插入日期與時間資料時，可以使用字串格式，PostgreSQL 會自動解析並轉換。

```sql
INSERT INTO events (event_date) VALUES ('2024-11-08');
INSERT INTO work_hours (start_time, end_time) VALUES ('09:00', '17:00');
INSERT INTO transactions (transaction_time) VALUES ('2024-11-08 15:30:00');
INSERT INTO global_events (event_time) VALUES ('2024-11-08 15:30:00+00');
```

---

## 日期與時間函數

### 1. `NOW()` - 獲取當前日期與時間
`NOW()` 函數返回當前的日期與時間（含時區）。

```sql
SELECT NOW() AS 當前時間;
```

### 2. `CURRENT_DATE` 與 `CURRENT_TIME`
- `CURRENT_DATE`：返回當前日期，不包含時間。
- `CURRENT_TIME`：返回當前時間，不包含日期。

```sql
SELECT CURRENT_DATE AS 今天日期, CURRENT_TIME AS 現在時間;
```

---

## 日期與時間的算術運算

### 1. 日期加減
可以直接使用 `+` 或 `-` 進行日期加減運算。

```sql
SELECT '2024-11-08'::DATE + INTERVAL '10 days' AS 加10天;
SELECT '2024-11-08'::DATE - INTERVAL '5 days' AS 減5天;
```

### 2. 計算兩個日期間的差異
可以使用 `AGE` 函數計算兩個日期或時間間的差異。

```sql
SELECT AGE('2024-11-08', '2024-01-01') AS 日期差異;
```

---

## 提取日期與時間的部分內容

可以使用 `EXTRACT` 函數提取日期或時間的特定部分（如年、月、日、時、分、秒）。

```sql
SELECT EXTRACT(YEAR FROM '2024-11-08'::DATE) AS 年,
       EXTRACT(MONTH FROM '2024-11-08'::DATE) AS 月,
       EXTRACT(DAY FROM '2024-11-08'::DATE) AS 日;
```

---

## 日期格式化

### `TO_CHAR` - 格式化日期和時間
`TO_CHAR` 函數可以將日期或時間格式化為指定的字串格式。

```sql
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS') AS 格式化時間;
```

### 常見格式化代碼
- `YYYY`：四位數年份
- `MM`：月份（01-12）
- `DD`：日（01-31）
- `HH24`：24 小時制小時
- `MI`：分鐘
- `SS`：秒

---

## 常見日期與時間操作範例

### 1. 查詢某日期範圍內的記錄

```sql
SELECT * FROM transactions
WHERE transaction_time BETWEEN '2024-01-01' AND '2024-12-31';
```

### 2. 計算年齡

```sql
SELECT AGE('2024-11-08', '1990-05-20') AS 年齡;
```

此範例計算從 `1990-05-20` 到 `2024-11-08` 的年齡。

### 3. 每月資料統計

```sql
SELECT DATE_TRUNC('month', transaction_time) AS 月份, COUNT(*) AS 交易數量
FROM transactions
GROUP BY 月份
ORDER BY 月份;
```

此範例使用 `DATE_TRUNC` 函數按月匯總交易數量。

---

## 本日總結
今天我們學習了 PostgreSQL 中的日期與時間處理，涵蓋了日期與時間的資料類型、函數、算術運算、格式化等。這些技巧對於操作和分析時間數據非常實用。明天我們將探討 PostgreSQL 中的進階查詢優化技術。
