---
title: PostgreSQL - 第 1 天 - 什麼是 PostgreSQL？
date: 2024-10-01 20:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "PostgreSQL 是一個功能強大且開源的關聯式數據庫管理系統 (RDBMS)，以高穩定性和靈活性著稱，廣泛應用於網站、應用程式和企業級數據庫的後端系統。它支援 SQL 標準的同時，還提供了許多先進功能，例如複雜查詢、事務管理、資料複寫和擴展能力。"
---

## 課程簡介
PostgreSQL 是一個功能強大且開源的關聯式數據庫管理系統 (RDBMS)，以高穩定性和靈活性著稱，廣泛應用於網站、應用程式和企業級數據庫的後端系統。它支援 SQL 標準的同時，還提供了許多先進功能，例如複雜查詢、事務管理、資料複寫和擴展能力。

## 主要特色
- **開源且免費**：PostgreSQL 是完全免費且開源的，企業和個人可自由使用和修改。
- **高穩定性**：支援多達數 TB 的數據集，穩定性和可靠性受到了全球用戶的認可。
- **擴展性強**：提供許多擴展功能，如儲存過程、觸發器、自定義函數等，適用於構建複雜的應用程式邏輯。
- **合規的 SQL 支援**：完全支持 SQL 標準，並且額外提供物件導向和文檔型數據支持（如 JSON）。

## 安裝 PostgreSQL
在開始使用 PostgreSQL 前，需將其安裝在操作系統上。以下是常見的安裝方式：

1. **Linux**：
   - 使用 apt (Debian/Ubuntu)：
     ```bash
     sudo apt update
     sudo apt install postgresql postgresql-contrib
     ```
   - 使用 yum (CentOS/RHEL)：
     ```bash
     sudo yum install postgresql-server postgresql-contrib
     ```

2. **macOS**：
   - 使用 Homebrew 安裝：
     ```bash
     brew install postgresql
     ```

3. **Windows**：
   - 從 [PostgreSQL 官方網站](https://www.postgresql.org/download/) 下載 Windows 安裝包，並按照指示進行安裝。

## 基本指令介紹
安裝完成後，可以使用一些基本指令檢查 PostgreSQL 是否正常運行並進行簡單操作。

1. **啟動 PostgreSQL**：
   ```bash
   sudo service postgresql start  # Linux
   brew services start postgresql  # macOS
   ```

2. **進入 PostgreSQL 命令行介面 (psql)**：
   ```bash
   psql -U postgres # psql -U yourUser postgres
   ```
   （這裡 `postgres` 是預設的超級使用者帳戶。）

3. **檢查版本**：
   進入 psql 之後，輸入以下指令確認安裝的版本：
   ```sql
   SELECT version();
   ```

4. **退出 psql**：
   使用 `\q` 指令退出 psql 介面。

---

## 本日總結
今天我們簡單介紹了 PostgreSQL 的背景、安裝過程和一些基本操作。明天我們將深入探討 PostgreSQL 的數據類型，理解數據的儲存方式和結構。
