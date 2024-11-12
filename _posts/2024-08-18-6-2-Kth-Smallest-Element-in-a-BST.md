---
title: LeetCode - Kth Smallest Element in a BST（二元搜尋樹中的第 K 小元素）
date: 2024-08-18 20:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一棵二元搜尋樹（BST）和一個整數 `k`，找出該樹中的第 `k` 小的元素。"
---

## 題目描述
給定一棵二元搜尋樹（BST）和一個整數 `k`，找出該樹中的第 `k` 小的元素。

**範例**：

```
輸入：root = [3,1,4,null,2], k = 1
輸出：1

輸入：root = [5,3,6,2,4,null,null,1], k = 3
輸出：3
```

**限制**：
- 樹中節點的數量範圍是 `[1, 10^4]`。
- 每個節點的值都是唯一的，且都為正數。
- `k` 的值總是有效的，即 `1 <= k <=` 樹中節點的數量。

## 解法思路
利用 BST 的性質進行**中序遍歷**，因為中序遍歷 BST 會得到一個遞增的序列。只需在遍歷過程中計數，找到第 `k` 個節點即為所求的第 `k` 小元素。

### 中序遍歷解法
1. 使用遞歸或迭代方式進行中序遍歷。
2. 計數當前遍歷的節點數，當計數到 `k` 時，返回當前節點的值。

## 範例代碼

以下是中序遍歷的 Python 實現：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kthSmallest(root, k):
    stack = []
    current = root
    count = 0

    # 使用迭代的中序遍歷
    while stack or current:
        # 先遍歷左子樹
        while current:
            stack.append(current)
            current = current.left
        
        # 處理當前節點
        current = stack.pop()
        count += 1
        # 如果當前計數等於 k，則返回當前節點值
        if count == k:
            return current.val
        
        # 遍歷右子樹
        current = current.right
```

## 代碼解析
1. **迭代中序遍歷**：利用堆疊（`stack`）模擬遞歸，進行中序遍歷。
2. **計數**：每次彈出節點時計數，當計數達到 `k` 時，返回當前節點的值。

## 時間和空間複雜度
- **時間複雜度**：O(H + k)，其中 `H` 是樹的高度。最壞情況下，可能遍歷至最深的節點，因此複雜度為 `O(N)`。
- **空間複雜度**：O(H)，其中 `H` 是堆疊的深度。
