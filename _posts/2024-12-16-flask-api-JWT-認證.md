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
- 更新Blog API 使用 token 進行身份驗證
- 實現 token 刷新機制
- 實現 token 黑名單機制

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

   - 修改 **app/config.py**，添加 JWT 相關配置：

     ```python
     import os
     from dotenv import load_dotenv

     load_dotenv()

     class Config:
         SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
         JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
         JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))  # 1小時
         JWT_REFRESH_TOKEN_EXPIRES = int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES', 604800))  # 7天
         SQLALCHEMY_TRACK_MODIFICATIONS = False
         JWT_BLACKLIST_ENABLED = True
         JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

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

4. **實現 JWT 認證**

   - 修改 **app/**init**.py**，添加 JWT 工具函數：

     ```python
     from flask import Flask, jsonify, g, request, current_app
     from flask_sqlalchemy import SQLAlchemy
     from flask_marshmallow import Marshmallow
     import jwt
     from functools import wraps
     from datetime import datetime, timedelta
     from .models import TokenBlacklist
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

     def create_access_token(user_id):
         """創建訪問令牌"""
         return jwt.encode({
             'user_id': user_id,
             'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_ACCESS_TOKEN_EXPIRES']),
             'type': 'access'
         }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

     def create_refresh_token(user_id):
         """創建刷新令牌"""
         return jwt.encode({
             'user_id': user_id,
             'exp': datetime.utcnow() + timedelta(seconds=current_app.config['JWT_REFRESH_TOKEN_EXPIRES']),
             'type': 'refresh'
         }, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

     def is_token_blacklisted(token):
         """檢查令牌是否在黑名單中"""
         return TokenBlacklist.query.filter_by(token=token).first() is not None

     def add_token_to_blacklist(token):
         """將令牌添加到黑名單"""
         blacklisted_token = TokenBlacklist(token=token)
         db.session.add(blacklisted_token)
         db.session.commit()

     # JWT 認證裝飾器
     def login_required(f):
         @wraps(f)
         def decorated_function(*args, **kwargs):
             from .models import User
             token = request.headers.get('Authorization')
             if not token:
                 abort(401, description='Missing token')
             try:
                 if token.startswith('Bearer '):
                     token = token[7:]  # 移除 "Bearer " 前綴
                 
                 # 檢查令牌是否在黑名單中
                 if is_token_blacklisted(token):
                     abort(401, description='Token has been revoked')
                 
                 data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
                 
                 # 驗證令牌類型
                 if data.get('type') != 'access':
                     abort(401, description='Invalid token type')
                 
                 user = User.query.get(data['user_id'])
                 if not user:
                     abort(401, description='Invalid token')
                 
                 g.current_user = user
             except jwt.ExpiredSignatureError:
                 abort(401, description='Token has expired')
             except jwt.InvalidTokenError as e:
                 abort(401, description=f'Invalid token: {str(e)}')
             return f(*args, **kwargs)
         return decorated_function
     ```

5. **添加登錄端點**

   - 修改 **app/routes/v1/users.py**，添加生成 JWT 的登錄路由：

     ```python
     from flask import Blueprint, jsonify, request, abort, current_app
     from ...models import User
     from ... import db
     from ...schemas import user_schema, users_schema
     from ... import create_access_token, create_refresh_token

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
         if not user or not user.check_password(data['password']):
             abort(401, description='Invalid credentials')
         
         access_token = create_access_token(user.id)
         refresh_token = create_refresh_token(user.id)
         
         return jsonify({
             'access_token': access_token,
             'refresh_token': refresh_token,
             'token_type': 'Bearer',
             'expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
         })

     @users_bp.route('/refresh', methods=['POST'])
     def refresh():
         if not request.is_json:
             abort(400, description='Request must be JSON')
         data = request.get_json()
         if 'refresh_token' not in data:
             abort(400, description='Missing refresh token')
         
         try:
             token = data['refresh_token']
             if is_token_blacklisted(token):
                 abort(401, description='Token has been revoked')
             
             data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
             if data.get('type') != 'refresh':
                 abort(401, description='Invalid token type')
             
             user = User.query.get(data['user_id'])
             if not user:
                 abort(401, description='Invalid token')
             
             access_token = create_access_token(user.id)
             return jsonify({
                 'access_token': access_token,
                 'token_type': 'Bearer',
                 'expires_in': current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
             })
         except jwt.ExpiredSignatureError:
             abort(401, description='Refresh token has expired')
         except jwt.InvalidTokenError as e:
             abort(401, description=f'Invalid token: {str(e)}')

     @users_bp.route('/logout', methods=['POST'])
     @login_required
     def logout():
         token = request.headers.get('Authorization')[7:]  # 移除 "Bearer " 前綴
         add_token_to_blacklist(token)
         return jsonify({'message': 'Successfully logged out'})
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
             user_id=g.current_user.id
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
         return jsonify(post_schema.dump(post))

     @posts_bp.route('/posts/<int:post_id>', methods=['DELETE'])
     @login_required
     def delete_post(post_id):
         post = Post.query.get_or_404(post_id, description='Post not found')
         if post.user_id != g.current_user.id:
             abort(403, description='You can only delete your own posts')
         db.session.delete(post)
         db.session.commit()
         return '', 204
     ```

7. **添加 Token 黑名單模型**

   - 創建 **app/models.py**，添加 TokenBlacklist 模型：

     ```python
     from . import db
     from datetime import datetime

     class TokenBlacklist(db.Model):
         __tablename__ = 'token_blacklist'
         id = db.Column(db.Integer, primary_key=True)
         token = db.Column(db.String(500), unique=True, nullable=False)
         blacklisted_on = db.Column(db.DateTime, default=datetime.utcnow)

         def __repr__(self):
             return f'<Token {self.token}>'
     ```

8. **運行應用**

   - 刪除舊的 `blog.db`（因表結構改變），運行：
     ```bash
     python run.py
     ```

9. **測試 API**

   - 使用 Postman 測試：
     - **POST /api/v1/login**：
       - Body：`{"username": "alice", "password": "1234"}`
       - 預期響應：包含 access_token 和 refresh_token
     - **POST /api/v1/refresh**：
       - Body：`{"refresh_token": "..."}`
       - 預期響應：新的 access_token
     - **POST /api/v1/logout**：
       - Headers：`Authorization: Bearer <access_token>`
       - 預期響應：登出成功消息
     - **POST /api/v1/posts**：
       - Headers：`Authorization: Bearer <access_token>`
       - Body：`{"title": "My Post", "content": "Hello"}`
       - 預期響應：201

## **安全最佳實踐**

1. **令牌管理**
   - 使用不同的密鑰進行簽名和驗證
   - 實現令牌黑名單機制
   - 設置合理的令牌過期時間
   - 使用 HTTPS 傳輸令牌

2. **錯誤處理**
   - 提供清晰的錯誤消息
   - 記錄安全相關的錯誤
   - 實現速率限制防止暴力破解

3. **配置管理**
   - 使用環境變量存儲敏感信息
   - 為不同環境使用不同的配置
   - 定期輪換密鑰

4. **監控與日誌**
   - 記錄認證相關的事件
   - 監控異常的登錄嘗試
   - 實現審計日誌

## **注意事項**

- 生產環境應使用更強的密鑰
- 定期清理過期的黑名單令牌
- 考慮實現雙因素認證
- 實現密碼策略和強度檢查
- 考慮使用 OAuth2 或 OpenID Connect 進行第三方認證

---
