---
title: Flask - 理解路由與 HTTP 方法
date: 2024-12-02 19:00:00 +0800
categories: [Software, Python]
tags: [Flask] 
excerpt: "學習如何使用 Flask 定義不同的路由，並實現常見的 HTTP 方法（GET、POST、PUT、DELETE），讓您的 API 具備基本的交互能力。"
---

## **目標**
- 理解 Flask 的路由機制
- 實現 GET、POST、PUT、DELETE 方法
- 使用 Postman 測試 API 端點

## **步驟**

1. **準備環境**
   - 確保您已完成第1天的環境設置，並激活虛擬環境：
     ```bash
     # Windows
     flask_api_env\Scripts\activate
     # macOS/Linux
     source flask_api_env/bin/activate
     ```
   - 使用昨天的 `app.py`，或者新建一個文件。

2. **基礎路由複習**
   - 昨天我們定義了一個簡單的路由 `/api`，今天我們將擴展它。打開 `app.py`，從以下代碼開始：
     ```python
     from flask import Flask, jsonify

     app = Flask(__name__)

     @app.route('/')
     def home():
         return 'Welcome to Day 2!'
     ```

3. **實現多種 HTTP 方法**
   - 我們將創建一個簡單的資源（例如 "items"），支持不同的 HTTP 方法。修改 `app.py` 如下：
     ```python
     from flask import Flask, jsonify, request

     app = Flask(__name__)

     # 模擬數據庫
     items = [
         {'id': 1, 'name': 'Item 1'},
         {'id': 2, 'name': 'Item 2'}
     ]

     # GET - 獲取所有項目
     @app.route('/items', methods=['GET'])
     def get_items():
         return jsonify({'items': items})

     # GET - 獲取單個項目
     @app.route('/items/<int:item_id>', methods=['GET'])
     def get_item(item_id):
         item = next((item for item in items if item['id'] == item_id), None)
         if item:
             return jsonify(item)
         return jsonify({'error': 'Item not found'}), 404

     # POST - 添加新項目
     @app.route('/items', methods=['POST'])
     def create_item():
         new_item = request.get_json()
         new_item['id'] = len(items) + 1
         items.append(new_item)
         return jsonify(new_item), 201

     # PUT - 更新項目
     @app.route('/items/<int:item_id>', methods=['PUT'])
     def update_item(item_id):
         item = next((item for item in items if item['id'] == item_id), None)
         if item:
             data = request.get_json()
             item.update(data)
             return jsonify(item)
         return jsonify({'error': 'Item not found'}), 404

     # DELETE - 刪除項目
     @app.route('/items/<int:item_id>', methods=['DELETE'])
     def delete_item(item_id):
         global items
         item = next((item for item in items if item['id'] == item_id), None)
         if item:
             items = [i for i in items if i['id'] != item_id]
             return jsonify({'message': 'Item deleted'})
         return jsonify({'error': 'Item not found'}), 404

     if __name__ == '__main__':
         app.run(debug=True)
     ```
   - **代碼解釋**：
     - `@app.route('/items', methods=['GET'])`：指定路由和允許的 HTTP 方法。
     - `<int:item_id>`：動態路由參數，限制為整數。
     - `request.get_json()`：從 POST 或 PUT 請求中獲取 JSON 數據。
     - 狀態碼：`201` 表示創建成功，`404` 表示未找到。

4. **運行應用**
   - 保存並運行：
     ```bash
     python app.py
     ```
   - 服務器啟動後，訪問 `http://127.0.0.1:5000/items`，您將看到當前 items 列表。

5. **使用 Postman 測試**
   - **GET /items**：
     - 方法：GET
     - URL：`http://127.0.0.1:5000/items`
     - 預期響應：`{"items": [{"id": 1, "name": "Item 1"}, {"id": 2, "name": "Item 2"}]}`
   - **GET /items/1**：
     - 方法：GET
     - URL：`http://127.0.0.1:5000/items/1`
     - 預期響應：`{"id": 1, "name": "Item 1"}`
   - **POST /items**：
     - 方法：POST
     - URL：`http://127.0.0.1:5000/items`
     - Body (JSON)：`{"name": "Item 3"}`
     - 預期響應：`{"id": 3, "name": "Item 3"}`
   - **PUT /items/1**：
     - 方法：PUT
     - URL：`http://127.0.0.1:5000/items/1`
     - Body (JSON)：`{"name": "Updated Item 1"}`
     - 預期響應：`{"id": 1, "name": "Updated Item 1"}`
   - **DELETE /items/2**：
     - 方法：DELETE
     - URL：`http://127.0.0.1:5000/items/2`
     - 預期響應：`{"message": "Item deleted"}`

6. **作業**
   - 添加一個新路由 `/items/search`，根據名稱查詢項目（提示：使用查詢參數 `request.args.get('name')`）。
   - 測試所有端點，確保它們按預期工作。

---

## **注意事項**
- 如果 Postman 未安裝，可以用瀏覽器測試 GET 請求，其他方法需要命令行工具（如 `curl`）或 Postman。
- `items` 是記憶體中的數據，服務器重啟後會丟失，後續我們會引入數據庫。

---
