---
title: LeetCode - Binary Tree Level Order Traversal（二元樹的層次遍歷）
date: 2024-08-17 21:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個二元樹，返回其節點值的層次遍歷結果（即從上到下，逐層訪問每一層的節點）。"
---

## 題目描述
給定一個二元樹，返回其節點值的層次遍歷結果（即從上到下，逐層訪問每一層的節點）。

**範例**：

```
輸入：
    3
   / \
  9  20
    /  \
   15   7

輸出：[[3], [9, 20], [15, 7]]
```

**限制**：
- 樹中節點的數量範圍是 `[0, 2000]`。
- 節點的值範圍是 `[-1000, 1000]`。

## 解法思路
可以使用廣度優先搜索（BFS）來進行層次遍歷。BFS 可以逐層遍歷每個節點，並將每一層的節點值分別放入結果列表中。

### 方法：廣度優先搜索
1. **初始化隊列**：將根節點加入隊列中。
2. **逐層處理**：在每一層中，計算當前層的節點數量，依次訪問每個節點，並將其左右子節點加入下一層的隊列。
3. **記錄每層的節點值**：將每一層的節點值存入結果列表中。
4. **返回結果**：當所有層遍歷完成後，返回結果列表。

## 範例代碼

以下是 BFS 的 Python 實現：

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_nodes = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level_nodes.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_nodes)
    
    return result
```

## 代碼解析
1. **初始化**：將根節點加入 `queue`，初始化結果 `result` 為空。
2. **層次遍歷**：在每一層中，遍歷當前層的所有節點，並將節點值加入 `level_nodes`。
3. **更新隊列**：將每層結束後的節點值列表 `level_nodes` 加入 `result`。
4. **返回結果**：當所有層遍歷完成後，返回 `result`。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是二元樹中的節點數量，因為每個節點都被訪問一次。
- **空間複雜度**：O(N)，最壞情況下需要存儲所有節點的引用。
