---
title: LeetCode - Serialize and Deserialize Binary Tree（二元樹的序列化與反序列化）
date: 2024-08-17 22:00:00 +0800
categories: [Software, LeetCode]
excerpt: "設計一種算法來將二元樹轉換為字符串（序列化）並將字符串轉換回二元樹（反序列化）。"
---

## 題目描述
設計一種算法來將二元樹轉換為字符串（序列化）並將字符串轉換回二元樹（反序列化）。

**要求**：
- 需要實現 `serialize(root)` 和 `deserialize(data)` 兩個函數。
- `serialize(root)` 將一棵二元樹轉換為字符串。
- `deserialize(data)` 將字符串轉換回原本的二元樹結構。

**範例**：

```
輸入：root = [1,2,3,null,null,4,5]
序列化：1,2,3,null,null,4,5
反序列化後恢復的二元樹為 [1,2,3,null,null,4,5]
```

**限制**：
- 節點數量範圍是 `[0, 10^4]`。
- 節點值的範圍是 `[-1000, 1000]`。

## 解法思路
可以使用**廣度優先搜索（BFS）**或**深度優先搜索（DFS）**進行序列化和反序列化。這裡採用 BFS 來編碼和解碼樹。

### 方法：廣度優先搜索
1. **序列化**（`serialize`）：
   - 利用 BFS 遍歷每個節點，將節點值加入結果字符串中，並用 `null` 表示空節點。
   - 將節點值和 `null` 之間用 `,` 分隔。
   
2. **反序列化**（`deserialize`）：
   - 將序列化的字符串轉換回節點列表，並初始化根節點。
   - 使用 BFS 遍歷該列表，根據每個節點的值生成左右子節點並重建樹結構。

## 範例代碼

以下是 Python 中的實現：

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root):
        """Encodes a tree to a single string."""
        if not root:
            return ""
        
        result = []
        queue = deque([root])
        
        while queue:
            node = queue.popleft()
            if node:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append("null")
        
        return ",".join(result)

    def deserialize(self, data):
        """Decodes your encoded data to tree."""
        if not data:
            return None
        
        nodes = data.split(",")
        root = TreeNode(int(nodes[0]))
        queue = deque([root])
        index = 1
        
        while queue:
            node = queue.popleft()
            
            # 構建左子節點
            if nodes[index] != "null":
                node.left = TreeNode(int(nodes[index]))
                queue.append(node.left)
            index += 1
            
            # 構建右子節點
            if nodes[index] != "null":
                node.right = TreeNode(int(nodes[index]))
                queue.append(node.right)
            index += 1
        
        return root
```

## 代碼解析
1. **序列化**：
   - 使用 `queue` 進行 BFS 遍歷。
   - 遍歷節點，將節點值加入 `result` 列表，`null` 表示空子節點。
   - 最終返回以逗號分隔的字符串表示樹。

2. **反序列化**：
   - 先將字符串 `data` 分隔成 `nodes` 列表。
   - 使用 `queue` 進行 BFS，從 `nodes` 列表中依次取值來建立每個節點的左右子節點。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是節點的數量。序列化和反序列化過程都需要遍歷所有節點。
- **空間複雜度**：O(N)，需要額外的空間來存儲結果字符串和 `queue`。
