---
title: PostgreSQL - 第 20 天 - CASE 與條件邏輯
date: 2024-10-20 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "CASE` 表達式可以根據條件返回不同的結果，是資料查詢中常用的條件控制工具。透過 `CASE`，可以實現條件篩選、分類、轉換等操作，使查詢結果更靈活且符合業務需求。"
---

## 課程簡介
`CASE` 表達式可以根據條件返回不同的結果，是資料查詢中常用的條件控制工具。透過 `CASE`，可以實現條件篩選、分類、轉換等操作，使查詢結果更靈活且符合業務需求。

---

## 基本 `CASE` 語法

`CASE` 表達式通常在 `SELECT` 查詢中使用，根據條件返回不同的值，基本語法如下：

```sql
CASE 
    WHEN 條件1 THEN 結果1
    WHEN 條件2 THEN 結果2
    ...
    ELSE 預設結果
END
```

- `WHEN`：設定條件。
- `THEN`：在條件成立時，返回對應的結果。
- `ELSE`：所有條件都不成立時的預設結果。

---

## 使用範例

### 1. 根據條件分類資料

假設有一個 `students` 資料表，包含學生的成績，我們可以根據分數給予不同等級的評價。

```sql
SELECT student_name,
       score,
       CASE 
           WHEN score >= 90 THEN '優秀'
           WHEN score >= 75 THEN '良好'
           WHEN score >= 60 THEN '及格'
           ELSE '不及格'
       END AS 評價
FROM students;
```

此查詢根據 `score` 欄位的值，將每位學生的分數評為「優秀」、「良好」、「及格」或「不及格」。

---

### 2. 依據條件計算折扣

假設有一個 `orders` 資料表，包含每筆訂單的總額，我們可以根據訂單總額給予不同的折扣。

```sql
SELECT order_id,
       total_amount,
       CASE 
           WHEN total_amount >= 1000 THEN total_amount * 0.9  -- 10% 折扣
           WHEN total_amount >= 500 THEN total_amount * 0.95  -- 5% 折扣
           ELSE total_amount  -- 無折扣
       END AS 折扣後金額
FROM orders;
```

此查詢根據 `total_amount` 欄位的值，對於不同的訂單總額應用不同的折扣比例。

---

## 嵌套 `CASE` 語法

`CASE` 語法中可以嵌套 `CASE` 表達式，用於更複雜的條件判斷。例如，根據季節和地區區分優惠活動。

```sql
SELECT customer_id,
       region,
       season,
       CASE 
           WHEN season = '夏季' THEN
               CASE 
                   WHEN region = '北區' THEN '夏季北區優惠'
                   WHEN region = '南區' THEN '夏季南區優惠'
                   ELSE '夏季優惠'
               END
           WHEN season = '冬季' THEN
               CASE 
                   WHEN region = '北區' THEN '冬季北區優惠'
                   WHEN region = '南區' THEN '冬季南區優惠'
                   ELSE '冬季優惠'
               END
           ELSE '全年優惠'
       END AS 優惠活動
FROM promotions;
```

此查詢根據季節和地區，指定不同的優惠活動。

---

## `CASE` 與聚合函數結合

`CASE` 表達式可以與聚合函數結合，以便根據條件進行分組計算。例如，統計 `employees` 資料表中每個部門的男性和女性員工數量。

```sql
SELECT department,
       COUNT(CASE WHEN gender = 'M' THEN 1 END) AS 男性員工數,
       COUNT(CASE WHEN gender = 'F' THEN 1 END) AS 女性員工數
FROM employees
GROUP BY department;
```

此查詢通過 `CASE` 表達式來計算每個部門的男性和女性員工數量。

---

## `CASE` 與 `ORDER BY` 結合

在 `ORDER BY` 中使用 `CASE` 表達式，可以根據特定條件進行排序。例如，將 `orders` 資料表中的 VIP 客戶優先排序。

```sql
SELECT customer_id, order_date, vip_status
FROM orders
ORDER BY CASE 
             WHEN vip_status = 'Y' THEN 1
             ELSE 2
         END, order_date DESC;
```

此查詢首先按 VIP 客戶排序，然後依據訂單日期降序排列。

---

## 使用 `CASE` 進行條件篩選

`CASE` 表達式可以在 `WHERE` 中搭配進行條件篩選，達到更靈活的查詢效果。例如，篩選高消費 VIP 客戶。

```sql
SELECT customer_id, total_amount, vip_status
FROM orders
WHERE CASE 
          WHEN vip_status = 'Y' THEN total_amount > 500
          ELSE total_amount > 1000
      END;
```

此查詢會針對 VIP 客戶篩選總額大於 500 的訂單，其他客戶則篩選總額大於 1000 的訂單。

---

## 本日總結
今天我們學習了 PostgreSQL 中的 `CASE` 表達式及其條件邏輯運用。通過 `CASE`，我們能夠靈活地根據條件進行分類、轉換、篩選和排序，讓查詢結果更符合實際需求。明天，我們將探討 PostgreSQL 的權限管理。
