---
title: Django - REST API 開放功能
date: 2024-01-26 19:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

在現代應用程式開發中，REST API 是後端與前端或第三方服務進行數據交換的重要接口。本節課程將教你如何基於 Django 和 Django REST Framework (DRF) 構建專業的 REST API，並實現 API 認證、授權與開放功能。

---

## **課程目標**

1. 瞭解 REST API 的基本設計原則。
2. 使用 Django REST Framework 構建開放式 API。
3. 實現 API 認證、授權與速率限制功能。
4. 提供開放文檔與測試接口。

---

## **課程內容**

### **1. REST API 設計原則**

- **資源導向**：以資源（Resource）為核心設計，例如 `/api/posts` 表示文章資源。
- **使用 HTTP 方法**：使用 `GET`、`POST`、`PUT`、`DELETE` 等方法操作資源。
- **狀態碼**：使用標準 HTTP 狀態碼（如 `200`、`201`、`404`、`500`）來描述請求結果。
- **統一接口**：統一 URL 格式與數據結構，提升 API 易用性。

---

### **2. 創建 REST API**

#### **基本設定**

在應用中安裝 Django REST Framework：

```bash
pip install djangorestframework
```

在 `settings.py` 中加入：

```python
INSTALLED_APPS += [
    'rest_framework',
]
```

#### **創建序列化器**

序列化器用於將模型數據轉換為 JSON 格式，或將 JSON 數據反序列化為模型數據。

在 `serializers.py` 中：

```python
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'status', 'published_at']
```

#### **創建視圖**

在 `views.py` 中：

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
```

#### **設定路由**

在 `urls.py` 中：

```python
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    # 其他路由
]
urlpatterns += router.urls
```

---

### **3. API 認證與授權**

#### **使用 Token 認證**

安裝 Django REST Framework Token：

```bash
pip install djangorestframework-simplejwt
```

在 `settings.py` 中設定：

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

生成訪問 Token：

```bash
python manage.py migrate
```

在 `urls.py` 中加入 JWT 路由：

```python
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

#### **權限設置**

自定義權限類以控制訪問：

```python
from rest_framework.permissions import BasePermission

class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True
        return obj.author == request.user
```

在視圖中應用：

```python
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthorOrReadOnly]
```

---

### **4. API 文檔與測試接口**

#### **使用 drf-yasg 生成文檔**

安裝工具：

```bash
pip install drf-yasg
```

在 `urls.py` 中配置：

```python
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Blog API",
        default_version='v1',
        description="REST API for Blog",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
```

現在可以訪問 `/swagger/` 查看 Swagger 文檔。

---

### **5. 添加速率限制**

在 `settings.py` 中啟用速率限制：

```python
REST_FRAMEWORK['DEFAULT_THROTTLE_CLASSES'] = [
    'rest_framework.throttling.UserRateThrottle',
    'rest_framework.throttling.AnonRateThrottle',
]
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'user': '1000/day',
    'anon': '100/day',
}
```

---

### **課堂練習**

1. 創建一個 API，支持文章的查詢、創建、編輯與刪除操作。
2. 添加權限控制，僅允許作者編輯或刪除自己的文章。
3. 生成 Swagger 文檔並測試 API 的功能。

---

## **作業**

1. 實現標籤與分類的 REST API，支持查詢與創建操作。
2. 配置速率限制，限制匿名用戶的請求頻率。
3. 使用 Postman 或其他工具測試 API 功能，並嘗試調試 API 錯誤。

---
