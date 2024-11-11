---
title: LeetCode - Search a 2D Matrix（搜索 2D 矩陣）
date: 2024-08-20 20:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個 `m x n` 的矩陣 `matrix` 和一個整數 `target`，在矩陣中搜索該目標值。該矩陣有以下特性：1. 每行中的整數從左到右排序。2. 每行的第一個整數大於前一行的最後一個整數。要求實現時間複雜度為 O(log(m * n)) 的算法。"
---

## 題目描述
給定一個 `m x n` 的矩陣 `matrix` 和一個整數 `target`，在矩陣中搜索該目標值。該矩陣有以下特性：
1. 每行中的整數從左到右排序。
2. 每行的第一個整數大於前一行的最後一個整數。

要求實現時間複雜度為 O(log(m * n)) 的算法。

**範例**：

```plaintext
輸入：matrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
], target = 3
輸出：true

輸入：matrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
], target = 13
輸出：false
```

**限制**：
- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 100`
- `-10^4 <= matrix[i][j], target <= 10^4`

## 解法思路
由於矩陣中每行從左到右排序，且每行的第一個元素大於前一行的最後一個元素，這個矩陣可以看作一個「展開」的有序一維數組。因此，我們可以對整個矩陣進行二分查找，將其索引值映射回原始的二維矩陣。

### 二分查找步驟：
1. 將矩陣視為一個長度為 `m * n` 的有序數組，其中 `m` 為行數，`n` 為列數。
2. 設置兩個指針 `left` 和 `right`，分別指向矩陣展開後數組的開始和結束。
3. 使用二分查找，不斷計算中間索引 `mid`，並將其映射到矩陣的行、列上：
   - 行索引 `row = mid // n`
   - 列索引 `col = mid % n`
4. 比較 `matrix[row][col]` 與 `target`：
   - 若相等，返回 `True`。
   - 若小於 `target`，將 `left` 設置為 `mid + 1`。
   - 若大於 `target`，將 `right` 設置為 `mid - 1`。
5. 若遍歷完未找到，返回 `False`。

## 代碼實現

以下是 Python 的實現：

```python
def searchMatrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
    
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1

    while left <= right:
        mid = left + (right - left) // 2
        row, col = divmod(mid, n)
        mid_value = matrix[row][col]

        if mid_value == target:
            return True
        elif mid_value < target:
            left = mid + 1
        else:
            right = mid - 1

    return False
```

## 代碼解析
1. **初始化指針**：`left` 設置為 0，`right` 設置為 `m * n - 1`。
2. **二分查找**：
   - 計算 `mid`，並將 `mid` 映射到矩陣中的 `row` 和 `col` 索引。
   - 比較 `matrix[row][col]` 與 `target`。
3. **返回結果**：若找到目標值返回 `True`，若遍歷完畢未找到則返回 `False`。

## 時間和空間複雜度
- **時間複雜度**：O(log(m * n))，由於對 `m * n` 個元素進行二分查找。
- **空間複雜度**：O(1)，只使用了常數空間。
