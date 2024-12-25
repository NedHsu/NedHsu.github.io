---
title: Django - 部署 - Windows
date: 2024-01-18 20:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

以下是如何在 **Windows 系統** 上部署 Django 應用的完整指南，包含所需的步驟和注意事項。

---

## **目標**
- 部署 Django 應用於 Windows 系統，並使用 **Gunicorn** 或 **Waitress** 作為 WSGI 服務器，配合 **Nginx** 或 **IIS** 提供靜態文件與媒體文件服務。
- 支持 `DEBUG=False` 的生產環境設置。

---

## **1. 安裝必要工具**
### **1.1 安裝 Python**
1. 下載並安裝最新版本的 Python：
   [Python 官方網站](https://www.python.org/)
2. 在安裝過程中，勾選 **"Add Python to PATH"** 選項。

### **1.2 安裝 Virtualenv**
使用虛擬環境管理 Django 項目的依賴項：
```bash
pip install virtualenv
```

---

## **2. 建立 Django 項目虛擬環境**
1. 移動到項目目錄：
   ```bash
   cd your_project_directory
   ```

2. 創建虛擬環境：
   ```bash
   virtualenv venv
   ```

3. 啟用虛擬環境：
   ```bash
   venv\Scripts\activate
   ```

4. 安裝項目依賴項：
   ```bash
   pip install -r requirements.txt
   ```

---

## **3. 配置 Django 生產設置**

1. 編輯 `settings.py` 文件，設置生產環境配置：

   ### **關鍵設置**
   ```python
   DEBUG = False  # 關閉除錯模式
   ALLOWED_HOSTS = ['your-domain.com', 'localhost']

   # 靜態文件設置
   STATIC_URL = '/static/'
   STATIC_ROOT = BASE_DIR / 'staticfiles'

   # 媒體文件設置
   MEDIA_URL = '/media/'
   MEDIA_ROOT = BASE_DIR / 'mediafiles'
   ```

2. 收集靜態文件：
   ```bash
   python manage.py collectstatic
   ```

---

## **4. 部署 WSGI 服務器**

### **選擇服務器**
在 Windows 上，推薦使用 **Waitress** 作為 WSGI 服務器。

1. 安裝 Waitress：
   ```bash
   pip install waitress
   ```

2. 啟動服務器：
   ```bash
   waitress-serve --port=8000 your_project.wsgi:application
   ```

3. 服務器應在 `http://127.0.0.1:8000` 提供服務。

---

## **5. 配置 Nginx 或 IIS**

### **選擇 1：Nginx**
Nginx 可以作為反向代理來處理靜態文件和媒體文件。

1. 安裝 Nginx for Windows：
   Nginx for Windows [Nginx for Windows](http://nginx.org/en/download.html)

2. 配置 Nginx：
   編輯 `nginx.conf` 文件，添加如下配置：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;  # 指向 Waitress 服務器
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       location /static/ {
           alias C:/path_to_your_project/staticfiles/;
       }

       location /media/ {
           alias C:/path_to_your_project/mediafiles/;
       }
   }
   ```

3. 啟動 Nginx：
   ```bash
   nginx.exe
   ```

### **選擇 2：IIS**
如果使用 **Internet Information Services (IIS)**，需要配置 CGI 支持和反向代理。

1. **啟用 CGI 支持**：
   - 進入「控制台」 > 「程式與功能」 > 「開啟或關閉 Windows 功能」。
   - 勾選「IIS 管理員」和「CGI」模組。

2. **配置反向代理**：
   - 安裝 IIS 的 URL Rewrite 模組。
   - 配置將所有請求代理到 `http://127.0.0.1:8000`。

---

## **6. 配置數據庫**
### **使用 PostgreSQL**
1. 安裝 PostgreSQL：
   [PostgreSQL 官方網站](https://www.postgresql.org/download/)

2. 更新 `settings.py` 的數據庫配置：
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'your_database',
           'USER': 'your_user',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

3. 應用遷移：
   ```bash
   python manage.py migrate
   ```

---

## **7. 測試應用**
1. 訪問你的應用（通過 Nginx 或 IIS）。
2. 驗證靜態文件和媒體文件是否正確提供。
3. 測試數據庫連接和應用功能。

---

## **8. 自動化部署**
為了提高生產效率，可以使用以下工具：
1. **使用 PowerShell 腳本** 自動啟動 Waitress 和 Nginx。
2. **監控與重啟工具**，如 Supervisor 或 Windows 服務。

---

## **注意事項**
1. **DEBUG=False** 時，務必設置 `ALLOWED_HOSTS`。
2. 確保靜態文件路徑和權限正確。
3. 定期檢查依賴項和系統更新。

這樣，你的 Django 應用已成功部署在 Windows 系統上！
