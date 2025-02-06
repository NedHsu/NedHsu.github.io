---
title: AI 第5天：Pandas 與 Numpy 快速上手
date: 2024-11-05 19:00:00 +0800
categories: [Software, AI]
tags: [AI, Python] 
excerpt: "在本課程中，我們將快速學習如何使用 **Pandas** 和 **NumPy** 處理數據。這些工具是數據分析的核心基礎，適合處理結構化和數值型數據。"
---

在本課程中，我們將快速學習如何使用 **Pandas** 和 **NumPy** 處理數據。這些工具是數據分析的核心基礎，適合處理結構化和數值型數據。

---

## **課程簡介**
- **Pandas** 是一個用於數據操作與分析的 Python 庫，主要用於處理表格數據（如 Excel、CSV）。  
- **NumPy** 是一個高效的數值運算庫，適合處理大型多維數組和矩陣計算。  

學習目標：  
1. 熟悉 Pandas 和 NumPy 的基本功能。  
2. 能夠讀取、操作並分析數據集。  
3. 掌握常見的數據清理與轉換技巧。  

---

## **課程內容**

### **1. Numpy 快速上手**

#### **建立數組與基本操作**  
```python
import numpy as np

# 建立數組
array_1d = np.array([1, 2, 3, 4])
array_2d = np.array([[1, 2], [3, 4]])

# 基本操作
print("形狀 (Shape):", array_2d.shape)
print("數組加法:", array_1d + 10)
print("矩陣乘法:", np.dot(array_2d, array_2d))
```

#### **數學運算與統計分析**  
```python
# 數學運算
print("平方:", np.square(array_1d))
print("開方:", np.sqrt(array_1d))

# 統計分析
print("最大值:", np.max(array_1d))
print("平均值:", np.mean(array_1d))
print("標準差:", np.std(array_1d))
```

---

### **2. Pandas 快速上手**

#### **資料讀取與檢視**  
```python
import pandas as pd

# 讀取 CSV 檔案
df = pd.read_csv('sample_data.csv')

# 檢視數據
print("前 5 行數據：")
print(df.head())
print("\n數據集資訊：")
print(df.info())
```

#### **資料篩選與過濾**  
```python
# 篩選列
selected_columns = df[['Column1', 'Column2']]

# 篩選行
filtered_rows = df[df['Age'] > 30]

print("篩選後的數據：")
print(filtered_rows)
```

#### **資料排序與統計**  
```python
# 按某列排序
sorted_df = df.sort_values(by='Score', ascending=False)

# 簡單統計
print("平均分數:", df['Score'].mean())
print("分數分布:")
print(df['Score'].value_counts())
```

---

### **3. 數據清理與處理技巧**

#### **處理缺失值**  
```python
# 檢查缺失值
print(df.isnull().sum())

# 填補缺失值
df['Age'].fillna(df['Age'].mean(), inplace=True)

# 刪除包含缺失值的行
df.dropna(inplace=True)
```

#### **轉換資料類型**  
```python
# 類型轉換
df['Date'] = pd.to_datetime(df['Date'])
df['Category'] = df['Category'].astype('category')
```

#### **新增衍生欄位**  
```python
# 計算新欄位
df['Price_per_Item'] = df['Total_Price'] / df['Quantity']
```

---

### **4. NumPy 與 Pandas 的綜合應用**

#### **數據生成與分析範例**  
```python
# 使用 NumPy 生成數據
data = np.random.randint(1, 100, (10, 3))

# 建立 DataFrame
df = pd.DataFrame(data, columns=['Feature1', 'Feature2', 'Feature3'])

# 簡單分析
print("平均值:")
print(df.mean())
```

#### **統計數據的可視化**  
```python
import matplotlib.pyplot as plt
import seaborn as sns

# 數據分佈圖
sns.histplot(df['Feature1'], kde=True)
plt.title("Feature1 Distribution")
plt.show()
```

---

### **5. 實作案例：處理銷售數據集**

#### **案例目標**  
- 計算每個產品的總銷量和總收入。  
- 找出收入最高的產品。  

#### **程式碼實作**  
```python
# 假設數據格式如下：
# Product | Quantity | Price

# 加載數據
sales_data = {
    'Product': ['A', 'B', 'A', 'C', 'B', 'A'],
    'Quantity': [10, 5, 8, 6, 7, 3],
    'Price': [20, 15, 20, 30, 15, 20]
}
df = pd.DataFrame(sales_data)

# 計算總銷量和收入
df['Revenue'] = df['Quantity'] * df['Price']
summary = df.groupby('Product').agg({'Quantity': 'sum', 'Revenue': 'sum'}).reset_index()

# 找出收入最高的產品
top_product = summary.loc[summary['Revenue'].idxmax()]

print("收入最高的產品：")
print(top_product)
```

---

### **課後練習**

1. 使用 Pandas 操作一組公開數據（例如 Kaggle 的 Titanic 數據集），完成以下任務：  
   - 篩選出成年乘客（年齡大於 18 歲）的數據。  
   - 計算各艙等的平均票價。  

2. 使用 NumPy 創建一個 100x100 的隨機數組，計算其每列的平均值和標準差。
