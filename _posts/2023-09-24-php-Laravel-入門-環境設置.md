---
title: PHP - Laravel 入門 - 環境設置
date: 2023-09-24 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "Laravel 是目前最受歡迎的 PHP 框架之一，以其優雅的語法和強大的功能聞名。本課程將帶您完成 Laravel 的環境設置，包括所需工具的安裝及專案的初始化，幫助您快速啟動 Laravel 開發。"
---

---

## 課程簡介  
Laravel 是目前最受歡迎的 PHP 框架之一，以其優雅的語法和強大的功能聞名。本課程將帶您完成 Laravel 的環境設置，包括所需工具的安裝及專案的初始化，幫助您快速啟動 Laravel 開發。

---

## Laravel 環境需求  
要執行 Laravel，您的開發環境需要以下條件：  
1. **PHP 版本**：至少 PHP 8.1。  
2. **Composer**：PHP 的依賴管理工具。  
3. **伺服器**：建議使用 Apache 或 Nginx。  
4. **資料庫**：支援 MySQL、PostgreSQL、SQLite 或 SQL Server。  

---

## 步驟 1：安裝 Composer  

### 確認是否已安裝  
在終端機輸入以下指令：  
```bash
composer --version
```

若未安裝，請按照以下步驟：  
1. 前往 [Composer 官網](https://getcomposer.org/)下載安裝程式。  
2. 遵循安裝指引完成安裝。  

完成後，重新確認 Composer 是否可用：  
```bash
composer --version
```

---

## 步驟 2：安裝 Laravel 專案  

### 使用 Composer 建立專案  
執行以下指令建立新的 Laravel 專案：  
```bash
composer create-project --prefer-dist laravel/laravel my-project
```

### 切換到專案目錄  
```bash
cd my-project
```

---

## 步驟 3：啟動內建伺服器  

Laravel 提供內建伺服器方便開發時測試：  
```bash
php artisan serve
```

### 驗證啟動  
開啟瀏覽器，輸入以下網址：  
```text
http://localhost:8000
```

您應該可以看到 Laravel 的歡迎頁面，表示環境設置成功。

---

## 步驟 4：設定資料庫  

### 修改 `.env` 文件  
找到專案根目錄下的 `.env` 文件，修改資料庫設定：  
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

### 資料庫遷移  
執行以下指令創建預設的資料表：  
```bash
php artisan migrate
```

---

## 步驟 5：安裝開發工具  

### 建議安裝工具  
1. **Laravel Debugbar**：用於除錯與效能分析。  
   ```bash
   composer require barryvdh/laravel-debugbar --dev
   ```

2. **Laravel IDE Helper**：提升開發時的自動補全功能。  
   ```bash
   composer require barryvdh/laravel-ide-helper --dev
   ```

---

## 常見問題排查  

### 問題 1：`php` 指令無法執行  
- 確認 PHP 已正確安裝，並加入系統的環境變數。  
- 可在終端機輸入 `php --version` 檢查版本。  

### 問題 2：`composer` 指令無法執行  
- 確保 Composer 安裝完成並加入環境變數。  

### 問題 3：無法啟動伺服器  
- 確認專案目錄下是否有 `artisan` 文件。  
- 確保 `.env` 文件配置無誤，尤其是 `APP_KEY`（若無，執行 `php artisan key:generate`）。  

---

## 教學練習  

### 練習 1：建立專案  
- 創建一個新專案，命名為 `blog`，並啟動伺服器確認運作正常。  

### 練習 2：資料庫連接測試  
- 建立 MySQL 資料庫，修改 `.env` 文件並執行 `php artisan migrate` 測試遷移功能。  

---

## 教學重點  
- 掌握 Laravel 的基本環境需求與安裝流程。  
- 學會啟動 Laravel 的內建伺服器，快速進入開發模式。  
- 熟悉 `.env` 文件的配置，尤其是資料庫相關設置。  

---
