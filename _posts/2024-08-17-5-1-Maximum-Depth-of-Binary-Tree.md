---
title: LeetCode - Maximum Depth of Binary Tree（二元樹的最大深度）
date: 2024-08-17 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個整數數組 `nums` 和一個目標值 `target`，請在該數組中找出和為目標值的那兩個整數，並返回它們的索引"
---

## 題目描述
給定一個二元樹，找出其最大深度。二元樹的深度是從根節點到最遠葉節點的最長路徑上的節點數。

**範例**：

```
輸入：root = [3,9,20,null,null,15,7]
輸出：3
解釋：此二元樹的最大深度為 3。
```

```
輸入：root = [1,null,2]
輸出：2
```

**限制**：
- 二元樹的節點數量範圍是 `[0, 10^4]`。
- 樹的深度範圍不限，樹可能是空的。

## 解法思路
可以通過遞歸（深度優先搜索，DFS）或迭代（廣度優先搜索，BFS）來求解。

### 方法 1：遞歸法（深度優先搜索）
1. **遞歸結束條件**：當節點為 `None` 時，返回深度 `0`。
2. **遞歸步驟**：對左右子樹分別求最大深度，取兩者中的較大值再加 `1` 即為當前節點的深度。
3. **返回結果**：返回左右子樹深度中的最大值 + 1。

## 範例代碼

以下是遞歸法的 Python 實現：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def maxDepth(root):
    if not root:
        return 0
    left_depth = maxDepth(root.left)
    right_depth = maxDepth(root.right)
    return max(left_depth, right_depth) + 1
```

### 方法 2：迭代法（廣度優先搜索）
使用廣度優先搜索（BFS）來逐層遍歷二元樹，計算樹的深度。
1. **初始化隊列**：將根節點放入隊列中，深度初始為 `0`。
2. **逐層遍歷**：每次遍歷一層節點，深度加 `1`。
3. **返回結果**：當遍歷完所有層後，深度即為最大深度。

## 範例代碼

以下是迭代法的 Python 實現：

```python
from collections import deque

def maxDepth(root):
    if not root:
        return 0
    queue = deque([root])
    depth = 0
    while queue:
        depth += 1
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return depth
```

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是二元樹中的節點數量，需要遍歷所有節點。
- **空間複雜度**：
  - 遞歸法：最壞情況下為 O(N)，取決於遞歸的最大深度。
  - 迭代法：最壞情況下為 O(N)，需要存儲每層的節點。
