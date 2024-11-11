---
title: PostgreSQL - 第 8 天 - 排序與限制結果 (ORDER BY, LIMIT)
date: 2024-10-08 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "今天我們將學習如何使用 `ORDER BY` 和 `LIMIT` 子句來排序和限制 PostgreSQL 查詢的結果。這些功能能幫助我們根據需求精確地控制查詢結果的顯示順序以及結果集的大小，對於大數據量查詢尤為重要。"
---

## 課程簡介
今天我們將學習如何使用 `ORDER BY` 和 `LIMIT` 子句來排序和限制 PostgreSQL 查詢的結果。這些功能能幫助我們根據需求精確地控制查詢結果的顯示順序以及結果集的大小，對於大數據量查詢尤為重要。

---

## 使用 ORDER BY 排序查詢結果

`ORDER BY` 子句用來對查詢結果進行排序。可以按一個或多個欄位進行排序，並且可以選擇升序 (`ASC`) 或降序 (`DESC`) 排序。

### 語法
```sql
SELECT 欄位1, 欄位2, ... FROM 表名 ORDER BY 欄位1 [ASC|DESC], 欄位2 [ASC|DESC], ...;
```

默認情況下，`ORDER BY` 使用升序 (`ASC`) 排序。

### 範例

1. **按單個欄位排序**

   按照員工的 `月薪` 升序排序：

   ```sql
   SELECT 姓名, 月薪 FROM 員工 ORDER BY 月薪;
   ```

   若要按降序排序，可以加上 `DESC`：

   ```sql
   SELECT 姓名, 月薪 FROM 員工 ORDER BY 月薪 DESC;
   ```

2. **按多個欄位排序**

   按照 `職位` 升序，再按 `月薪` 降序排序：

   ```sql
   SELECT 姓名, 職位, 月薪 FROM 員工 ORDER BY 職位 ASC, 月薪 DESC;
   ```

3. **按日期排序**

   按照入職日期升序排序：

   ```sql
   SELECT 姓名, 入職日期 FROM 員工 ORDER BY 入職日期;
   ```

---

## 使用 LIMIT 限制查詢結果

`LIMIT` 子句用於限制查詢返回的結果數量。這對於需要查看前幾條記錄，或者僅需部分結果的情況非常有用。

### 語法
```sql
SELECT 欄位1, 欄位2, ... FROM 表名 LIMIT 數量;
```

### 範例

1. **限制結果數量**

   查詢員工中月薪最高的 5 名員工：

   ```sql
   SELECT 姓名, 月薪 FROM 員工 ORDER BY 月薪 DESC LIMIT 5;
   ```

   這將返回月薪最高的前 5 名員工。

2. **限制結果並排序**

   查詢入職日期最早的 3 名員工：

   ```sql
   SELECT 姓名, 入職日期 FROM 員工 ORDER BY 入職日期 ASC LIMIT 3;
   ```

---

## 使用 OFFSET 配合 LIMIT

當需要跳過前幾條記錄後返回其餘結果時，可以使用 `OFFSET` 與 `LIMIT` 進行組合。例如，查詢員工表的第 6 到第 10 條記錄。

### 語法
```sql
SELECT 欄位1, 欄位2, ... FROM 表名 LIMIT 數量 OFFSET 跳過的數量;
```

### 範例

查詢第 6 到第 10 名月薪最高的員工：

```sql
SELECT 姓名, 月薪 FROM 員工 ORDER BY 月薪 DESC LIMIT 5 OFFSET 5;
```

這將跳過月薪最高的前 5 名員工，返回接下來的 5 名員工。

---

## 使用 FETCH FIRST / NEXT

在某些 PostgreSQL 版本中，`FETCH FIRST` 或 `FETCH NEXT` 可以代替 `LIMIT` 來限制結果數量，這樣語句在某些情況下會顯得更具可讀性，尤其是當與 `OFFSET` 一起使用時。

### 語法
```sql
SELECT 欄位1, 欄位2, ... FROM 表名 FETCH FIRST 數量 ROWS ONLY;
```

### 範例

查詢月薪前 5 名員工：

```sql
SELECT 姓名, 月薪 FROM 員工 ORDER BY 月薪 DESC FETCH FIRST 5 ROWS ONLY;
```

這會返回與 `LIMIT` 相同的結果。

---

## 本日總結
今天我們學習了如何使用 `ORDER BY` 子句對查詢結果進行排序，並使用 `LIMIT` 和 `OFFSET` 來控制返回的記錄數量及其位置。這些技巧對於優化查詢和精確控制數據輸出順序非常有用。明天我們將學習如何使用聚合函數（如 `COUNT`、`SUM` 等）來處理和分析數據。
