---
title: Flask - SQLAlchemy 入門
date: 2024-12-08 19:00:00 +0800
categories: [Software, Python]
tags: [Flask]
excerpt: "使用 **Flask-SQLAlchemy** 來設置 SQLite 數據庫，並創建第一個數據模型。"
---

## **目標**

- 安裝並配置 Flask-SQLAlchemy
- 使用 SQLite 作為數據庫
- 創建第一個數據模型並與數據庫交互

## **步驟**

1. **準備環境**

   - 繼續使用 `flask_api/` 項目結構，激活虛擬環境：
     ```bash
     # Windows: flask_api_env\Scripts\activate
     # macOS/Linux: source flask_api_env/bin/activate
     ```
   - 安裝 Flask-SQLAlchemy：
     ```bash
     pip install flask-sqlalchemy
     ```

2. **配置 Flask-SQLAlchemy**

   - 修改 **app/config.py**，添加數據庫配置：

     ```python
     import os

     class Config:
         DEBUG = True
         SQLALCHEMY_DATABASE_URI = 'sqlite:///todos.db'  # SQLite 文件存儲在項目根目錄
         SQLALCHEMY_TRACK_MODIFICATIONS = False  # 禁用修改跟踪以提升性能
     ```

   - 修改 **app/**init**.py**，初始化 SQLAlchemy：

     ```python
     from flask import Flask, jsonify
     from flask_sqlalchemy import SQLAlchemy
     from .routes.todos import todos_bp

     db = SQLAlchemy()  # 初始化 SQLAlchemy

     def create_app():
         app = Flask(__name__)
         app.config.from_object('app.config.Config')

         # 初始化數據庫
         db.init_app(app)

         # 註冊藍圖
         app.register_blueprint(todos_bp, url_prefix='/api/v1')

         # 錯誤處理器
         @app.errorhandler(404)
         def not_found(error):
             return jsonify({
                 'error': 'Not Found',
                 'message': str(error)
             }), 404

         @app.errorhandler(400)
         def bad_request(error):
             return jsonify({
                 'error': 'Bad Request',
                 'message': str(error)
             }), 400

         @app.errorhandler(500)
         def internal_error(error):
             return jsonify({
                 'error': 'Internal Server Error',
                 'message': 'Something went wrong on our end'
             }), 500

         # 創建數據庫表（僅在第一次運行時需要）
         with app.app_context():
             db.create_all()

         return app
     ```

3. **創建數據模型**

   - 新建 **app/models.py**，定義待辦事項模型：

     ```python
     from . import db

     class Todo(db.Model):
         __tablename__ = 'todos'
         id = db.Column(db.Integer, primary_key=True)
         title = db.Column(db.String(100), nullable=False)
         completed = db.Column(db.Boolean, default=False)

         def to_dict(self):
             return {
                 'id': self.id,
                 'title': self.title,
                 'completed': self.completed
             }
     ```

   - **代碼解釋**：
     - `db.Model`：SQLAlchemy 的基類，用於定義模型。
     - `db.Column`：定義數據庫表的列。
     - `to_dict()`：將模型轉換為字典，便於 JSON 序列化。

4. **更新路由**

   - 修改 **app/routes/todos.py**，使用數據庫替代字典：

     ```python
     from flask import Blueprint, jsonify, request, abort
     from ..models import Todo
     from .. import db

     todos_bp = Blueprint('todos', __name__)

     # GET - 獲取所有任務
     @todos_bp.route('/todos', methods=['GET'])
     def get_todos():
         completed = request.args.get('completed', type=lambda x: x.lower() == 'true')
         query = Todo.query
         if completed is not None:
             query = query.filter_by(completed=completed)
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
             completed=data.get('completed', False)
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
     - `Todo.query`：SQLAlchemy 的查詢對象。
     - `db.session`：管理數據庫事務，需提交（`commit`）或回滾。
     - `get_or_404`：若找不到記錄，自動拋出 404。

5. **運行應用**

   - 運行：
     ```bash
     python run.py
     ```
   - 第一次運行時，SQLite 會在 `flask_api/` 目錄下創建 `todos.db` 文件。

6. **測試 API**

   - 使用 Postman 測試：
     - **POST /api/v1/todos**：
       - Body：`{"title": "Learn SQLAlchemy", "completed": false}`
       - 預期響應：`{"id": 1, "title": "Learn SQLAlchemy", "completed": false}`
     - **GET /api/v1/todos**：
       - 預期響應：`{"todos": [{"id": 1, "title": "Learn SQLAlchemy", "completed": false}]}`
     - **PUT /api/v1/todos/1**：
       - Body：`{"completed": true}`
       - 預期響應：`{"id": 1, "title": "Learn SQLAlchemy", "completed": true}`
     - **DELETE /api/v1/todos/1**：
       - 預期響應：`{"message": "Todo deleted"}`
     - **GET /api/v1/todos/999**：
       - 預期響應：`{"error": "Not Found", "message": "404 Not Found: Todo not found"}`

7. **作業**
   - 在 `Todo` 模型中添加一個 `created_at` 字段（`db.DateTime`，默認為當前時間），並更新相關路由。
   - 測試數據是否在重啟應用後仍然保留。

---

## **注意事項**

- 如果 `todos.db` 已存在且結構改變，需刪除文件並重新運行以重建表。
- 確保導入路徑正確，例如 `from ..models import Todo`。

---
