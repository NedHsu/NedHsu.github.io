---
title: AI 第25天：使用 Flask 部署簡單 AI API
date: 2024-11-25 19:00:00 +0800
categories: [Software, AI]
tags: [AI, Python] 
excerpt: "今天我們將深入學習如何使用 Flask 部署一個簡單的 AI API，讓我們的 AI 模型可以作為後端服務，供前端或其他應用調用。這是一個重要的技能，讓你可以將自己的 AI 開發成果應用於實際項目中。"
---

今天我們將深入學習如何使用 Flask 部署一個簡單的 AI API，讓我們的 AI 模型可以作為後端服務，供前端或其他應用調用。這是一個重要的技能，讓你可以將自己的 AI 開發成果應用於實際項目中。  

---

## **課程目標**  
1. 瞭解如何設計 API 來處理數據請求與返回結果。  
2. 使用 Flask 搭建簡單的 API，並整合已訓練的 AI 模型。  
3. 測試 API 並確保它能夠正確返回預測結果。  

---

## **課程內容**  

### **1. Flask 簡介**
#### **1.1 Flask 是什麼？**  
Flask 是一個輕量級的 Python 網頁框架，特別適合快速開發與部署小型應用。它的優勢包括：  
- 易於學習和使用。  
- 可擴展性強，支持多種插件與工具。  
- 對於 AI 模型部署非常友好。  

#### **1.2 Flask 安裝**  
在終端中執行以下指令安裝 Flask：  
```bash
pip install flask
```

---

### **2. 使用 Flask 部署 AI 模型**

#### **2.1 預先準備模型**
我們將使用一個簡單的線性迴歸模型作為範例，先完成模型的訓練與保存：  

```python
from sklearn.linear_model import LinearRegression
import joblib

# 訓練模型
X = [[1], [2], [3], [4]]
y = [2, 4, 6, 8]
model = LinearRegression()
model.fit(X, y)

# 保存模型
joblib.dump(model, "linear_regression_model.pkl")
print("模型已保存！")
```

#### **2.2 建立 Flask 應用**
我們將使用 Flask 建立一個簡單的 API，供客戶端請求使用模型進行預測：  

```python
from flask import Flask, request, jsonify
import joblib

# 初始化 Flask 應用
app = Flask(__name__)

# 加載已保存的模型
model = joblib.load("linear_regression_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    # 獲取請求中的數據
    data = request.get_json()
    X = data['input']
    
    # 使用模型進行預測
    prediction = model.predict([X])
    
    # 返回預測結果
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
```

---

### **3. 測試 API**

#### **3.1 啟動 Flask 應用**
執行以下指令啟動應用：  
```bash
python app.py
```
預設情況下，應用會運行在 `http://127.0.0.1:5000`。

#### **3.2 測試 API**
使用 Postman 或命令行工具 `curl` 發送請求進行測試：  

**範例請求**：  
```bash
curl -X POST -H "Content-Type: application/json" -d '{"input": [5]}' http://127.0.0.1:5000/predict
```

**範例返回**：  
```json
{
    "prediction": [10.0]
}
```

---

### **4. 增強與擴展**

#### **4.1 添加輸入驗證**
為了確保 API 的穩定性，可以添加數據驗證：  
```python
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        X = data['input']
        
        if not isinstance(X, list) or len(X) != 1:
            return jsonify({'error': '輸入數據格式不正確，需為單個數字的列表。'}), 400
        
        prediction = model.predict([X])
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

#### **4.2 添加更多路由**
可以擴展應用以提供更多功能，例如查詢模型資訊或更新模型：  
```python
@app.route('/info', methods=['GET'])
def info():
    return jsonify({'model': 'Linear Regression', 'version': '1.0'})
```

#### **4.3 日誌與錯誤處理**
加入日誌功能，幫助追蹤請求與錯誤：  
```python
import logging
logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    logging.info(f"收到請求：{data}")
    # 其餘程式碼
```

---

## **課後作業**  
1. 修改範例代碼，使用你自己訓練的模型替代線性迴歸模型。  
2. 嘗試部署到雲端平台，例如 AWS 或 Heroku。  
3. 探索其他框架（如 FastAPI）進行對比，並撰寫一篇比較報告。  

---
