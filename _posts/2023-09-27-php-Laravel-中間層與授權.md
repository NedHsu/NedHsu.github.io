---
title: PHP - Laravel 中間層與授權
date: 2023-09-27 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "中間層 (Middleware) 是 Laravel 中處理請求與響應的中繼層，常用於驗證使用者身份、記錄日誌等操作。授權則是用於控制使用者是否有權限執行特定操作或訪問某資源。本課程將介紹如何建立與使用中間層，以及如何設定授權邏輯。"
---

---

## 課程簡介  
中間層 (Middleware) 是 Laravel 中處理請求與響應的中繼層，常用於驗證使用者身份、記錄日誌等操作。授權則是用於控制使用者是否有權限執行特定操作或訪問某資源。本課程將介紹如何建立與使用中間層，以及如何設定授權邏輯。

---

## 中間層 (Middleware)  

### 內建中間層  
Laravel 提供一些內建的中間層，例如：  
- **`auth`**：驗證使用者是否已登入。  
- **`guest`**：檢查使用者是否為訪客。  
- **`throttle`**：限制 API 請求頻率。

### 定義路由中間層  
在路由中應用中間層：  
```php
Route::get('/dashboard', function () {
    return '歡迎來到控制台';
})->middleware('auth');
```

---

### 建立自訂中間層  
1. **使用 Artisan 創建中間層**：  
   ```bash
   php artisan make:middleware CheckAge
   ```

2. **定義邏輯**：  
   在 `app/Http/Middleware/CheckAge.php` 中：  
   ```php
   public function handle($request, Closure $next)
   {
       if ($request->input('age') < 18) {
           return redirect('home');
       }
       return $next($request);
   }
   ```

3. **註冊中間層**：  
   在 `app/Http/Kernel.php` 的 `$routeMiddleware` 陣列中註冊：  
   ```php
   'check.age' => \App\Http\Middleware\CheckAge::class,
   ```

4. **應用到路由**：  
   ```php
   Route::get('/restricted', function () {
       return '這是受限的區域';
   })->middleware('check.age');
   ```

---

## 授權 (Authorization)  

### 使用 Policy 進行授權  

#### 建立 Policy  
使用 Artisan 命令創建：  
```bash
php artisan make:policy PostPolicy --model=Post
```

- **`--model=Post`**：自動與 `Post` 模型關聯。  
- Policy 文件會被創建在 `app/Policies/` 目錄中。  

#### 定義授權方法  
在 `PostPolicy` 中新增方法：  
```php
public function update(User $user, Post $post)
{
    return $user->id === $post->user_id;
}
```

#### 註冊 Policy  
在 `app/Providers/AuthServiceProvider.php` 中：  
```php
protected $policies = [
    Post::class => PostPolicy::class,
];
```

---

### 在控制器中檢查授權  
使用 `authorize` 方法驗證：  
```php
public function update(Request $request, Post $post)
{
    $this->authorize('update', $post);

    // 授權通過，執行操作
    $post->title = $request->input('title');
    $post->save();
    return redirect()->back();
}
```

---

### Blade 中的授權檢查  
在視圖中使用 `@can` 或 `@cannot` 指令：  
```blade
@can('update', $post)
    <a href="{{ route('post.edit', $post->id) }}">編輯文章</a>
@endcan
```

---

## Gate 授權方法  

#### 定義 Gate  
在 `AuthServiceProvider` 中使用 `Gate::define`：  
```php
use Illuminate\Support\Facades\Gate;

public function boot()
{
    Gate::define('edit-settings', function (User $user) {
        return $user->isAdmin();
    });
}
```

#### 使用 Gate 驗證  
在控制器中：  
```php
if (Gate::allows('edit-settings')) {
    // 使用者有權限
}

if (Gate::denies('edit-settings')) {
    // 使用者無權限
}
```

---

## 教學練習  

### 練習 1：建立自訂中間層  
1. 創建一個中間層，檢查請求是否帶有合法的 API 密鑰。  
2. 若密鑰不合法，返回 403 錯誤。  

### 練習 2：建立授權功能  
1. 建立 `CategoryPolicy`，限制只有分類的建立者才能編輯分類。  
2. 在控制器與 Blade 中應用授權邏輯。  

---

## 教學重點  
- 熟悉中間層的創建與應用流程。  
- 理解 Laravel 中 Policy 與 Gate 的區別與使用場景。  
- 掌握如何在控制器與視圖中進行授權檢查，保護應用的敏感操作。  

---
