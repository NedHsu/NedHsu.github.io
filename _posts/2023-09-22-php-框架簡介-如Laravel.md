---
title: PHP - 框架簡介 (如 Laravel)
date: 2023-09-22 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "PHP 框架提供了結構化的方式來開發應用程式，加速開發並提升程式碼可維護性。Laravel 是目前最受歡迎的 PHP 框架之一，以其簡潔的語法和強大的功能而著稱。本課程將介紹 PHP 框架的基本概念、Laravel 的核心功能，以及如何快速啟動一個 Laravel 專案。"
---

---

## 課程簡介  
PHP 框架提供了結構化的方式來開發應用程式，加速開發並提升程式碼可維護性。Laravel 是目前最受歡迎的 PHP 框架之一，以其簡潔的語法和強大的功能而著稱。本課程將介紹 PHP 框架的基本概念、Laravel 的核心功能，以及如何快速啟動一個 Laravel 專案。

---

## PHP 框架的優勢  

1. **快速開發**：框架提供許多內建功能，如路由、資料庫操作、驗證等，減少重複性工作。  
2. **安全性增強**：框架通常內建防範常見攻擊的功能，例如 SQL 注入與 XSS 攻擊。  
3. **一致性與可維護性**：統一的程式結構與最佳實踐，方便團隊合作與長期維護。  
4. **社群支持**：熱門框架擁有活躍的社群，提供豐富的套件與資源。  

---

## Laravel 簡介  

### 核心特點  
- **MVC 架構**：基於 Model-View-Controller，清晰分離資料、邏輯與視圖。  
- **Eloquent ORM**：方便操作資料庫，提供簡潔的資料表模型。  
- **Blade 模板引擎**：易於使用的模板引擎，支援邏輯與模板繼承。  
- **強大的 Artisan 工具**：支援指令行操作，快速生成程式碼。  
- **內建功能**：包括驗證、路由、會話管理與測試等。  

---

## Laravel 開始使用  

### 1. 安裝 Laravel  
#### 安裝 Composer  
Laravel 需要 Composer 作為依賴管理工具。安裝指令：  
```bash
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

#### 創建 Laravel 專案  
```bash
composer create-project --prefer-dist laravel/laravel my-project
cd my-project
php artisan serve
```

訪問 `http://localhost:8000` 查看啟動頁面。

---

### 2. Laravel 基本結構  
Laravel 的專案目錄結構如下：  

- **`app/`**：核心應用程式程式碼，包括模型與控制器。  
- **`routes/`**：定義應用程式的路由。  
- **`resources/`**：視圖文件與靜態資源（CSS、JS）。  
- **`database/`**：資料庫遷移與資料填充文件。  
- **`public/`**：公開訪問的資源，如圖片與入口文件。  

---

## Laravel 基本功能  

### 1. 路由  
路由負責處理 URL 與控制器的關係。  
#### 定義路由  
在 `routes/web.php` 中添加：  
```php
Route::get('/hello', function () {
    return "Hello, Laravel!";
});
```

訪問 `http://localhost:8000/hello`。

#### 使用控制器處理路由  
```php
Route::get('/user/{id}', [UserController::class, 'show']);
```

---

### 2. 控制器  
#### 創建控制器  
使用 Artisan 命令：  
```bash
php artisan make:controller UserController
```

在 `app/Http/Controllers/UserController.php` 中：  
```php
<?php

namespace App\Http\Controllers;

class UserController extends Controller
{
    public function show($id)
    {
        return "User ID: " . $id;
    }
}
```

---

### 3. 資料庫操作  
#### 配置資料庫  
修改 `.env` 文件中的資料庫設定：  
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

#### 使用遷移建立資料表  
```bash
php artisan make:migration create_users_table --create=users
```

修改生成的遷移文件：  
```php
public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->timestamps();
    });
}
```

執行遷移：  
```bash
php artisan migrate
```

#### Eloquent 操作  
在模型中操作資料庫：  
```php
use App\Models\User;

$users = User::all();
foreach ($users as $user) {
    echo $user->name;
}
```

---

## 教學練習  

### 練習 1：簡單的留言板  
- 建立留言表單與資料庫，實現新增與顯示留言功能。  

### 練習 2：用戶系統  
- 使用 Laravel 的驗證功能，實現註冊與登入功能。  

### 練習 3：部落格系統  
- 建立文章的 CRUD 功能，並使用 Blade 模板顯示內容。  

---

## 教學重點  
- 理解 Laravel 的 MVC 架構與核心功能。  
- 掌握路由、控制器與 Eloquent ORM 的基本用法。  
- 學會利用 Laravel 提供的工具（如 Artisan）加速開發流程。  

---
