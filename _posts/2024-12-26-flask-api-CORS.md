---
title: Flask - 跨域資源共享（CORS）
date: 2024-12-26 19:00:00 +0800
categories: [Software, Python]
tags: [Flask]
excerpt: "使用 **Flask-CORS**，以便前端應用（例如運行在不同域名上的 JavaScript 客戶端）能夠安全地訪問 API。"
---

## **目標**

- 安裝並配置 Flask-CORS
- 為 API 端點啟用 CORS
- 測試跨域請求

## **步驟**

1. **準備環境**

   - 繼續使用 `flask_api/` 項目結構，激活虛擬環境：
     ```bash
     # Windows: flask_api_env\Scripts\activate
     # macOS/Linux: source flask_api_env/bin/activate
     ```
   - 安裝 Flask-CORS：
     ```bash
     pip install flask-cors
     ```

2. **配置 Flask-CORS**

   - 修改 **app/**init**.py**，添加 CORS 支持：

     ```python
     from flask import Flask, jsonify, g
     from flask_sqlalchemy import SQLAlchemy
     from flask_marshmallow import Marshmallow
     from flask_bcrypt import Bcrypt
     from flask_restx import Api
     from flask_caching import Cache
     from flask_limiter import Limiter
     from flask_limiter.util import get_remote_address
     from flask_cors import CORS  # 新增
     import jwt
     from functools import wraps
     from .routes.v1.todos import todos_bp as todos_v1_bp
     from .routes.v1.users import users_bp as users_v1_bp
     from .routes.v1.posts import posts_bp as posts_v1_bp
     from .routes.v2.todos import todos_bp as todos_v2_bp
     from .routes.v2.posts import posts_bp as posts_v2_bp
     from .config import config_map
     from .celery_config import make_celery
     import os
     import logging
     from logging.handlers import RotatingFileHandler

     db = SQLAlchemy()
     ma = Marshmallow()
     bcrypt = Bcrypt()
     cache = Cache()
     limiter = Limiter(key_func=get_remote_address)

     def setup_logging(app):
         if not app.debug:
             handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3)
             handler.setLevel(logging.INFO)
             formatter = logging.Formatter(
                 '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
             )
             handler.setFormatter(formatter)
             app.logger.addHandler(handler)
         console_handler = logging.StreamHandler()
         console_handler.setLevel(logging.DEBUG)
         console_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
         app.logger.addHandler(console_handler)
         app.logger.setLevel(logging.DEBUG)

     def create_app():
         app = Flask(__name__)
         env = os.getenv('FLASK_ENV', 'development')
         app.config.from_object(config_map[env])
         app.config['CACHE_TYPE'] = 'simple'
         app.config['CACHE_DEFAULT_TIMEOUT'] = 300
         app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')
         app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
         os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
         app.static_folder = app.root_path

         db.init_app(app)
         ma.init_app(app)
         bcrypt.init_app(app)
         cache.init_app(app)
         limiter.init_app(app)
         setup_logging(app)

         # 初始化 CORS
         CORS(app, resources={r"/api/*": {"origins": "*"}})  # 允許所有域名訪問 /api/* 路徑

         api = Api(app,
                   title='Blog API',
                   version='1.0',
                   description='A simple blog API with user and post management',
                   doc='/api/docs/',
                   authorizations={
                       'jwt': {
                           'type': 'apiKey',
                           'in': 'header',
                           'name': 'Authorization',
                           'description': 'Enter "Bearer <token>"'
                       }
                   })

         global celery
         celery = make_celery(app)

         app.register_blueprint(todos_v1_bp, url_prefix='/api/v1')
         app.register_blueprint(users_v1_bp, url_prefix='/api/v1')
         app.register_blueprint(posts_v1_bp, url_prefix='/api/v1')
         app.register_blueprint(todos_v2_bp, url_prefix='/api/v2')
         app.register_blueprint(posts_v2_bp, url_prefix='/api/v2')

         @app.errorhandler(404)
         def not_found(error):
             app.logger.error(f'404 error: {str(error)}')
             return jsonify({'error': 'Not Found', 'message': str(error)}), 404

         @app.errorhandler(400)
         def bad_request(error):
             app.logger.warning(f'400 error: {str(error)}')
             return jsonify({'error': 'Bad Request', 'message': str(error)}), 400

         @app.errorhandler(500)
         def internal_error(error):
             app.logger.critical(f'500 error: {str(error)}')
             return jsonify({'error': 'Internal Server Error', 'message': 'Something went wrong on our end'}), 500

         with app.app_context():
             db.create_all()

         return app

     def login_required(f):
         @wraps(f)
         def decorated_function(*args, **kwargs):
             from .models import User
             token = request.headers.get('Authorization')
             if not token:
                 abort(401, description='Missing token')
             try:
                 if token.startswith('Bearer '):
                     token = token[7:]
                 data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                 user = User.query.get(data['user_id'])
                 if not user:
                     abort(401, description='Invalid token')
                 g.current_user = user
             except jwt.ExpiredSignatureError:
                 abort(401, description='Token has expired')
             except jwt.InvalidTokenError:
                 abort(401, description='Invalid token')
             return f(*args, **kwargs)
         return decorated_function

     def admin_required(f):
         @wraps(f)
         @login_required
         def decorated_function(*args, **kwargs):
             if not g.current_user.is_admin:
                 abort(403, description='Admin access required')
             return f(*args, **kwargs)
         return decorated_function

     celery = None
     ```

3. **運行應用**

   - 運行：
     ```bash
     python run.py
     ```

4. **測試跨域請求**

   - **從本地 HTML 文件測試**：

     - 創建一個簡單的 HTML 文件（例如 `test.html`），放在另一個端口（使用簡單的 HTTP 服務器）：

       ```html
       <!DOCTYPE html>
       <html>
         <head>
           <title>CORS Test</title>
         </head>
         <body>
           <h1>Test CORS</h1>
           <button onclick="fetchPosts()">Fetch Posts</button>
           <pre id="result"></pre>

           <script>
             function fetchPosts() {
               fetch("http://localhost:5000/api/v1/posts", {
                 method: "GET",
                 headers: {
                   Accept: "application/json",
                 },
               })
                 .then((response) => response.json())
                 .then((data) => {
                   document.getElementById("result").textContent =
                     JSON.stringify(data, null, 2);
                 })
                 .catch((error) => console.error("Error:", error));
             }
           </script>
         </body>
       </html>
       ```

     - 使用 Python 啟動簡單服務器：
       ```bash
       python -m http.server 8000
       ```
     - 訪問 `http://localhost:8000/test.html`，點擊按鈕，應成功獲取文章列表。

   - **使用 Postman**：
     - 發送 `GET /api/v1/posts`，檢查響應頭包含 `Access-Control-Allow-Origin: *`。

5. **限制特定域名**

   - 修改 CORS 配置，只允許特定來源：
     ```python
     CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8000", "https://myfrontend.com"]}})
     ```
   - 重啟應用，測試其他域名（例如從 `http://127.0.0.1:8000`）應被瀏覽器阻止。

6. **作業**
   - 在 v2 的 posts 路由中啟用 CORS，並限制只允許特定域名。
   - 添加一個自定義頭（例如 `X-API-Version`），並確保 CORS 配置支持暴露該頭（提示：使用 `expose_headers`）。

---

## **注意事項**

- `"origins": "*"` 允許所有域名，生產環境應指定明確域名。
- 帶認證的請求（例如帶 `Authorization` 的 POST）需要處理預檢（OPTIONS）請求，Flask-CORS 自動處理。
- 若使用前端框架（如 React），確保開發服務器代理設置正確。

---
