---
title: PHP - Cookie 機制 
date: 2023-09-15 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "Cookie 是一種用於在用戶端存儲小量資料的技術，常用於實現用戶識別、偏好設置以及狀態保持等功能。本課程將介紹 PHP 中 Cookie 的基本操作、安全性及應用實踐。"
---

---

## 課程簡介  
Cookie 是一種用於在用戶端存儲小量資料的技術，常用於實現用戶識別、偏好設置以及狀態保持等功能。本課程將介紹 PHP 中 Cookie 的基本操作、安全性及應用實踐。

---

## Cookie 工作原理  
1. **伺服器設定 Cookie**：伺服器通過 HTTP 回應將 Cookie 發送到用戶端瀏覽器。  
2. **瀏覽器儲存 Cookie**：瀏覽器將 Cookie 儲存在本地，並在後續請求中自動回傳。  
3. **伺服器接收 Cookie**：伺服器可通過 `$_COOKIE` 讀取用戶端回傳的 Cookie 資料。

---

## PHP Cookie 基本操作  

### 1. 設定 Cookie  
使用 `setcookie()` 方法：  
```php
<?php
setcookie("username", "Alice", time() + 3600, "/"); // 名稱、值、過期時間、路徑
echo "Cookie 設定成功！";
?>
```

參數說明：  
- `name`：Cookie 的名稱。  
- `value`：Cookie 的值。  
- `expire`：過期時間（Unix 時間戳記）。  
- `path`：Cookie 的有效路徑（如 "/" 表示整個網站有效）。  
- `domain`：Cookie 的有效域名（如 "example.com"）。  
- `secure`：僅通過 HTTPS 傳輸。  
- `httponly`：禁止 JavaScript 存取。  

---

### 2. 讀取 Cookie  
使用 `$_COOKIE` 全域變數：  
```php
<?php
if (isset($_COOKIE["username"])) {
    echo "歡迎回來，" . $_COOKIE["username"] . "！";
} else {
    echo "Cookie 未設定。";
}
?>
```

---

### 3. 刪除 Cookie  
將 Cookie 的過期時間設為過去：  
```php
<?php
setcookie("username", "", time() - 3600, "/");
echo "Cookie 已刪除！";
?>
```

---

## Cookie 安全性  

### 1. 使用 `secure` 屬性  
確保 Cookie 僅在 HTTPS 連線下傳輸：  
```php
<?php
setcookie("username", "Alice", time() + 3600, "/", "", true);
?>
```

---

### 2. 使用 `httponly` 屬性  
防止 JavaScript 存取 Cookie，降低 XSS 攻擊風險：  
```php
<?php
setcookie("username", "Alice", time() + 3600, "/", "", true, true);
?>
```

---

### 3. 限制有效範圍  
使用 `path` 和 `domain` 限制 Cookie 的有效範圍，避免被其他路徑或子域濫用。  
```php
<?php
setcookie("username", "Alice", time() + 3600, "/admin", "example.com");
?>
```

---

## Cookie 與 Session 的比較  
| **特性**         | **Cookie**                              | **Session**                             |
|------------------|----------------------------------------|-----------------------------------------|
| **存儲位置**      | 用戶端瀏覽器                           | 伺服器端                               |
| **資料大小限制**  | 通常為 4KB                              | 依伺服器可用資源                       |
| **安全性**        | 容易被用戶端修改                       | 更安全，儲存在伺服器端                 |
| **生命週期**      | 可設定長期有效                        | 預設隨瀏覽器關閉或 Session 過期失效    |
| **應用場合**      | 儲存偏好設置、輕量級資料               | 儲存敏感資料如登入狀態、用戶數據等     |

---

## Cookie 實踐範例  

### 範例 1：記住使用者  
在登入頁面設定 Cookie 記住使用者名稱：  
```php
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = $_POST["username"];
    setcookie("username", $username, time() + (86400 * 30), "/"); // 30 天
    echo "歡迎，" . $username . "！";
}
?>
<form method="post">
    <input type="text" name="username" placeholder="輸入使用者名稱">
    <button type="submit">提交</button>
</form>
```

---

### 範例 2：實現暗色模式偏好  
使用 Cookie 儲存使用者的主題偏好：  
```php
<?php
if (isset($_POST["theme"])) {
    $theme = $_POST["theme"];
    setcookie("theme", $theme, time() + (86400 * 30), "/");
}

$theme = isset($_COOKIE["theme"]) ? $_COOKIE["theme"] : "light";
?>
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            background-color: <?= $theme === "dark" ? "#333" : "#FFF" ?>;
            color: <?= $theme === "dark" ? "#FFF" : "#000" ?>;
        }
    </style>
</head>
<body>
    <form method="post">
        <label>
            <input type="radio" name="theme" value="light" <?= $theme === "light" ? "checked" : "" ?>> 明亮模式
        </label>
        <label>
            <input type="radio" name="theme" value="dark" <?= $theme === "dark" ? "checked" : "" ?>> 暗色模式
        </label>
        <button type="submit">儲存偏好</button>
    </form>
</body>
</html>
```

---

## 教學練習  

### 練習 1：記住使用者名稱  
設計一個表單，輸入名稱後在下一次訪問時顯示 "歡迎回來，XXX！"。  

---

### 練習 2：儲存語言偏好  
使用 Cookie 儲存使用者選擇的語言，並根據語言顯示不同的歡迎訊息。  

---

### 練習 3：暗色模式切換  
實現頁面主題顏色切換，並記住使用者的選擇。  

---

## 教學重點  
- 掌握 PHP 中 Cookie 的基本操作，包括設定、讀取與刪除。  
- 理解 Cookie 的屬性及其對應的安全性應用。  
- 熟悉 Cookie 在實際項目中的應用場景，如用戶偏好儲存與輕量級狀態保持。  

---
