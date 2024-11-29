---
title: PHP - Composer 與套件管理
date: 2023-09-21 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "JSON 與 XML 是常見的資料格式，廣泛用於 API 資料傳輸和配置檔案處理。本課程將講解如何使用 PHP 讀取、解析、生成 JSON 和 XML 資料，並比較兩種格式的使用場景。"
---

---

## 課程簡介  
Composer 是 PHP 的依賴管理工具，用於管理專案中的第三方套件與函式庫。在這節課中，我們將介紹 Composer 的基本使用方法、如何安裝與更新套件，以及如何在 Laravel 中管理套件。

---

## Composer 基礎  

### 1. 安裝 Composer  
從 [Composer 官方網站](https://getcomposer.org/) 下載並安裝 Composer。安裝完成後，可使用以下命令確認安裝成功：  
```bash
composer --version
```

---

### 2. 初始化專案  
在專案目錄中初始化 Composer：  
```bash
composer init
```

根據提示填寫專案資訊，完成後會生成 `composer.json` 文件。

---

### 3. 安裝套件  

#### 安裝指定套件  
使用以下命令安裝套件：  
```bash
composer require vendor/package
```

例如，安裝 Guzzle HTTP 套件：  
```bash
composer require guzzlehttp/guzzle
```

#### 安裝特定版本  
指定版本安裝：  
```bash
composer require vendor/package:^2.0
```

---

### 4. 更新套件  
使用以下命令更新所有套件：  
```bash
composer update
```

若僅更新特定套件：  
```bash
composer update vendor/package
```

---

### 5. 刪除套件  
若需移除某個套件，使用以下命令：  
```bash
composer remove vendor/package
```

---

### 6. Autoload 自動載入  
Composer 提供自動載入功能，讓專案中的類別與命名空間可以自動被載入：  
```php
require 'vendor/autoload.php';

$client = new \GuzzleHttp\Client();
```

---

## Composer 文件結構  

- **`composer.json`**：定義專案依賴與其他配置信息。  
- **`composer.lock`**：鎖定依賴的具體版本，確保不同環境下安裝的版本一致。  
- **`vendor/`**：存放第三方套件的目錄。  

---

## Laravel 與 Composer  

### 1. Laravel 專案初始化  
Laravel 本身可以通過 Composer 安裝：  
```bash
composer create-project --prefer-dist laravel/laravel example-app
```

### 2. 安裝 Laravel 套件  
在 Laravel 中使用 Composer 安裝套件，例如：  
```bash
composer require laravel/socialite
```

安裝完成後，根據套件的說明進行設定，例如在 `config/app.php` 中註冊服務提供者。

---

## 常用 Composer 命令  

- **檢查安裝的套件**：  
  ```bash
  composer show
  ```

- **檢查指定套件信息**：  
  ```bash
  composer show vendor/package
  ```

- **清理未使用的依賴**：  
  ```bash
  composer dump-autoload
  ```

---

## Composer 進階操作  

### 1. 全域安裝套件  
某些工具需要全域安裝，例如 Laravel 安裝器：  
```bash
composer global require laravel/installer
```

安裝完成後，將 Composer 全域安裝的執行檔目錄加入系統路徑，例如：  
```bash
~/.composer/vendor/bin
```

---

### 2. 定義自訂命名空間  
在 `composer.json` 中設定自訂命名空間：  
```json
"autoload": {
    "psr-4": {
        "App\\": "src/"
    }
}
```

更新自動載入配置：  
```bash
composer dump-autoload
```

---

### 3. 使用 Scripts 指令  
Composer 支援在 `composer.json` 中定義 Scripts 指令以執行自動化操作：  
```json
"scripts": {
    "post-install-cmd": [
        "php artisan migrate"
    ]
}
```

當執行 `composer install` 後，會自動執行 `php artisan migrate`。

---

## 教學練習  

### 練習 1：安裝與使用套件  
1. 使用 Composer 安裝 Guzzle 套件。  
2. 編寫一個簡單的 PHP 腳本，使用 Guzzle 發送 HTTP 請求並解析回應。

### 練習 2：建立自訂命名空間  
1. 定義一個自訂命名空間 `MyApp`，並將其對應到 `src/` 目錄。  
2. 在 `src/` 中創建一個類別，並在主程式中載入與使用該類別。

---

## 教學重點  
- 理解 Composer 的基本功能與作用。  
- 掌握如何管理專案的依賴套件。  
- 熟悉 Laravel 與 Composer 的整合使用。  

---
