---
title: Django - 練習專案 - 簡單的 Blog 系統
date: 2024-01-07 19:00:00 +0800
categories: [Software, Django]
tags: [Django]
---

今天我們將綜合前幾天所學內容，實作一個簡單的 Blog 系統。本專案將包含文章的新增、瀏覽、編輯與刪除功能，並以視圖、模板與資料庫為基礎，進一步強化對 Django 的理解與應用能力。

---

## **課程目標**

- 設計一個簡單的 Blog 系統模型。
- 實現基本的 CRUD（新增、讀取、更新、刪除）功能。
- 使用 Django 的模板系統渲染頁面。
- 練習表單與數據驗證的應用。

---

## **課程內容**

### **1. 設計 Blog 系統**

#### **1.1 模型設計**

在 `models.py` 中定義 `Post` 模型：

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200, verbose_name="標題")
    content = models.TextField(verbose_name="內容")
    author = models.CharField(max_length=100, verbose_name="作者")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="建立時間")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新時間")

    def __str__(self):
        return self.title
```

#### **1.2 資料庫遷移**

執行以下命令將模型應用到資料庫：

```bash
python manage.py makemigrations
python manage.py migrate
```

---

### **2. 實現功能**

#### **2.1 視圖與路由**

在 `views.py` 中實作文章的 CRUD 功能。

1. **顯示所有文章**：

   ```python
   from django.shortcuts import render, get_object_or_404, redirect
   from .models import Post

   def post_list(request):
       posts = Post.objects.all().order_by('-created_at')
       return render(request, 'blog/post_list.html', {'posts': posts})
   ```

2. **顯示單篇文章**：

   ```python
   def post_detail(request, post_id):
       post = get_object_or_404(Post, id=post_id)
       return render(request, 'blog/post_detail.html', {'post': post})
   ```

3. **新增文章**：

   ```python
   from .forms import PostForm

   def post_create(request):
       if request.method == 'POST':
           form = PostForm(request.POST)
           if form.is_valid():
               form.save()
               return redirect('post_list')
       else:
           form = PostForm()
       return render(request, 'blog/post_form.html', {'form': form})
   ```

4. **編輯文章**：

   ```python
   def post_update(request, post_id):
       post = get_object_or_404(Post, id=post_id)
       if request.method == 'POST':
           form = PostForm(request.POST, instance=post)
           if form.is_valid():
               form.save()
               return redirect('post_detail', post_id=post.id)
       else:
           form = PostForm(instance=post)
       return render(request, 'blog/post_form.html', {'form': form})
   ```

5. **刪除文章**：
   ```python
   def post_delete(request, post_id):
       post = get_object_or_404(Post, id=post_id)
       if request.method == 'POST':
           post.delete()
           return redirect('post_list')
       return render(request, 'blog/post_confirm_delete.html', {'post': post})
   ```

#### **2.2 路由設定**

在 `urls.py` 中設定路由：

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.post_list, name='post_list'),
    path('<int:post_id>/', views.post_detail, name='post_detail'),
    path('create/', views.post_create, name='post_create'),
    path('<int:post_id>/update/', views.post_update, name='post_update'),
    path('<int:post_id>/delete/', views.post_delete, name='post_delete'),
]
```

---

### **3. 表單設計**

#### **3.1 建立表單類別**

在 `forms.py` 中定義表單：

```python
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content', 'author']
```

---

### **4. 模板渲染**

#### **4.1 顯示文章列表**

`templates/blog/post_list.html`：

{% raw %}
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Blog 系統</title>
  </head>
  <body>
    <h1>文章列表</h1>
    <a href="{% url 'post_create' %}">新增文章</a>
    <ul>
      {% for post in posts %}
      <li>
        <a href="{% url 'post_detail' post.id %}">{{ post.title }}</a>
        <p>作者: {{ post.author }} | 時間: {{ post.created_at }}</p>
      </li>
      {% endfor %}
    </ul>
  </body>
</html>
```
{% endraw %}

#### **4.2 顯示單篇文章**

`templates/blog/post_detail.html`：

{% raw %}
```html
<!DOCTYPE html>
<html>
  <head>
    <title>{{ post.title }}</title>
  </head>
  <body>
    <h1>{{ post.title }}</h1>
    <p>{{ post.content }}</p>
    <p>作者: {{ post.author }}</p>
    <p>時間: {{ post.created_at }}</p>
    <a href="{% url 'post_update' post.id %}">編輯</a>
    <form method="post" action="{% url 'post_delete' post.id %}">
      {% csrf_token %}
      <button type="submit">刪除</button>
    </form>
    <a href="{% url 'post_list' %}">返回列表</a>
  </body>
</html>
```
{% endraw %}

#### **4.3 表單模板**

`templates/blog/post_form.html`：

{% raw %}
```html
<!DOCTYPE html>
<html>
  <head>
    <title>文章表單</title>
  </head>
  <body>
    <h1>文章表單</h1>
    <form method="post">
      {% csrf_token %} {{ form.as_p }}
      <button type="submit">提交</button>
    </form>
    <a href="{% url 'post_list' %}">返回列表</a>
  </body>
</html>
```
{% endraw %}

#### **4.4 刪除確認**

`templates/blog/post_confirm_delete.html`：

{% raw %}
```html
<!DOCTYPE html>
<html>
  <head>
    <title>刪除文章</title>
  </head>
  <body>
    <h1>確定要刪除這篇文章嗎？</h1>
    <p>{{ post.title }}</p>
    <p>{{ post.content }}</p>
    <form method="post">
      {% csrf_token %}
      <button type="submit">確定刪除</button>
    </form>
    <a href="{% url 'post_list' %}">取消</a>
  </body>
</html>
```
{% endraw %}

---

### **5. 本日總結**

- 瞭解並實作了完整的 CRUD 功能。
- 熟悉了如何將視圖、模板與表單結合使用。
- 完成了一個功能完整的 Blog 系統練習。

---

### **作業**

1. 新增「分類」功能，讓每篇文章可以有一個分類。
2. 增加文章的「瀏覽次數」功能，每次點擊文章詳情頁時更新數據。
3. 改進樣式，使用 Bootstrap 或其他 CSS 框架美化頁面。

---
