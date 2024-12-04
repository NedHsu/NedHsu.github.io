---
title: Django - REST API 基礎
date: 2024-01-13 19:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

Django 提供強大的工具集來構建 RESTful API，特別是使用 Django REST Framework (DRF) 時，開發過程變得更加簡單與高效。本日課程將帶你入門 REST API 的基本概念與實作，為日後進階課題奠定基礎。

---

## **課程目標**

1. 瞭解 RESTful API 的基本概念。
2. 學習 Django REST Framework 的基礎用法。
3. 實現簡單的 API，包括 GET、POST、PUT、DELETE。

---

## **課程內容**

### **1. REST API 基本概念**

#### **1.1 REST 是什麼？**

REST（Representational State Transfer）是一種架構風格，通常用於設計網路服務。它的核心理念是基於資源的表現，使用標準的 HTTP 方法進行操作。

#### **1.2 HTTP 方法**

常見的 HTTP 方法及其用途：
| 方法 | 用途 | 操作 |
|--------|---------------|------------------------|
| GET | 獲取資源 | 讀取資料 |
| POST | 創建新資源 | 新增資料 |
| PUT | 更新資源 | 修改現有資料 |
| DELETE | 刪除資源 | 移除資料 |

---

### **2. 安裝 Django REST Framework**

在開始之前，需要安裝 Django REST Framework：

```bash
pip install djangorestframework
```

在 `settings.py` 中添加：

```python
INSTALLED_APPS = [
    ...
    'rest_framework',
]
```

---

### **3. 創建簡單的 API**

#### **3.1 定義模型**

使用上一篇課程的 Blog 系統，假設我們的模型如下：

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```

#### **3.2 建立序列化器**

序列化器負責將模型數據轉換為 JSON 格式，或將 JSON 解析為 Python 對象。
在 `serializers.py` 中：

```python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
```

#### **3.3 創建視圖**

在 `views.py` 中：

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer

class PostList(APIView):
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

#### **3.4 定義路由**

在 `urls.py` 中：

```python
from django.urls import path
from .views import PostList

urlpatterns = [
    path('api/posts/', PostList.as_view(), name='post_list'),
]
```

---

### **4. 測試 API**

#### **4.1 測試工具**

- **Postman**：用於調試 API。
- **curl**：通過命令行測試 API。

#### **4.2 測試範例**

假設應用運行於 `http://127.0.0.1:8000/`，測試範例如下：

**GET 請求：**

```bash
curl http://127.0.0.1:8000/api/posts/
```

**POST 請求：**

```bash
curl -X POST http://127.0.0.1:8000/api/posts/ \
     -H "Content-Type: application/json" \
     -d '{"title": "第一篇文章", "content": "這是內容"}'
```

---

### **5. 簡化 API 開發：使用通用視圖**

DRF 提供了通用視圖類，簡化常見操作的實作。

在 `views.py` 中使用通用視圖：

```python
from rest_framework.generics import ListCreateAPIView
from .models import Post
from .serializers import PostSerializer

class PostListCreate(ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

更新 `urls.py`：

```python
from django.urls import path
from .views import PostListCreate

urlpatterns = [
    path('api/posts/', PostListCreate.as_view(), name='post_list_create'),
]
```

---

### **6. 本日總結**

- 瞭解了 REST API 的基本概念與常用 HTTP 方法。
- 學習了如何使用 Django REST Framework 開發簡單的 API。
- 使用序列化器將數據轉換為 JSON 格式。
- 探索了通用視圖類，簡化 API 開發過程。

---

### **作業**

1. 為 Blog 系統添加 `PUT` 和 `DELETE` 功能，支持更新與刪除文章。
2. 添加驗證功能，確保只有已登入用戶能夠創建新文章。
3. 實現分頁功能，讓 API 每次返回固定數量的文章。

---
