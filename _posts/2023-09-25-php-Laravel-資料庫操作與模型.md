---
title: PHP - Laravel 資料庫操作與模型
date: 2023-09-25 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "Laravel 的資料庫操作基於 Eloquent ORM，使開發者能以簡潔的方式操作資料表，無需撰寫繁瑣的 SQL 語句。本課程將介紹 Eloquent 的基本用法，包括模型的建立、查詢、插入、更新與刪除等操作。"
---

---

## 課程簡介  
Laravel 的資料庫操作基於 Eloquent ORM，使開發者能以簡潔的方式操作資料表，無需撰寫繁瑣的 SQL 語句。本課程將介紹 Eloquent 的基本用法，包括模型的建立、查詢、插入、更新與刪除等操作。

---

## 資料庫配置  

### 修改 `.env` 文件  
在 Laravel 專案根目錄下找到 `.env` 文件，設定資料庫連接資訊：  
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

執行資料庫遷移前，請確保資料庫已存在且連接成功。

---

## 模型的建立  

### 建立模型與遷移文件  
使用 Artisan 命令同時生成模型與遷移文件：  
```bash
php artisan make:model Post -m
```

- `Post` 是模型名稱，會在 `app/Models/` 下生成。  
- `-m` 則會同時生成遷移文件，位於 `database/migrations/` 目錄下。

---

### 定義資料表結構  
修改 `database/migrations/{timestamp}_create_posts_table.php` 文件：  
```php
public function up()
{
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('content');
        $table->timestamps();
    });
}
```

執行以下指令進行遷移，創建資料表：  
```bash
php artisan migrate
```

---

## 基本資料庫操作  

### 1. 查詢資料  

#### 取得所有資料  
```php
use App\Models\Post;

$posts = Post::all();
foreach ($posts as $post) {
    echo $post->title;
}
```

#### 條件查詢  
```php
$posts = Post::where('title', 'like', '%Laravel%')->get();
```

#### 查詢單筆資料  
```php
$post = Post::find(1); // 根據主鍵查詢
echo $post->title;
```

---

### 2. 新增資料  

#### 方法 1：直接儲存  
```php
$post = new Post();
$post->title = "Laravel 基礎";
$post->content = "這是一篇關於 Laravel 的文章。";
$post->save();
```

#### 方法 2：使用靜態方法  
```php
Post::create([
    'title' => "Laravel 進階",
    'content' => "這是一篇進階教學文章。",
]);
```

**注意**：使用 `create` 方法前需在模型中設定 `$fillable` 或 `$guarded` 屬性：  
```php
protected $fillable = ['title', 'content'];
```

---

### 3. 更新資料  
```php
$post = Post::find(1);
$post->title = "更新後的標題";
$post->save();
```

#### 批量更新  
```php
Post::where('title', 'like', '%Laravel%')->update(['content' => '更新內容']);
```

---

### 4. 刪除資料  

#### 刪除單筆資料  
```php
$post = Post::find(1);
$post->delete();
```

#### 批量刪除  
```php
Post::where('title', 'like', '%Laravel%')->delete();
```

---

## 關聯關係  

Eloquent 支援資料表之間的關聯，例如：  

### 一對多  
#### 定義關係  
在 `Post` 模型中：  
```php
public function comments()
{
    return $this->hasMany(Comment::class);
}
```

在 `Comment` 模型中：  
```php
public function post()
{
    return $this->belongsTo(Post::class);
}
```

#### 使用關係  
```php
$post = Post::find(1);
foreach ($post->comments as $comment) {
    echo $comment->content;
}
```

---

### 多對多  
#### 定義關係  
在模型中使用 `belongsToMany`：  
```php
public function tags()
{
    return $this->belongsToMany(Tag::class);
}
```

#### 使用關係  
```php
$post = Post::find(1);
foreach ($post->tags as $tag) {
    echo $tag->name;
}
```

---

## 教學練習  

### 練習 1：部落格功能  
1. 建立 `Category`（分類）模型，與 `Post` 模型設置一對多關係。  
2. 查詢某分類下的所有文章，並顯示標題與內容。  

### 練習 2：標籤系統  
1. 建立 `Tag` 模型，與 `Post` 模型設置多對多關係。  
2. 實現將標籤新增至某文章的功能。  

---

## 教學重點  
- 熟悉 Laravel 的模型操作與資料庫查詢方法。  
- 理解 `fillable` 屬性的重要性，確保資料安全。  
- 學會使用 Eloquent 關係實現資料表之間的關聯操作。  

---
