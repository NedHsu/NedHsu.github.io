---
title: Django - `settings.py` 文件的各項配置
date: 2024-01-01 21:00:00 +0800
categories: [Software, Django]
tags: [Django]
excerpt: " Django 項目中 `settings.py` 文件的各項配置及其含義介紹"
---

以下是 Django 項目中 `settings.py` 文件的各項配置及其含義介紹：

---

## **1. 基本配置**

### **`BASE_DIR`**

- 定義專案的基礎目錄。
- 用於生成專案中相對路徑。
- 典型定義：
  ```python
  BASE_DIR = Path(__file__).resolve().parent.parent
  ```

### **`SECRET_KEY`**

- 專案的加密密鑰，用於加密會話資料和密碼。
- 需保密，特別是在生產環境中。
- 例：
  ```python
  SECRET_KEY = 'your-secret-key'
  ```

### **`DEBUG`**

- 是否啟用調試模式：
  - **`True`**：啟用，顯示詳細的錯誤報告（開發環境）。
  - **`False`**：禁用，提升安全性（生產環境）。
  ```python
  DEBUG = True
  ```

### **`ALLOWED_HOSTS`**

- 定義允許訪問的主機列表。
- 空列表允許任何主機（僅在 `DEBUG=True` 時有效）。
- 範例：
  ```python
  ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'yourdomain.com']
  ```

---

## **2. 應用與中介軟體**

### **`INSTALLED_APPS`**

- 註冊 Django 和第三方應用的列表。
- 預設應用：
  ```python
  INSTALLED_APPS = [
      'django.contrib.admin',          # 管理後台
      'django.contrib.auth',           # 用戶認證
      'django.contrib.contenttypes',   # 支援內容類型
      'django.contrib.sessions',       # 會話支持
      'django.contrib.messages',       # 消息框架
      'django.contrib.staticfiles',    # 靜態文件管理
  ]
  ```

### **`MIDDLEWARE`**

- 定義中介軟體的列表，處理請求與響應的各個階段。
- 預設中介軟體範例：
  ```python
  MIDDLEWARE = [
      'django.middleware.security.SecurityMiddleware',          # 安全相關
      'django.contrib.sessions.middleware.SessionMiddleware',   # 會話支持
      'django.middleware.common.CommonMiddleware',              # 通用功能
      'django.middleware.csrf.CsrfViewMiddleware',              # 防範 CSRF
      'django.contrib.auth.middleware.AuthenticationMiddleware',# 用戶認證
      'django.contrib.messages.middleware.MessageMiddleware',   # 消息框架
      'django.middleware.clickjacking.XFrameOptionsMiddleware', # 防範點擊劫持
  ]
  ```

---

## **3. URL 和 WSGI 配置**

### **`ROOT_URLCONF`**

- 指定專案的 URL 配置模組。
- 預設值：
  ```python
  ROOT_URLCONF = 'myproject.urls'
  ```

### **`WSGI_APPLICATION`**

- 指定專案的 WSGI 應用入口。
- 用於部署 Django。
- 預設值：
  ```python
  WSGI_APPLICATION = 'myproject.wsgi.application'
  ```

---

## **4. 資料庫**

### **`DATABASES`**

- 定義專案使用的資料庫。
- 預設為 SQLite：
  ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.sqlite3',  # 資料庫引擎
          'NAME': BASE_DIR / 'db.sqlite3',        # 資料庫名稱
      }
  }
  ```
- 更換為 PostgreSQL：
  ```python
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.postgresql',
          'NAME': 'mydatabase',
          'USER': 'myuser',
          'PASSWORD': 'mypassword',
          'HOST': 'localhost',  # 或資料庫伺服器地址
          'PORT': '5432',       # PostgreSQL 預設端口
      }
  }
  ```

---

## **5. 語言與時區**

### **`LANGUAGE_CODE`**

- 預設語言代碼。
- 範例：
  ```python
  LANGUAGE_CODE = 'en-us'  # 英文（美國）
  LANGUAGE_CODE = 'zh-hant'  # 繁體中文
  ```

### **`TIME_ZONE`**

- 預設時區。
- 範例：
  ```python
  TIME_ZONE = 'UTC'       # 協調世界時間
  TIME_ZONE = 'Asia/Taipei'  # 台北時間
  ```

### **`USE_I18N`**

- 是否啟用國際化支持（多語言功能）。
  ```python
  USE_I18N = True
  ```

### **`USE_TZ`**

- 是否啟用時區支持。
  ```python
  USE_TZ = True
  ```

---

## **6. 靜態與媒體文件**

### **`STATIC_URL`**

- 設定靜態文件的 URL 前綴。
  ```python
  STATIC_URL = '/static/'
  ```

### **`STATICFILES_DIRS`**

- 定義靜態文件所在的附加目錄列表。
  ```python
  STATICFILES_DIRS = [BASE_DIR / 'static']
  ```

### **`MEDIA_URL` 與 `MEDIA_ROOT`**

- 配置媒體文件的 URL 和存放目錄。
  ```python
  MEDIA_URL = '/media/'
  MEDIA_ROOT = BASE_DIR / 'media'
  ```

---

## **7. 日誌與其他配置**

### **`LOGGING`**

- 定義日誌配置。
- 範例：
  ```python
  LOGGING = {
      'version': 1,
      'disable_existing_loggers': False,
      'handlers': {
          'console': {
              'class': 'logging.StreamHandler',
          },
      },
      'root': {
          'handlers': ['console'],
          'level': 'DEBUG',
      },
  }
  ```

### **`DEFAULT_AUTO_FIELD`**

- 用於指定自動生成主鍵的字段類型。
  ```python
  DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
  ```

---

這些配置項目是 `settings.py` 的基礎內容，根據專案需求可以進一步擴展和調整，例如添加第三方庫的設置或自定義配置項目。
