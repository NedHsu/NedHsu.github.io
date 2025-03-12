---
title: Flask - SQLAlchemy 數據庫操作
date: 2024-12-09 19:00:00 +0800
categories: [Software, Python]
tags: [Flask]
excerpt: "深入使用 Flask-SQLAlchemy 進行數據庫操作，實現更複雜的查詢、更新和刪除，並熟悉 SQLAlchemy 的基本語法。"
---

## **目標**

- 實現基本的數據庫 CRUD 操作
- 學習 SQLAlchemy 的查詢語法
- 增強待辦事項 API 的功能

## **步驟**

1. **準備環境**

   - 繼續使用第 8 天的 `flask_api/` 項目結構，確保虛擬環境已激活：
     ```bash
     # Windows: flask_api_env\Scripts\activate
     # macOS/Linux: source flask_api_env/bin/activate
     ```

2. **更新模型**

   - 修改 **app/models.py**，為 `Todo` 模型添加更多字段以支持豐富的查詢：

     ```python
     from . import db
     from datetime import datetime

     class Todo(db.Model):
         __tablename__ = 'todos'
         id = db.Column(db.Integer, primary_key=True)
         title = db.Column(db.String(100), nullable=False)
         completed = db.Column(db.Boolean, default=False)
         created_at = db.Column(db.DateTime, default=datetime.utcnow)
         description = db.Column(db.String(255), nullable=True)  # 新增描述字段

         def to_dict(self):
             return {
                 'id': self.id,
                 'title': self.title,
                 'completed': self.completed,
                 'created_at': self.created_at.isoformat(),
                 'description': self.description
             }
     ```

   - **注意**：由於表結構改變，需刪除現有的 `todos.db` 文件並重新運行應用以重建表。

3. **增強路由功能**

   - 修改 **app/routes/todos.py**，實現更複雜的數據庫操作：

     ```python
     from flask import Blueprint, jsonify, request, abort
     from ..models import Todo
     from .. import db

     todos_bp = Blueprint('todos', __name__)

     # GET - 獲取所有任務（支持過濾和排序）
     @todos_bp.route('/todos', methods=['GET'])
     def get_todos():
         completed = request.args.get('completed', type=lambda x: x.lower() == 'true')
         search = request.args.get('search')  # 搜索標題或描述
         sort = request.args.get('sort', 'id')  # 排序字段：id 或 created_at

         query = Todo.query
         if completed is not None:
             query = query.filter_by(completed=completed)
         if search:
             query = query.filter(
                 db.or_(Todo.title.ilike(f'%{search}%'), Todo.description.ilike(f'%{search}%'))
             )
         if sort == 'created_at':
             query = query.order_by(Todo.created_at.desc())
         else:
             query = query.order_by(Todo.id.asc())

         todos = query.all()
         return jsonify({'todos': [todo.to_dict() for todo in todos]})

     # GET - 獲取單個任務
     @todos_bp.route('/todos/<int:todo_id>', methods=['GET'])
     def get_todo(todo_id):
         todo = Todo.query.get_or_404(todo_id, description='Todo not found')
         return jsonify(todo.to_dict())

     # POST - 創建新任務
     @todos_bp.route('/todos', methods=['POST'])
     def create_todo():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' not in data:
             abort(400, description='Missing title')
         todo = Todo(
             title=data['title'],
             completed=data.get('completed', False),
             description=data.get('description')
         )
         db.session.add(todo)
         db.session.commit()
         return jsonify(todo.to_dict()), 201

     # PUT - 更新任務
     @todos_bp.route('/todos/<int:todo_id>', methods=['PUT'])
     def update_todo(todo_id):
         todo = Todo.query.get_or_404(todo_id, description='Todo not found')
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' in data:
             todo.title = data['title']
         if 'completed' in data and isinstance(data['completed'], bool):
             todo.completed = data['completed']
         if 'description' in data:
             todo.description = data['description']
         db.session.commit()
         return jsonify(todo.to_dict()), 200

     # DELETE - 刪除任務
     @todos_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
     def delete_todo(todo_id):
         todo = Todo.query.get_or_404(todo_id, description='Todo not found')
         db.session.delete(todo)
         db.session.commit()
         return jsonify({'message': 'Todo deleted'}), 200
     ```

   - **代碼解釋**：
     - `filter_by`：精確匹配（例如 `completed=True`）。
     - `ilike`：不區分大小写的模糊匹配，用於搜索。
     - `db.or_`：組合多個條件。
     - `order_by`：按指定字段排序，`desc()` 表示降序。

4. **運行應用**

   - 刪除舊的 `todos.db`（如果存在），然後運行：
     ```bash
     python run.py
     ```
   - 這會重新創建數據庫表。

5. **測試 API**

   - 使用 Postman 測試：
     - **POST /api/v1/todos**（創建數據）：
       - Body：`{"title": "Learn SQLAlchemy", "description": "Study database operations", "completed": false}`
       - 預期響應：`{"id": 1, "title": "Learn SQLAlchemy", "completed": false, "created_at": "...", "description": "Study database operations"}`
     - **POST /api/v1/todos**（再添加一條）：
       - Body：`{"title": "Build API", "description": "Create a Flask API", "completed": true}`
     - **GET /api/v1/todos?completed=true**：
       - 預期響應：包含 `completed` 為 true 的任務。
     - **GET /api/v1/todos?search=flask**：
       - 預期響應：包含 "flask" 在標題或描述中的任務。
     - **GET /api/v1/todos?sort=created_at**：
       - 預期響應：按創建時間降序排列的任務列表。
     - **PUT /api/v1/todos/1**：
       - Body：`{"description": "Updated description"}`
       - 預期響應：更新後的任務。
     - **DELETE /api/v1/todos/2**：
       - 預期響應：`{"message": "Todo deleted"}`

6. **作業**
   - 添加一個批量刪除端點 `DELETE /api/v1/todos`，接受 JSON 數組（例如 `{"ids": [1, 2]}`）並刪除多個任務。
   - 在 GET `/todos` 中添加分頁功能（提示：使用 `limit` 和 `offset`）。

---

## **注意事項**

- 如果表結構改變（如新增字段），需重建數據庫（刪除 `todos.db` 並重新運行）。
- `ilike` 需要字符串兩側加 `%`，用於模糊查詢。

---
