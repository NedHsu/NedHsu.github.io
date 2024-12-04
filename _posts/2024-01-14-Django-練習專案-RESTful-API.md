---
title: Django - 練習專案 - RESTful API
date: 2024-01-14 19:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

今天，我們將綜合運用昨天學到的 REST API 開發技巧，實作一個完整的 RESTful API 練習專案。該專案是一個簡單的 **任務管理系統**，用於管理待辦事項，支持 CRUD 操作、分頁以及用戶驗證。

---

## **課程目標**

1. 實現一個完整的 RESTful API，包含基本的 CRUD 操作。
2. 支持用戶登入後才能管理任務。
3. 加入分頁功能，提升 API 的可用性。
4. 提供詳細的測試計劃，驗證 API 的正確性。

---

## **需求分析**

### **功能列表**

1. **新增任務**：用戶可以新增待辦事項。
2. **查看任務**：支持分頁顯示用戶的所有任務。
3. **更新任務**：用戶可以編輯自己的任務。
4. **刪除任務**：用戶可以刪除指定任務。
5. **用戶驗證**：只有已登入的用戶可以操作任務。

---

## **專案結構**

假設專案名稱為 `task_manager`，應用名稱為 `tasks`，專案結構如下：

```
task_manager/
│
├── tasks/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   ├── views.py
│
├── task_manager/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│
├── manage.py
```

---

## **課程內容**

### **1. 模型設計**

在 `models.py` 中定義任務模型：

```python
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
```

---

### **2. 創建序列化器**

在 `serializers.py` 中：

```python
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
```

---

### **3. 視圖實現**

在 `views.py` 中：

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Task.objects.get(pk=pk, user=user)
        except Task.DoesNotExist:
            return None

    def get(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task)
        return Response(serializer.data)

    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response({"message": "Task deleted."}, status=status.HTTP_204_NO_CONTENT)
```

---

### **4. 定義路由**

在 `urls.py` 中：

```python
from django.urls import path
from .views import TaskListCreateView, TaskDetailView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task_list_create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
]
```

---

### **5. 測試 API**

#### **5.1 測試工具**

使用 Postman 或 curl 測試 API。

#### **5.2 測試範例**

假設伺服器運行於 `http://127.0.0.1:8000/`。

**登入後獲取 Token：**

```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
     -H "Content-Type: application/json" \
     -d '{"username": "user", "password": "password"}'
```

**新增任務：**

```bash
curl -X POST http://127.0.0.1:8000/tasks/ \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "學習 Django", "description": "完成 RESTful API 練習"}'
```

**查看所有任務：**

```bash
curl -X GET http://127.0.0.1:8000/tasks/ \
     -H "Authorization: Bearer <your_token>"
```

**更新任務：**

```bash
curl -X PUT http://127.0.0.1:8000/tasks/1/ \
     -H "Authorization: Bearer <your_token>" \
     -H "Content-Type: application/json" \
     -d '{"title": "學習 Django", "description": "完成所有課程", "completed": true}'
```

**刪除任務：**

```bash
curl -X DELETE http://127.0.0.1:8000/tasks/1/ \
     -H "Authorization: Bearer <your_token>"
```

---

### **6. 本日總結**

- 完成了任務管理系統的 RESTful API 開發。
- 深入學習了用戶驗證、CRUD 操作和分頁的應用。
- 練習使用工具測試 API，驗證其正確性。

---

### **作業**

1. 將 API 添加分頁功能，每頁顯示 5 條任務。
2. 為每個任務新增截止日期欄位，並修改序列化器和視圖。
3. 撰寫單元測試來覆蓋所有的 API 功能。

---
