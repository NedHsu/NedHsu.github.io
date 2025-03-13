---
title: Flask - Blog API
date: 2024-12-14 19:00:00 +0800
categories: [Software, Python]
tags: [Flask]
excerpt: "構建一個更複雜的 **Blog API**，支持用戶和文章的 CRUD 操作。這是一個實戰項目，涵蓋數據庫、模型關係、序列化和版本控制。"
---

## **目標**

- 構建一個完整的Blog API
- 應用數據庫操作、模型關係、序列化和環境配置
- 提供 v1 和 v2 版本的端點

## **項目需求**

- **模型**：
  - `User`：用戶（id, username）
  - `Post`：文章（id, title, content, created_at, user_id）
- **端點**：
  - `/api/v1/users`：用戶 CRUD
  - `/api/v1/posts`：文章 CRUD
  - `/api/v2/posts`：v2 版本，添加文章分類（category）支持
- **功能**：
  - 用戶可以創建、查看文章
  - 支持按用戶或分類過濾文章

## **步驟**

1. **準備環境**

   - 使用現有 `flask_api/` 結構，激活虛擬環境：
     ```bash
     # Windows: flask_api_env\Scripts\activate
     # macOS/Linux: source flask_api_env/bin/activate
     ```
   - 確保已安裝依賴：`flask-sqlalchemy`、`flask-marshmallow`、`python-dotenv`。

2. **設置配置文件**

   - 使用第 13 天的 **app/config.py**，確保 `.env` 包含：
     ```
     FLASK_ENV=development
     SECRET_KEY=your-secret-key
     DATABASE_URL=sqlite:///blog.db
     ```

3. **定義模型**

   - 修改 **app/models.py**：

     ```python
     from . import db
     from datetime import datetime

     class User(db.Model):
         __tablename__ = 'users'
         id = db.Column(db.Integer, primary_key=True)
         username = db.Column(db.String(50), unique=True, nullable=False)
         posts = db.relationship('Post', backref='user', lazy=True)

     class Post(db.Model):
         __tablename__ = 'posts'
         id = db.Column(db.Integer, primary_key=True)
         title = db.Column(db.String(100), nullable=False)
         content = db.Column(db.Text, nullable=False)
         created_at = db.Column(db.DateTime, default=datetime.utcnow)
         user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
         category = db.Column(db.String(50), default='general')  # v2 新增
     ```

4. **定義序列化器**

   - 修改 **app/schemas.py**：

     ```python
     from . import ma
     from .models import User, Post

     class PostSchema(ma.SQLAlchemyAutoSchema):
         class Meta:
             model = Post
             include_fk = True
             fields = ('id', 'title', 'content', 'created_at', 'user_id', 'category')

     class UserSchema(ma.SQLAlchemyAutoSchema):
         class Meta:
             model = User
             fields = ('id', 'username', 'posts')
         posts = ma.Nested('PostSchema', many=True)

     post_schema = PostSchema()
     posts_schema = PostSchema(many=True)
     user_schema = UserSchema()
     users_schema = UserSchema(many=True)
     ```

5. **實現 v1 路由**

   - **app/routes/v1/users.py**：

     ```python
     from flask import Blueprint, jsonify, request, abort
     from ...models import User
     from ... import db
     from ...schemas import user_schema, users_schema

     users_bp = Blueprint('users_v1', __name__)

     @users_bp.route('/users', methods=['GET'])
     def get_users():
         users = User.query.all()
         return jsonify({'users': users_schema.dump(users)})

     @users_bp.route('/users', methods=['POST'])
     def create_user():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'username' not in data:
             abort(400, description='Missing username')
         if User.query.filter_by(username=data['username']).first():
             abort(400, description='Username already exists')
         user = User(username=data['username'])
         db.session.add(user)
         db.session.commit()
         return jsonify(user_schema.dump(user)), 201
     ```

   - **app/routes/v1/posts.py**（新建）：

     ```python
     from flask import Blueprint, jsonify, request, abort
     from ...models import Post, User
     from ... import db
     from ...schemas import post_schema, posts_schema

     posts_bp = Blueprint('posts_v1', __name__)

     @posts_bp.route('/posts', methods=['GET'])
     def get_posts():
         user_id = request.args.get('user_id', type=int)
         query = Post.query
         if user_id:
             query = query.filter_by(user_id=user_id)
         posts = query.all()
         return jsonify({'posts': posts_schema.dump(posts)})

     @posts_bp.route('/posts/<int:post_id>', methods=['GET'])
     def get_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         return jsonify(post_schema.dump(post))

     @posts_bp.route('/posts', methods=['POST'])
     def create_post():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' not in data or 'content' not in data or 'user_id' not in data:
             abort(400, description='Missing title, content, or user_id')
         if not User.query.get(data['user_id']):
             abort(400, description='User not found')
         post = Post(
             title=data['title'],
             content=data['content'],
             user_id=data['user_id']
         )
         db.session.add(post)
         db.session.commit()
         return jsonify(post_schema.dump(post)), 201

     @posts_bp.route('/posts/<int:post_id>', methods=['PUT'])
     def update_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' in data:
             post.title = data['title']
         if 'content' in data:
             post.content = data['content']
         db.session.commit()
         return jsonify(post_schema.dump(post)), 200

     @posts_bp.route('/posts/<int:post_id>', methods=['DELETE'])
     def delete_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         db.session.delete(post)
         db.session.commit()
         return jsonify({'message': 'Post deleted'}), 200
     ```

6. **實現 v2 路由**

   - **app/routes/v2/posts.py**（新建）：

     ```python
     from flask import Blueprint, jsonify, request, abort
     from ...models import Post, User
     from ... import db
     from ...schemas import post_schema, posts_schema

     posts_bp = Blueprint('posts_v2', __name__)

     @posts_bp.route('/posts', methods=['GET'])
     def get_posts():
         user_id = request.args.get('user_id', type=int)
         category = request.args.get('category')
         query = Post.query
         if user_id:
             query = query.filter_by(user_id=user_id)
         if category:
             query = query.filter_by(category=category)
         posts = query.all()
         return jsonify({'posts': posts_schema.dump(posts)})

     @posts_bp.route('/posts/<int:post_id>', methods=['GET'])
     def get_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         return jsonify(post_schema.dump(post))

     @posts_bp.route('/posts', methods=['POST'])
     def create_post():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' not in data or 'content' not in data or 'user_id' not in data:
             abort(400, description='Missing title, content, or user_id')
         if not User.query.get(data['user_id']):
             abort(400, description='User not found')
         post = Post(
             title=data['title'],
             content=data['content'],
             user_id=data['user_id'],
             category=data.get('category', 'general')  # v2 支持分類
         )
         db.session.add(post)
         db.session.commit()
         return jsonify(post_schema.dump(post)), 201

     @posts_bp.route('/posts/<int:post_id>', methods=['PUT'])
     def update_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' in data:
             post.title = data['title']
         if 'content' in data:
             post.content = data['content']
         if 'category' in data:
             post.category = data['category']
         db.session.commit()
         return jsonify(post_schema.dump(post)), 200

     @posts_bp.route('/posts/<int:post_id>', methods=['DELETE'])
     def delete_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         db.session.delete(post)
         db.session.commit()
         return jsonify({'message': 'Post deleted'}), 200
     ```

7. **更新應用初始化**

   - 修改 **app/**init**.py**，註冊所有藍圖：

     ```python
     from flask import Flask, jsonify
     from flask_sqlalchemy import SQLAlchemy
     from flask_marshmallow import Marshmallow
     from .routes.v1.todos import todos_bp as todos_v1_bp
     from .routes.v1.users import users_bp as users_v1_bp
     from .routes.v1.posts import posts_bp as posts_v1_bp  # 新增
     from .routes.v2.todos import todos_bp as todos_v2_bp
     from .routes.v2.posts import posts_bp as posts_v2_bp  # 新增
     from .config import config_map
     import os

     db = SQLAlchemy()
     ma = Marshmallow()

     def create_app():
         app = Flask(__name__)
         env = os.getenv('FLASK_ENV', 'development')
         app.config.from_object(config_map[env])
         db.init_app(app)
         ma.init_app(app)

         app.register_blueprint(todos_v1_bp, url_prefix='/api/v1')
         app.register_blueprint(users_v1_bp, url_prefix='/api/v1')
         app.register_blueprint(posts_v1_bp, url_prefix='/api/v1')
         app.register_blueprint(todos_v2_bp, url_prefix='/api/v2')
         app.register_blueprint(posts_v2_bp, url_prefix='/api/v2')

         @app.errorhandler(404)
         def not_found(error):
             return jsonify({'error': 'Not Found', 'message': str(error)}), 404

         @app.errorhandler(400)
         def bad_request(error):
             return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

         @app.errorhandler(500)
         def internal_error(error):
             return jsonify({'error': 'Internal Server Error', 'message': 'Something went wrong on our end'}), 500

         with app.app_context():
             db.create_all()

         return app
     ```

8. **運行應用**

   - 刪除舊的 `*.db` 文件，運行：
     ```bash
     python run.py
     ```

9. **測試 API**

   - 使用 Postman 測試：
     - **POST /api/v1/users**：
       - Body：`{"username": "alice"}`
       - 預期響應：`{"id": 1, "username": "alice", "posts": []}`
     - **POST /api/v1/posts**：
       - Body：`{"title": "First Post", "content": "Hello world", "user_id": 1}`
       - 預期響應：`{"id": 1, "title": "First Post", "content": "Hello world", ...}`
     - **POST /api/v2/posts**：
       - Body：`{"title": "Second Post", "content": "Hi there", "user_id": 1, "category": "tech"}`
       - 預期響應：包含 `category: "tech"`
     - **GET /api/v2/posts?category=tech**：
       - 預期響應：僅返回分類為 "tech" 的文章。
     - **GET /api/v1/users**：
       - 預期響應：包含用戶及其文章。

10. **作業**
    - 在 v2 中添加一個端點 `GET /api/v2/posts/recent`，返回最近 5 篇按 `created_at` 排序的文章。
    - 在 `PostSchema` 中添加一個自定義字段，返回文章的字數（提示：計算 `content` 長度）。

---

## **注意事項**

- 表結構改變後需重建數據庫。
- 確保每個藍圖名稱唯一（例如 `posts_v1` 和 `posts_v2`）。

---
