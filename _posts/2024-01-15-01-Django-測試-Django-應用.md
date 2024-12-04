---
title: Django - 測試 Django 應用
date: 2024-01-15 19:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

測試是一個開發專案中不可或缺的部分，它可以確保我們的應用在功能迭代時保持穩定性。Django 提供了強大的測試框架，讓我們能夠輕鬆地測試應用中的視圖、模型和 API。

---

## **課程目標**

1. 瞭解測試的重要性和 Django 測試框架的基礎。
2. 學習如何編寫單元測試和功能測試。
3. 熟悉測試數據庫的使用及常見測試工具。

---

## **課程內容**

### **1. 測試的基本概念**

#### **1.1 為什麼需要測試？**

- 確保代碼功能正確。
- 提高應用的穩定性。
- 節省人工測試的時間。

#### **1.2 測試類型**

- **單元測試**：針對最小功能單元（如函數、方法）的測試。
- **功能測試**：測試整個流程是否按照預期運行。
- **集成測試**：測試多個模塊間的交互是否正常。

---

### **2. Django 測試框架**

Django 提供基於 Python 的 `unittest` 測試框架，並擴展了相關功能，使其與 Django 應用緊密集成。

- 測試文件通常放在應用的 `tests.py` 中。
- 使用 `TestCase` 類來編寫測試。

#### **2.1 執行測試**

使用 `manage.py test` 命令執行測試：

```bash
python manage.py test
```

---

### **3. 編寫測試**

#### **3.1 測試模型**

在 `tasks/tests.py` 中：

```python
from django.test import TestCase
from .models import Task
from django.contrib.auth.models import User

class TaskModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.task = Task.objects.create(
            title='Test Task',
            description='This is a test task.',
            user=self.user
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.user.username, 'testuser')
        self.assertFalse(self.task.completed)

    def test_string_representation(self):
        self.assertEqual(str(self.task), 'Test Task')
```

#### **3.2 測試視圖**

在 `tasks/tests.py` 中：

```python
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task
from django.contrib.auth.models import User

class TaskViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.force_authenticate(user=self.user)
        self.task = Task.objects.create(
            title='Test Task',
            description='This is a test task.',
            user=self.user
        )

    def test_get_tasks(self):
        response = self.client.get(reverse('task_list_create'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_task(self):
        data = {'title': 'New Task', 'description': 'This is a new task.'}
        response = self.client.post(reverse('task_list_create'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    def test_update_task(self):
        data = {'title': 'Updated Task', 'description': 'Updated description.', 'completed': True}
        response = self.client.put(reverse('task_detail', args=[self.task.id]), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task.refresh_from_db()
        self.assertEqual(self.task.title, 'Updated Task')
        self.assertTrue(self.task.completed)

    def test_delete_task(self):
        response = self.client.delete(reverse('task_detail', args=[self.task.id]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.count(), 0)
```

---

### **4. 測試數據庫的使用**

- 測試時 Django 使用一個臨時數據庫（默認基於 SQLite）。
- 測試完成後數據庫會自動刪除，確保數據不會影響實際應用。

---

### **5. 測試最佳實踐**

1. **保持測試簡潔**：每個測試函數只測試一個功能。
2. **使用有意義的名稱**：讓測試名稱清楚描述測試的內容。
3. **測試邊界條件**：確保代碼能處理極端情況。
4. **測試覆蓋率**：確保測試涵蓋所有核心功能。

---

### **6. 本日總結**

- 掌握了 Django 測試框架的基本用法。
- 實現了模型和視圖的單元測試。
- 瞭解測試數據庫的使用和測試的最佳實踐。

---

### **作業**

1. 為任務管理系統添加分頁測試。
2. 為登入與驗證功能編寫測試，確保未授權的用戶無法訪問 API。
3. 撰寫測試來驗證錯誤情況（例如：更新不存在的任務）。

---
