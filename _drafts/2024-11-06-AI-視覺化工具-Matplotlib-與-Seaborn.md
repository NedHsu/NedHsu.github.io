## 第6天：視覺化工具 Matplotlib 與 Seaborn  

在數據分析中，視覺化是理解和展示數據的重要工具。本課程將帶你快速學習 **Matplotlib** 和 **Seaborn**，這兩個是 Python 中最常用的視覺化庫。

---

## **課程簡介**
- **Matplotlib** 是一個強大且靈活的數據視覺化工具，適合創建多種類型的圖表。  
- **Seaborn** 是基於 Matplotlib 的高階庫，專注於數據探索與統計圖表，提供更易用和美觀的接口。

學習目標：  
1. 掌握基本的 Matplotlib 圖表繪製方法。  
2. 使用 Seaborn 繪製更高級和直觀的統計圖表。  
3. 能夠選擇適合的視覺化工具來展示數據。

---

## **課程內容**

### **1. Matplotlib 基本使用**  

#### **繪製基本圖表**  
```python
import matplotlib.pyplot as plt

# 簡單的折線圖
x = [1, 2, 3, 4, 5]
y = [2, 3, 5, 7, 11]

plt.plot(x, y, marker='o', color='blue', linestyle='--')
plt.title("Line Chart Example")
plt.xlabel("X-axis")
plt.ylabel("Y-axis")
plt.grid(True)
plt.show()
```

#### **繪製柱狀圖與直方圖**  
```python
# 柱狀圖
categories = ['A', 'B', 'C']
values = [10, 15, 7]

plt.bar(categories, values, color='green')
plt.title("Bar Chart Example")
plt.show()

# 直方圖
data = [1, 2, 2, 3, 3, 3, 4, 4, 5]
plt.hist(data, bins=5, color='orange', edgecolor='black')
plt.title("Histogram Example")
plt.show()
```

#### **子圖排列**  
```python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

# 第一個子圖
axes[0, 0].plot(x, y, label="Line")
axes[0, 0].set_title("Line Chart")

# 第二個子圖
axes[0, 1].bar(categories, values, color='purple')
axes[0, 1].set_title("Bar Chart")

# 第三個子圖
axes[1, 0].hist(data, bins=5, color='pink', edgecolor='black')
axes[1, 0].set_title("Histogram")

# 第四個子圖
axes[1, 1].scatter(x, y, color='red')
axes[1, 1].set_title("Scatter Plot")

plt.tight_layout()
plt.show()
```

---

### **2. Seaborn 快速上手**

#### **基本圖表繪製**  
```python
import seaborn as sns
import pandas as pd

# 創建樣本數據
data = pd.DataFrame({
    'Category': ['A', 'A', 'B', 'B', 'C', 'C'],
    'Value': [10, 12, 15, 17, 7, 8]
})

# 條形圖
sns.barplot(x='Category', y='Value', data=data, palette='viridis')
plt.title("Bar Chart with Seaborn")
plt.show()
```

#### **分佈圖與密度圖**  
```python
# 隨機數據
import numpy as np
data = np.random.normal(size=1000)

# 分佈圖
sns.histplot(data, kde=True, color='blue')
plt.title("Histogram and Density Plot")
plt.show()
```

#### **散點圖與回歸分析**  
```python
# 數據生成
data = pd.DataFrame({
    'X': np.random.rand(100),
    'Y': np.random.rand(100)
})

# 散點圖
sns.scatterplot(x='X', y='Y', data=data, color='purple')
plt.title("Scatter Plot")
plt.show()

# 帶回歸線的散點圖
sns.regplot(x='X', y='Y', data=data, scatter_kws={'color': 'orange'}, line_kws={'color': 'red'})
plt.title("Scatter Plot with Regression Line")
plt.show()
```

---

### **3. 進階應用與美化**

#### **熱力圖與相關性分析**  
```python
# 隨機生成數據
corr_data = pd.DataFrame(np.random.rand(5, 5), columns=list('ABCDE'))

# 熱力圖
sns.heatmap(corr_data, annot=True, cmap='coolwarm', fmt='.2f')
plt.title("Heatmap Example")
plt.show()
```

#### **分組箱型圖與小提琴圖**  
```python
# 分組數據
data = pd.DataFrame({
    'Category': np.random.choice(['A', 'B', 'C'], size=100),
    'Value': np.random.normal(size=100)
})

# 箱型圖
sns.boxplot(x='Category', y='Value', data=data, palette='Set2')
plt.title("Boxplot Example")
plt.show()

# 小提琴圖
sns.violinplot(x='Category', y='Value', data=data, palette='Set3')
plt.title("Violin Plot Example")
plt.show()
```

---

### **4. Matplotlib 與 Seaborn 的綜合應用**

#### **可視化案例：分析銷售數據**  
```python
# 假設數據
sales_data = pd.DataFrame({
    'Month': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    'Sales': [200, 250, 300, 400, 350],
    'Profit': [50, 60, 80, 100, 90]
})

# 散點圖展示銷售與利潤的關係
sns.scatterplot(x='Sales', y='Profit', data=sales_data, size='Profit', hue='Month', palette='cool')
plt.title("Sales vs Profit")
plt.show()
```

---

### **課後練習**

1. 使用 Matplotlib：繪製一個多子圖展示數據，包括折線圖、柱狀圖和直方圖。  
2. 使用 Seaborn：在任意數據集中，分析相關性並繪製熱力圖；同時嘗試繪製箱型圖或小提琴圖。  
3. 比較 Matplotlib 和 Seaborn，試著回答：什麼情境下選擇哪個工具更合適？  
