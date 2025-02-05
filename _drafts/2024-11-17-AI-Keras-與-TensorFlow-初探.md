## 第17天：Keras 與 TensorFlow 初探

今天將學習 Keras 與 TensorFlow 這兩個深度學習框架，瞭解其功能與特性，並建立你的第一個簡單神經網路。Keras 是一個高層介面，讓 TensorFlow 的使用變得更直觀、友好，適合初學者快速上手。

---

## **課程目標**
1. 瞭解 Keras 與 TensorFlow 的定位與特性。  
2. 使用 Keras 實作簡單的神經網路模型。  
3. 瞭解 TensorFlow 的基本運作方式。

---

## **課程內容**

### **1. TensorFlow 與 Keras 概述**

#### **1.1 TensorFlow 是什麼？**
TensorFlow 是由 Google 開發的開源機器學習框架，支援從模型訓練到部署的完整流程，具備以下特性：  
- 高效的數學運算（如張量運算）。  
- 分散式運算與 GPU 加速。  
- 支援深度學習與機器學習的完整生態系統。

#### **1.2 Keras 是什麼？**
Keras 是一個高層深度學習 API，構建在 TensorFlow 之上，讓模型建立、訓練、測試的流程更簡單直觀。  
- **優點**：簡潔、高效、易於調試。  
- **定位**：適合快速原型設計與小型專案。

---

### **2. 使用 Keras 建立神經網路模型**

以下示範如何用 Keras 實作一個簡單的分類模型。

#### **2.1 步驟 1：準備資料**
我們將使用 Scikit-learn 提供的 Iris 資料集進行分類。

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
import numpy as np

# 載入 Iris 資料集
iris = load_iris()
X = iris.data  # 特徵
y = iris.target.reshape(-1, 1)  # 標籤

# One-Hot 編碼
encoder = OneHotEncoder(sparse=False)
y = encoder.fit_transform(y)

# 切分訓練集與測試集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

---

#### **2.2 步驟 2：建立模型**
使用 Keras 提供的 Sequential API 建立模型。

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# 建立模型
model = Sequential([
    Dense(8, activation='relu', input_shape=(X_train.shape[1],)),  # 隱藏層
    Dense(3, activation='softmax')  # 輸出層
])

# 編譯模型
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# 查看模型結構
model.summary()
```

---

#### **2.3 步驟 3：訓練模型**
進行模型訓練，並觀察訓練過程的損失與準確率。

```python
# 訓練模型
history = model.fit(X_train, y_train, epochs=50, batch_size=8, validation_split=0.2, verbose=1)

# 繪製訓練過程
import matplotlib.pyplot as plt

plt.plot(history.history['accuracy'], label='訓練準確率')
plt.plot(history.history['val_accuracy'], label='驗證準確率')
plt.legend()
plt.show()
```

---

#### **2.4 步驟 4：測試模型**
使用測試集進行評估，檢視模型在未見資料上的表現。

```python
# 測試模型
loss, accuracy = model.evaluate(X_test, y_test, verbose=1)
print(f"測試集準確率: {accuracy:.2f}")
```

---

### **3. TensorFlow 基本運作範例**

TensorFlow 不僅用於高層的 Keras 模型，還支援低層的數學運算與自定義運算流程。以下是一個基本的 TensorFlow 範例：

```python
import tensorflow as tf

# 定義張量
a = tf.constant([[1, 2], [3, 4]])
b = tf.constant([[5, 6], [7, 8]])

# 張量加法與矩陣乘法
c = tf.add(a, b)
d = tf.matmul(a, b)

print("加法結果:\n", c.numpy())
print("矩陣乘法結果:\n", d.numpy())
```

---

## **課後作業**

1. 嘗試修改隱藏層的激活函數（如 sigmoid 或 tanh），比較其對準確率的影響。  
2. 使用其他數據集（如 MNIST 數字識別數據集）重新實作一個分類模型。  
3. 實驗不同的超參數（如學習率或批次大小），觀察模型表現的變化。

---
