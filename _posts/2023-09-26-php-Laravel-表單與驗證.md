---
title: PHP - Laravel 表單與驗證
date: 2023-09-26 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP]
excerpt: "表單是 Web 開發中的核心部分，而表單資料的驗證是確保應用程式安全與穩定的關鍵。本課程將介紹如何在 Laravel 中建立表單、處理使用者輸入，並實現驗證邏輯。"
---

---

## 課程簡介

表單是 Web 開發中的核心部分，而表單資料的驗證是確保應用程式安全與穩定的關鍵。本課程將介紹如何在 Laravel 中建立表單、處理使用者輸入，並實現驗證邏輯。

---

## 表單建立與提交

### 建立路由

定義表單的顯示與提交路由：

```php
use App\Http\Controllers\FormController;

Route::get('/form', [FormController::class, 'showForm']);
Route::post('/form', [FormController::class, 'handleForm']);
```

---

### 建立控制器

使用 Artisan 命令生成控制器：

```bash
php artisan make:controller FormController
```

在 `FormController` 中新增方法：

```php
use Illuminate\Http\Request;

class FormController extends Controller
{
    public function showForm()
    {
        return view('form');
    }

    public function handleForm(Request $request)
    {
        // 處理表單資料
        return response()->json($request->all());
    }
}
```

---

### 建立視圖

在 `resources/views/` 中新增 `form.blade.php`：

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laravel 表單範例</title>
</head>
<body>
    <form action="/form" method="POST">
        @csrf
        <label for="name">姓名：</label>
        <input type="text" id="name" name="name">
        <br>
        <label for="email">電子郵件：</label>
        <input type="email" id="email" name="email">
        <br>
        <button type="submit">提交</button>
    </form>
</body>
</html>
```

- **`@csrf`**：Laravel 提供的 CSRF 保護標記，防止跨站請求偽造攻擊。

---

## 表單驗證

### 使用驗證器

在 `handleForm` 方法中加入驗證：

```php
public function handleForm(Request $request)
{
    $validatedData = $request->validate([
        'name' => 'required|max:255',
        'email' => 'required|email',
    ]);

    // 通過驗證後處理資料
    return response()->json($validatedData);
}
```

### 驗證規則

以下是常用的驗證規則：

- `required`：必填。
- `max:x`：字串最大長度。
- `min:x`：字串最小長度。
- `email`：必須為有效的電子郵件地址。
- `unique:table,column`：在指定資料表與欄位中必須唯一。

---

## 自訂錯誤訊息

### 在控制器中定義訊息

可以傳入第三個參數自訂錯誤訊息：

```php
$validatedData = $request->validate([
    'name' => 'required|max:255',
    'email' => 'required|email',
], [
    'name.required' => '姓名為必填項目。',
    'email.required' => '電子郵件為必填項目。',
    'email.email' => '請輸入有效的電子郵件地址。',
]);
```

---

## 顯示驗證錯誤

在 Blade 視圖中顯示錯誤訊息：

{% raw %}
```blade
<form action="/form" method="POST">
    @csrf
    <label for="name">姓名：</label>
    <input type="text" id="name" name="name" value="{{ old('name') }}">
    @error('name')
        <div style="color:red;">{{ $message }}</div>
    @enderror
    <br>
    <label for="email">電子郵件：</label>
    <input type="email" id="email" name="email" value="{{ old('email') }}">
    @error('email')
        <div style="color:red;">{{ $message }}</div>
    @enderror
    <br>
    <button type="submit">提交</button>
</form>
```
{% endraw %}

- **`old('field_name')`**：保留使用者輸入的資料。
- **`@error('field_name')`**：檢查特定欄位是否有錯誤，並顯示訊息。

---

## 高階功能

### 自訂驗證規則

建立自訂驗證邏輯：

1. 使用 Artisan 建立驗證規則：

   ```bash
   php artisan make:rule Uppercase
   ```

2. 定義規則邏輯：  
   在 `app/Rules/Uppercase.php` 中：

   ```php
   public function passes($attribute, $value)
   {
       return strtoupper($value) === $value;
   }

   public function message()
   {
       return ':attribute 必須為大寫字母。';
   }
   ```

3. 使用規則：
   ```php
   $request->validate([
       'name' => ['required', new Uppercase],
   ]);
   ```

---

## 教學練習

### 練習 1：建立註冊表單

1. 建立 `name`、`email`、`password` 三個欄位的註冊表單。
2. 添加驗證規則，確保所有欄位必填，`email` 格式正確，`password` 至少 8 位數。

### 練習 2：自訂驗證規則

1. 建立自訂驗證規則，檢查 `name` 是否僅包含英文字符。
2. 測試規則是否正確運作，並顯示自訂錯誤訊息。

---

## 教學重點

- 熟悉 Laravel 表單的建立與提交流程。
- 掌握內建的驗證規則與自訂錯誤訊息的設定方法。
- 學會自訂驗證規則，滿足更複雜的需求。

---
