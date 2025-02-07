---
title: AI 第20天：RNN 與 LSTM
date: 2024-11-20 19:00:00 +0800
categories: [Software, AI]
tags: [AI, Python] 
math: true
excerpt: "遞歸神經網路（Recurrent Neural Network, RNN）與長短期記憶網路（Long Short-Term Memory, LSTM）是處理序列數據的重要工具，廣泛應用於自然語言處理、時間序列分析、語音識別等領域。今天，我們將學習 RNN 和 LSTM 的核心概念，並實作簡單的 LSTM 模型。"
---

遞歸神經網路（Recurrent Neural Network, RNN）與長短期記憶網路（Long Short-Term Memory, LSTM）是處理序列數據的重要工具，廣泛應用於自然語言處理、時間序列分析、語音識別等領域。今天，我們將學習 RNN 和 LSTM 的核心概念，並實作簡單的 LSTM 模型。  

---

## **課程目標**  
1. 理解 RNN 與 LSTM 的結構與工作原理。  
2. 瞭解它們如何處理序列數據（例如時間序列或文本）。  
3. 使用 TensorFlow/Keras 實作一個基於 LSTM 的簡單模型。  

---

## **課程內容**

### **1. RNN 的核心概念**

#### **1.1 為什麼使用 RNN？**  
RNN 的特點是擁有循環結構，能記住序列數據的上下文資訊，適合處理有時間相關性的數據（如文本、語音）。  

#### **1.2 RNN 的結構**  
RNN 會將前一個時間步的輸出作為下一個時間步的輸入，公式如下：  
$$h_t = f(W_h h_{t-1} + W_x x_t + b)$$  
其中：  
- \(h_t\)：當前時間步的隱藏狀態  
- \(x_t\)：當前時間步的輸入  
- \(W_h\)、\(W_x\)：權重矩陣  
- \(b\)：偏置  

#### **1.3 RNN 的缺點**  
- **梯度消失或爆炸問題**：在處理長序列時，梯度可能會消失或爆炸，導致模型無法學習遠距資訊。  
- **短期記憶**：普通 RNN 無法有效記住長期上下文資訊。  

---

### **2. LSTM 的核心概念**

為了解決 RNN 的缺點，LSTM 被提出，它是一種特殊的 RNN，透過「記憶單元」與「門機制」有效處理長期依賴問題。  

#### **2.1 LSTM 的結構**  
LSTM 包含三個門：  
- **遺忘門（Forget Gate）**：決定丟棄多少先前的信息。  
- **輸入門（Input Gate）**：決定更新多少新信息到記憶單元中。  
- **輸出門（Output Gate）**：決定從記憶單元輸出多少信息。  

數學公式：  
$$ f_t = \sigma(W_f [h_{t-1}, x_t] + b_f) $$  
$$i_t = \sigma(W_i [h_{t-1}, x_t] + b_i)$$  
$$\tilde{C}_t = \tanh(W_C [h_{t-1}, x_t] + b_C)$$  
$$C_t = f_t * C_{t-1} + i_t * \tilde{C}_t$$  
$$o_t = \sigma(W_o [h_{t-1}, x_t] + b_o)$$  
$$h_t = o_t * \tanh(C_t)$$  

---

### **3. 實作：基於 LSTM 的時間序列預測**

#### **3.1 載入與準備數據**

使用 Sine 函數生成時間序列數據，作為模型的輸入。

```python
import numpy as np
import matplotlib.pyplot as plt

# 生成時間序列數據
time_steps = np.linspace(0, 100, 1000)
data = np.sin(time_steps)

# 構建訓練數據
def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

seq_length = 50
X, y = create_sequences(data, seq_length)

# 分割訓練集與測試集
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# 增加維度以符合 LSTM 輸入
X_train = X_train[:, :, np.newaxis]
X_test = X_test[:, :, np.newaxis]

print(f"訓練集形狀: {X_train.shape}, 測試集形狀: {X_test.shape}")
```

---

#### **3.2 建構 LSTM 模型**

```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

# 建立 LSTM 模型
model = Sequential([
    LSTM(50, activation='tanh', input_shape=(seq_length, 1)),
    Dense(1)  # 單一輸出
])

# 編譯模型
model.compile(optimizer='adam', loss='mse')

# 查看模型架構
model.summary()
```

---

#### **3.3 訓練與評估模型**

```python
# 訓練模型
history = model.fit(X_train, y_train, epochs=20, batch_size=32, validation_split=0.2, verbose=1)

# 評估模型
loss = model.evaluate(X_test, y_test)
print(f"測試集損失: {loss:.4f}")

# 預測與可視化結果
y_pred = model.predict(X_test)

plt.figure(figsize=(10, 6))
plt.plot(y_test, label="真實值")
plt.plot(y_pred, label="預測值")
plt.legend()
plt.title("LSTM 時間序列預測結果")
plt.show()
```

---

### **4. LSTM 的進階應用**
1. **文本生成**：使用 LSTM 訓練語料庫，生成新文本。  
2. **語音識別**：處理聲音的時間序列特徵。  
3. **股價預測**：分析股票的歷史數據進行價格預測。  

---

## **課後作業**
1. 調整 LSTM 層數或神經元數量，觀察模型性能的變化。  
2. 嘗試使用 GRU（門控循環單元）替代 LSTM，並比較結果。  
3. 使用更複雜的時間序列數據（如氣象數據）進行模型訓練與預測。  

---
