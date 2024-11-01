---
title: LeetCode - Validate Binary Search Tree（驗證二元搜尋樹）
date: 2024-08-18 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個二元樹的根節點，判斷該樹是否為有效的二元搜尋樹（BST）。"
---

## 題目描述
給定一個二元樹的根節點，判斷該樹是否為有效的二元搜尋樹（BST）。

一個二元搜尋樹應滿足以下條件：
1. 對於每個節點，其左子樹中的所有節點值小於該節點的值。
2. 對於每個節點，其右子樹中的所有節點值大於該節點的值。
3. 左右子樹也必須是二元搜尋樹。

**範例**：

```
輸入：
    root = [2,1,3]
輸出：true

輸入：
    root = [5,1,4,null,null,3,6]
輸出：false
解釋：根節點的值是 5，但是右子節點 4 的值小於 5。
```

**限制**：
- 節點數量範圍是 `[1, 10^4]`。
- 節點的值是 `[-2^31, 2^31 - 1]`。

## 解法思路
可以使用**遞歸**或**中序遍歷**來驗證 BST 的有效性。

### 方法一：遞歸 + 範圍檢查
在遞歸過程中，為每個節點設定一個值範圍 `[min, max]`，用於約束該節點的值必須位於這個範圍內。這個範圍在每次遞歸時更新：
1. **左子樹**：節點值應小於當前節點值（即右邊界為當前節點值）。
2. **右子樹**：節點值應大於當前節點值（即左邊界為當前節點值）。

### 方法二：中序遍歷
中序遍歷 BST 會得到一個遞增的節點值序列，因此可以通過檢查中序遍歷序列是否為遞增來判斷是否為有效的 BST。

## 範例代碼

以下是遞歸 + 範圍檢查的 Python 實現：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if not (min_val < root.val < max_val):
        return False
    # 檢查左子樹和右子樹是否滿足條件
    return (isValidBST(root.left, min_val, root.val) and 
            isValidBST(root.right, root.val, max_val))
```

## 代碼解析
1. **基礎條件**：如果節點為 `None`，返回 `True`。
2. **範圍檢查**：若當前節點值不在 `[min_val, max_val]` 範圍內，則返回 `False`。
3. **遞歸檢查左右子樹**：使用當前節點的值更新左右子樹的範圍，並分別遞歸檢查左右子樹。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是節點的數量，因為每個節點都會被檢查一次。
- **空間複雜度**：O(H)，其中 `H` 是樹的高度，取決於遞歸調用的最大深度。
