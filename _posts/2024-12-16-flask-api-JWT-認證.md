---
title: Flask - JWT 認證
date: 2024-12-16 19:00:00 +0800
categories: [Software, Python]
tags: [Flask]
excerpt: "從基本的用戶名/密碼認證升級到基於 **JSON Web Token (JWT)** 的認證，使用 **PyJWT** 實現無狀態的身份驗證。這將使 API 更現代化，並適應分佈式系統的需求"
---

## **目標**

- 安裝並配置 PyJWT
- 實現基於 JWT 的認證
- 更新博客 API 使用 token 進行身份驗證

## **步驟**

1. **準備環境**

   - 繼續使用 `flask_api/` 項目結構，激活虛擬環境：
     ```bash
     # Windows: flask_api_env\Scripts\activate
     # macOS/Linux: source flask_api_env/bin/activate
     ```
   - 安裝 PyJWT：
     ```bash
     pip install pyjwt
     ```

2. **移除 Flask-HTTPAuth**

   - 我們將替換 Flask-HTTPAuth，因此先移除相關依賴，但保留密碼字段。

3. **更新應用配置**

   - 修改 **app/config.py**，確保 `SECRET_KEY` 可用於 JWT 簽名：

     ```python
     import os
     from dotenv import load_dotenv

     load_dotenv()

     class Config:
         SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
         SQLALCHEMY_TRACK_MODIFICATIONS = False

     class DevelopmentConfig(Config):
         DEBUG = True
         SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///blog_dev.db')

     class TestingConfig(Config):
         TESTING = True
         SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///blog_test.db')
         WTF_CSRF_ENABLED = False

     class ProductionConfig(Config):
         DEBUG = False
         SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///blog_prod.db')

     config_map = {
         'development': DevelopmentConfig,
         'testing': TestingConfig,
         'production': ProductionConfig
     }
     ```

   - 確保 `.env` 中有 `SECRET_KEY`：
     ```
     FLASK_ENV=development
     SECRET_KEY=your-very-secret-key
     DATABASE_URL=sqlite:///blog.db
     ```

4. **實現 JWT 認證**

   - 修改 **app/**init**.py**，添加 JWT 工具函數：

     ```python
     from flask import Flask, jsonify, g
     from flask_sqlalchemy import SQLAlchemy
     from flask_marshmallow import Marshmallow
     import jwt
     from functools import wraps
     from .routes.v1.todos import todos_bp as todos_v1_bp
     from .routes.v1.users import users_bp as users_v1_bp
     from .routes.v1.posts import posts_bp as posts_v1_bp
     from .routes.v2.todos import todos_bp as todos_v2_bp
     from .routes.v2.posts import posts_bp as posts_v2_bp
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

     # JWT 認證裝飾器
     def login_required(f):
         @wraps(f)
         def decorated_function(*args, **kwargs):
             from .models import User  # 避免循環導入
             token = request.headers.get('Authorization')
             if not token:
                 abort(401, description='Missing token')
             try:
                 if token.startswith('Bearer '):
                     token = token[7:]  # 移除 "Bearer " 前綴
                 data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                 user = User.query.get(data['user_id'])
                 if not user:
                     abort(401, description='Invalid token')
                 g.current_user = user  # 存儲當前用戶
             except jwt.ExpiredSignatureError:
                 abort(401, description='Token has expired')
             except jwt.InvalidTokenError:
                 abort(401, description='Invalid token')
             return f(*args, **kwargs)
         return decorated_function
     ```

5. **添加登錄端點**

   - 修改 **app/routes/v1/users.py**，添加生成 JWT 的登錄路由：

     ```python
     from flask import Blueprint, jsonify, request, abort
     from ...models import User
     from ... import db
     from ...schemas import user_schema, users_schema
     import jwt
     import datetime

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
         if 'username' not in data or 'password' not in data:
             abort(400, description='Missing username or password')
         if User.query.filter_by(username=data['username']).first():
             abort(400, description='Username already exists')
         user = User(username=data['username'], password=data['password'])
         db.session.add(user)
         db.session.commit()
         return jsonify(user_schema.dump(user)), 201

     @users_bp.route('/login', methods=['POST'])
     def login():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'username' not in data or 'password' not in data:
             abort(400, description='Missing username or password')
         user = User.query.filter_by(username=data['username']).first()
         if not user or user.password != data['password']:
             abort(401, description='Invalid credentials')
         token = jwt.encode({
             'user_id': user.id,
             'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token 有效期 24 小時
         }, users_bp.app.config['SECRET_KEY'], algorithm='HS256')
         return jsonify({'token': token})
     ```

6. **保護路由**

   - 修改 **app/routes/v1/posts.py**，使用 JWT 認證：

     ```python
     from flask import Blueprint, jsonify, request, abort, g
     from ...models import Post, User
     from ... import db, login_required
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
     @login_required
     def create_post():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'title' not in data or 'content' not in data:
             abort(400, description='Missing title or content')
         post = Post(
             title=data['title'],
             content=data['content'],
             user_id=g.current_user.id  # 使用當前認證用戶
         )
         db.session.add(post)
         db.session.commit()
         return jsonify(post_schema.dump(post)), 201

     @posts_bp.route('/posts/<int:post_id>', methods=['PUT'])
     @login_required
     def update_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         if post.user_id != g.current_user.id:
             abort(403, description='You can only edit your own posts')
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
     @login_required
     def delete_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         if post.user_id != g.current_user.id:
             abort(403, description='You can only delete your own posts')
         db.session.delete(post)
         db.session.commit()
         return jsonify({'message': 'Post deleted'}), 200
     ```

7. **運行應用**

   - 運行：
     ```bash
     python run.py
     ```

8. **測試 API**

   - 使用 Postman 測試：
     - **POST /api/v1/users**：
       - Body：`{"username": "alice", "password": "1234"}`
     - **POST /api/v1/login**：
       - Body：`{"username": "alice", "password": "1234"}`
       - 預期響應：`{"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."}`
     - **POST /api/v1/posts**（未認證）：
       - Body：`{"title": "My Post", "content": "Hello"}`
       - 預期響應：401
     - **POST /api/v1/posts**（認證）：
       - Headers：`Authorization: Bearer <token>`
       - Body：`{"title": "My Post", "content": "Hello"}`
       - 預期響應：201
     - **PUT /api/v1/posts/1**（錯誤用戶）：
       - 用另一用戶的 token，應返回 403。

9. **作業**
   - 在 v2 的 posts 路由中實現相同的 JWT 認證。
   - 添加一個端點 `GET /api/v1/me`，返回當前用戶的信息（使用 `g.current_user`）。

---

## **注意事項**

- Token 過期後需重新登錄獲取新 token。
- 目前密碼仍是明文，下一天會加密。
- 在 Postman 中，將 token 添加到 Headers 的 `Authorization` 字段，格式為 `Bearer <token>`。

---
