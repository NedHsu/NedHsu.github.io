---
title: LeetCode - Invert Binary Tree（二元樹翻轉）
date: 2024-08-17 20:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個二元樹，翻轉該樹，即將每個節點的左右子樹交換。返回翻轉後的樹的根節點。"
---

## 題目描述
給定一個二元樹，翻轉該樹，即將每個節點的左右子樹交換。返回翻轉後的樹的根節點。

**範例**：

```
輸入：
     4
   /   \
  2     7
 / \   / \
1   3 6   9

輸出：
     4
   /   \
  7     2
 / \   / \
9   6 3   1
```

**限制**：
- 節點的數量範圍是 `[0, 100]`。
- 節點值範圍是 `[-100, 100]`。

## 解法思路
可以使用遞歸（深度優先搜索）或迭代（廣度優先搜索）來翻轉二元樹。

### 方法 1：遞歸法
1. **基礎情況**：如果節點為 `None`，直接返回 `None`。
2. **遞歸步驟**：調換當前節點的左、右子樹，並對左右子樹分別調用遞歸函數進行翻轉。
3. **返回結果**：返回當前節點（翻轉後的樹）。

## 範例代碼

以下是遞歸法的 Python 實現：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invertTree(root):
    if not root:
        return None
    # 交換左右子樹
    root.left, root.right = root.right, root.left
    # 遞歸翻轉左右子樹
    invertTree(root.left)
    invertTree(root.right)
    return root
```

### 方法 2：迭代法（廣度優先搜索）
使用廣度優先搜索（BFS）來逐層翻轉每個節點的左右子樹。
1. **初始化隊列**：將根節點放入隊列中。
2. **逐層翻轉**：對隊列中的每個節點，交換其左右子樹並將非空的左右子節點加入隊列。
3. **返回結果**：返回根節點（翻轉後的樹）。

## 範例代碼

以下是迭代法的 Python 實現：

```python
from collections import deque

def invertTree(root):
    if not root:
        return None
    queue = deque([root])
    while queue:
        node = queue.popleft()
        # 交換左右子樹
        node.left, node.right = node.right, node.left
        # 將左右子樹加入隊列
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return root
```

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是二元樹中的節點數量，需要遍歷所有節點。
- **空間複雜度**：
  - 遞歸法：最壞情況下為 O(H)，其中 `H` 是二元樹的高度，對應於遞歸調用的最大深度。
  - 迭代法：最壞情況下為 O(N)，需要存儲每層的節點。
