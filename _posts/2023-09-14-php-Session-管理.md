---
title: PHP - Session 管理 
date: 2023-09-14 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "Session（會話）是一種伺服器端技術，用於儲存使用者的資訊以實現跨頁面的狀態保持，例如使用者登入狀態或購物車資訊。本課程將介紹 PHP Session 的基本操作、安全性及常見的實踐方式。"
---

---

## 課程簡介  
Session（會話）是一種伺服器端技術，用於儲存使用者的資訊以實現跨頁面的狀態保持，例如使用者登入狀態或購物車資訊。本課程將介紹 PHP Session 的基本操作、安全性及常見的實踐方式。

---

## PHP Session 工作原理  
1. **Session 啟動**：伺服器為每個訪問的用戶生成一個唯一的 Session ID。  
2. **Session ID 存儲**：Session ID 通常儲存在用戶的瀏覽器 Cookie 中，也可以通過 URL 傳遞。  
3. **資料存取**：伺服器端根據 Session ID 儲存與該使用者相關的資訊。  

---

## Session 基本操作  

### 1. 啟動 Session  
在 PHP 中，使用 `session_start()` 開啟 Session：  
```php
<?php
session_start(); // 必須在任何輸出之前調用
?>
```

---

### 2. 設定 Session 資料  
```php
<?php
session_start();
$_SESSION['username'] = 'Alice';
$_SESSION['email'] = 'alice@example.com';
echo "Session 已設定！";
?>
```

---

### 3. 讀取 Session 資料  
```php
<?php
session_start();
echo "使用者名稱：" . $_SESSION['username'] . "<br>";
echo "電子郵件：" . $_SESSION['email'];
?>
```

---

### 4. 移除 Session 資料  
#### 移除單個 Session 變數  
```php
<?php
session_start();
unset($_SESSION['username']);
echo "Session username 已移除！";
?>
```

#### 清空所有 Session 變數  
```php
<?php
session_start();
session_unset();
echo "所有 Session 資料已清空！";
?>
```

---

### 5. 銷毀 Session  
```php
<?php
session_start();
session_destroy(); // 銷毀整個 Session
echo "Session 已銷毀！";
?>
```

---

## Session 設定  

### 1. 自定義 Session 保存位置  
預設情況下，Session 資料儲存在伺服器的臨時目錄中，可以通過 `session_save_path()` 更改：  
```php
<?php
session_save_path('/path/to/custom/session/directory');
session_start();
?>
```

### 2. 設定 Session 的生存期  
透過修改 `php.ini` 或程式內設置：  
```php
<?php
ini_set('session.gc_maxlifetime', 3600); // 設置為 1 小時
session_start();
?>
```

---

## Session 安全性  

### 1. 防止 Session 劫持  
#### 僅通過 HTTPS 傳輸 Session ID  
```php
<?php
ini_set('session.cookie_secure', 1);
session_start();
?>
```

#### 設定 HttpOnly 標誌  
防止 JavaScript 存取 Session ID：  
```php
<?php
ini_set('session.cookie_httponly', 1);
session_start();
?>
```

### 2. 防止 Session 固定攻擊  
重新生成 Session ID：  
```php
<?php
session_start();
session_regenerate_id(true); // 生成新的 Session ID
?>
```

### 3. 避免跨站請求偽造 (CSRF)  
生成並驗證 CSRF Token：  
```php
<?php
// 生成 Token
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
```

在表單中包含 Token：  
```html
<input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
```

驗證 Token：  
```php
<?php
if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die('CSRF 驗證失敗！');
}
?>
```

---

## 教學練習  

### 練習 1：Session 基本應用  
設計一個簡單的登入系統，儲存並顯示使用者名稱。  

---

### 練習 2：購物車功能  
使用 Session 儲存購物車中的商品，實現添加、查看與清空購物車的功能。  

---

### 練習 3：CSRF 防禦  
設計一個表單提交功能，實現 CSRF Token 的生成與驗證。  

---

## 教學重點  
- 掌握 PHP Session 的基本操作，包括啟動、設定、讀取與銷毀。  
- 學習如何自定義 Session 配置，如保存位置與生存期。  
- 瞭解 Session 安全性的重要性，並學會實現防護措施，如防止劫持與固定攻擊。  

---
