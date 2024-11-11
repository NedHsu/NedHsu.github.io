---
title: PostgreSQL - 第 26 天 - 備份與恢復
date: 2024-10-26 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "備份和恢復是保障數據安全性的重要措施，特別是在系統故障或數據損壞的情況下，透過定期備份可以確保數據的完整性。PostgreSQL 提供了多種方式來備份和恢復數據，我們會探討基本和進階方法，包括 `pg_dump` 工具和全數據庫恢復。"
---

## 課程簡介
備份和恢復是保障數據安全性的重要措施，特別是在系統故障或數據損壞的情況下，透過定期備份可以確保數據的完整性。PostgreSQL 提供了多種方式來備份和恢復數據，我們會探討基本和進階方法，包括 `pg_dump` 工具和全數據庫恢復。

---

## 備份與恢復的基本概念

- **備份**：備份是將數據庫的數據複製並存儲在其他位置，以便在數據丟失或損壞時進行恢復。常見的備份方式有邏輯備份和物理備份。
- **恢復**：恢復是將備份文件中的數據重新載入到數據庫中，從而恢復到特定狀態。

---

## 使用 `pg_dump` 進行邏輯備份

`pg_dump` 是 PostgreSQL 的命令行工具，用於將數據庫的結構和數據導出到文件。`pg_dump` 備份是邏輯備份，可以備份特定的數據庫或表。

### 1. 備份整個數據庫

使用 `pg_dump` 將整個數據庫導出為 `.sql` 文件：

```bash
pg_dump -U 用戶名 -d 數據庫名稱 -F c -f backup.sql
```

參數說明：
- `-U`：指定用戶名。
- `-d`：指定數據庫名稱。
- `-F`：指定備份格式，例如 `c` 代表自定義格式。
- `-f`：指定輸出文件名。

#### 範例

假設數據庫名稱為 `mydatabase`，用戶名為 `postgres`，備份文件名為 `mydatabase_backup.sql`：

```bash
pg_dump -U postgres -d mydatabase -f mydatabase_backup.sql
```

---

### 2. 備份特定表

若只需備份特定表，可指定表名：

```bash
pg_dump -U 用戶名 -d 數據庫名稱 -t 表名 -f table_backup.sql
```

#### 範例

備份 `employees` 表：

```bash
pg_dump -U postgres -d mydatabase -t employees -f employees_backup.sql
```

---

### 3. 備份為壓縮格式

可以使用 `-Fc` 將備份文件壓縮以節省存儲空間：

```bash
pg_dump -U 用戶名 -d 數據庫名稱 -F c -f backup_compressed.dump
```

---

## 使用 `pg_restore` 恢復數據

`pg_restore` 是配合 `pg_dump` 使用的恢復工具，適用於 `.dump` 格式或自定義格式的文件。

### 1. 恢復整個數據庫

```bash
pg_restore -U 用戶名 -d 數據庫名稱 -c -1 backup_compressed.dump
```

參數說明：
- `-c`：先刪除現有數據庫中的數據，再進行恢復。
- `-1`：將所有操作包裹在單一事務中執行，若出錯會回滾。

#### 範例

```bash
pg_restore -U postgres -d mydatabase -c -1 backup_compressed.dump
```

---

### 2. 恢復特定表

可以使用 `-t` 指定表名來恢復單一表：

```bash
pg_restore -U 用戶名 -d 數據庫名稱 -t 表名 -c backup_compressed.dump
```

#### 範例

```bash
pg_restore -U postgres -d mydatabase -t employees -c backup_compressed.dump
```

---

## 使用 `psql` 恢復 `.sql` 文件

如果備份文件為 `.sql` 格式，可以使用 `psql` 將其導入數據庫：

```bash
psql -U 用戶名 -d 數據庫名稱 -f backup.sql
```

#### 範例

```bash
psql -U postgres -d mydatabase -f mydatabase_backup.sql
```

---

## 全數據庫備份與恢復

PostgreSQL 支持使用 `pg_basebackup` 進行物理備份，通常應用於大型數據庫和高可用環境。

### 使用 `pg_basebackup` 進行物理備份

```bash
pg_basebackup -U 用戶名 -D 備份目錄 -F tar -z -P
```

參數說明：
- `-D`：指定備份目錄。
- `-F tar`：將備份文件存儲為 `.tar` 格式。
- `-z`：壓縮備份文件。
- `-P`：顯示進度。

#### 範例

```bash
pg_basebackup -U postgres -D /backup/mydatabase -F tar -z -P
```

物理備份通常用於主從複製環境中，並需要對備份目錄進行更嚴格的權限控制。

---

## 定期自動備份

可使用 `cron` 定期執行備份腳本，自動化備份流程。例如，每天凌晨 2 點自動備份：

```bash
0 2 * * * pg_dump -U postgres -d mydatabase -f /backup/mydatabase_$(date +\%Y-\%m-\%d).sql
```

這樣會生成每天的備份文件，並在文件名中加入日期標記。

---

## 備份與恢復的最佳實踐

1. **定期備份**：根據業務需求設置合適的備份頻率，建議至少每週一次。
2. **備份文件存儲位置**：避免將備份文件存放在數據庫服務器上，最好存儲於安全的遠端存儲中。
3. **檢查備份文件**：定期測試備份文件的完整性，確保文件可用。
4. **權限管理**：妥善管理備份與恢復過程中的用戶權限，防止未授權的數據訪問。

---

## 本日總結
今天我們學習了 PostgreSQL 中的備份與恢復方法，包括使用 `pg_dump`、`pg_restore` 進行邏輯備份和恢復，以及 `pg_basebackup` 進行物理備份。備份與恢復是保障數據庫安全與完整性的重要手段。明天，我們將學習 PostgreSQL 的監控和性能調整，幫助提高數據庫的運行效率。
