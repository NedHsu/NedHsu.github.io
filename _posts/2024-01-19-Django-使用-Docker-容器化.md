---
title: Django - 使用 Docker 容器化
date: 2024-01-19 19:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

Docker 是一種輕量級的容器技術，能夠將應用與其所有依賴打包到一個可移植的容器中，實現跨平台的一致性部署。今天，我們將學習如何使用 Docker 將 Django 應用容器化。

---

## **課程目標**

1. 瞭解 Docker 和 Docker Compose 的基本概念。
2. 使用 Dockerfile 容器化 Django 應用。
3. 使用 Docker Compose 同時運行 Django 和 PostgreSQL。
4. 部署容器化的 Django 應用。

---

## **課程內容**

### **1. Docker 基本概念**

- **Docker 容器**：應用的運行環境，包含應用及其依賴項。
- **Docker 映像（Image）**：容器的模板，可以從 Dockerfile 构建。
- **Docker Compose**：用於管理多個容器的工具，通過 `docker-compose.yml` 文件描述服務。

---

### **2. 創建 Dockerfile**

#### **步驟 1：創建 Dockerfile**

在 Django 項目根目錄創建名為 `Dockerfile` 的文件：

```dockerfile
# 基礎映像
FROM python:3.10-slim

# 設置工作目錄
WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && apt-get clean

# 複製需求文件並安裝 Python 依賴
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 複製 Django 應用程式代碼
COPY . .

# 收集靜態文件
RUN python manage.py collectstatic --noinput

# 暴露端口
EXPOSE 8000

# 啟動命令
CMD ["gunicorn", "-b", "0.0.0.0:8000", "myproject.wsgi:application"]
```

---

### **3. 創建 Docker Compose 配置**

#### **步驟 1：安裝 Docker Compose**

如果未安裝 Docker Compose，可以參考 [官方文檔](https://docs.docker.com/compose/install/)。

#### **步驟 2：創建 `docker-compose.yml`**

在項目根目錄創建 `docker-compose.yml`：

```yaml
version: "3.9"

services:
  web:
    build: .
    container_name: django_web
    command: gunicorn -b 0.0.0.0:8000 myproject.wsgi:application
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://myprojectuser:password@db:5432/myprojectdb

  db:
    image: postgres:14
    container_name: django_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: myprojectuser
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myprojectdb

volumes:
  postgres_data:
```

---

### **4. 運行 Docker 容器**

#### **步驟 1：構建容器映像**

在項目目錄中運行以下命令：

```bash
docker-compose build
```

#### **步驟 2：啟動服務**

啟動所有服務：

```bash
docker-compose up
```

訪問 `http://localhost:8000`，檢查 Django 應用是否正常運行。

#### **步驟 3：後台運行容器**

```bash
docker-compose up -d
```

#### **步驟 4：查看容器日誌**

```bash
docker-compose logs
```

---

### **5. 配置環境變數**

為了提高安全性，我們可以使用 `.env` 文件存儲環境變數。

#### **步驟 1：創建 `.env` 文件**

```env
DATABASE_URL=postgres://myprojectuser:password@db:5432/myprojectdb
DEBUG=False
SECRET_KEY=your-secret-key
```

#### **步驟 2：在 `docker-compose.yml` 中載入環境變數**

```yaml
web:
  ...
  env_file:
    - .env
db:
  ...
  env_file:
    - .env
```

---

### **6. 生產環境配置**

#### **步驟 1：啟用 HTTPS**

在 Nginx 中配置 SSL，建議使用 Let's Encrypt。

#### **步驟 2：配置 Gunicorn 工作進程**

根據伺服器資源調整 Gunicorn 的工作進程數量：

```dockerfile
CMD ["gunicorn", "-b", "0.0.0.0:8000", "-w", "3", "myproject.wsgi:application"]
```

#### **步驟 3：優化數據庫連接**

確保在生產環境中使用持久化數據卷儲存 PostgreSQL 數據。

---

## **課堂練習**

1. 將 Day 17 的 Blog 應用容器化，並測試本地運行效果。
2. 使用 Docker Compose 同時運行 Django 和 PostgreSQL，確保數據能正常保存到數據庫中。
3. 配置環境變數文件，避免將敏感信息暴露在代碼中。

---

## **作業**

1. 嘗試整合 Redis 到 Docker Compose 中，用於快取和 Celery 後台任務調度。
2. 配置 Docker 化的 Nginx，並將應用部署到伺服器，啟用 HTTPS。
3. 使用 Docker Swarm 或 Kubernetes 實現容器編排，探索更高效的部署方式。

---
