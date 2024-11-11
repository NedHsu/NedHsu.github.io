---
title: PostgreSQL - 第 25 天 - 安全性管理
date: 2024-10-25 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "安全性管理是確保 PostgreSQL 數據庫免受未授權訪問和操作的重要步驟。今天我們將學習如何管理數據庫用戶與權限控制，包括用戶創建、角色分配、權限管理及數據庫加密等內容，提升數據庫的安全性。"
---

## 課程簡介
安全性管理是確保 PostgreSQL 數據庫免受未授權訪問和操作的重要步驟。今天我們將學習如何管理數據庫用戶與權限控制，包括用戶創建、角色分配、權限管理及數據庫加密等內容，提升數據庫的安全性。

---

## 基本安全性概念

在 PostgreSQL 中，用戶和角色的概念是緊密相關的：

- **用戶 (User)**：能夠登入數據庫並執行操作的個體。
- **角色 (Role)**：授予用戶權限的一組配置，方便管理不同用戶的權限。

PostgreSQL 中的角色可以作為用戶，也可以是組的概念。用戶通過角色獲取數據庫操作權限，而角色則透過繼承來授權。

---

## 用戶與角色管理

### 1. 創建用戶

使用 `CREATE ROLE` 創建一個新的用戶，並賦予其基本的登入權限。

#### 範例

創建用戶 `alice` 並允許其登入：

```sql
CREATE ROLE alice WITH LOGIN PASSWORD 'password123';
```

### 2. 創建角色

角色可以為多個用戶分配共同的權限，便於權限管理。

#### 範例

創建角色 `developer` 並允許其登入：

```sql
CREATE ROLE developer WITH LOGIN;
```

---

### 3. 分配角色與繼承

為用戶分配角色後，用戶便能繼承角色的權限，並可以根據需要進行權限增減。

#### 範例

將 `alice` 加入 `developer` 角色，使其繼承 `developer` 角色的權限：

```sql
GRANT developer TO alice;
```

使用 `REVOKE` 移除角色：

```sql
REVOKE developer FROM alice;
```

---

## 權限管理

PostgreSQL 提供多種權限來控制數據庫資源的訪問，包括表、模式、序列、函數等不同層級的控制。

### 1. 表權限管理

常用的表級別權限有 `SELECT`、`INSERT`、`UPDATE` 和 `DELETE`。

#### 範例

授予 `developer` 角色在 `employees` 表上查詢和插入數據的權限：

```sql
GRANT SELECT, INSERT ON employees TO developer;
```

移除 `developer` 的插入權限：

```sql
REVOKE INSERT ON employees FROM developer;
```

---

### 2. 架構權限管理

控制架構（Schema）層級的權限可以保護架構中的所有物件，例如表和視圖。

#### 範例

授予 `developer` 角色對 `public` 架構中的所有物件的使用權限：

```sql
GRANT USAGE ON SCHEMA public TO developer;
```

---

### 3. 函數與序列權限

可以設置函數與序列的執行和訪問權限，從而控制數據的生成與計算過程。

#### 範例

授予 `developer` 執行 `calculate_salary` 函數的權限：

```sql
GRANT EXECUTE ON FUNCTION calculate_salary TO developer;
```

---

## 行級安全性控制

PostgreSQL 支持行級安全性 (Row-Level Security, RLS)，允許對表中的行進行更精細的訪問控制。

### 1. 啟用行級安全性

可以在表上啟用 RLS 以實現行級訪問控制。

#### 範例

在 `employees` 表上啟用行級安全性：

```sql
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
```

### 2. 定義行級策略

定義策略來控制不同用戶或角色的行級別訪問權限。

#### 範例

讓 `developer` 角色僅能查詢自己的記錄：

```sql
CREATE POLICY employee_policy ON employees
    FOR SELECT USING (user_id = current_user);
GRANT SELECT ON employees TO developer;
```

---

## 數據庫加密

### 1. 密碼加密

PostgreSQL 支持加密存儲用戶密碼。可以在創建用戶時設置密碼加密，保護登入憑據。

#### 範例

加密存儲用戶 `bob` 的密碼：

```sql
CREATE ROLE bob WITH LOGIN PASSWORD 'securepassword';
```

可以在 `postgresql.conf` 文件中設定 `password_encryption = 'scram-sha-256'`，強制使用強密碼加密算法。

### 2. 數據傳輸加密

啟用 SSL 加密數據庫和用戶端之間的連接，確保數據在傳輸過程中的安全性。

要啟用 SSL 加密，需在 `postgresql.conf` 文件中將 `ssl` 設置為 `on`，並配置 SSL 證書和密鑰。

---

## 安全性管理最佳實踐

1. **僅分配必要權限**：確保每個用戶或角色僅擁有執行所需操作的權限，減少潛在風險。
2. **使用行級安全性 (RLS)**：對數據表中敏感數據進行行級控制，防止未授權用戶訪問。
3. **密碼和數據加密**：強制使用加密算法保護用戶密碼和傳輸數據。
4. **定期審核用戶和權限**：定期檢查用戶角色和權限配置，確保數據庫安全性。

---

## 本日總結
今天我們學習了 PostgreSQL 中的安全性管理技巧，涵蓋用戶和角色管理、權限控制、行級安全性以及數據加密。這些技術有助於提升數據庫的安全性。明天，我們將繼續深入探討查詢優化技術，以提升 PostgreSQL 的性能和效率。
