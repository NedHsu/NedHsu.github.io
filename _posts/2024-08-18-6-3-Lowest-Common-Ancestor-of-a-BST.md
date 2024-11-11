---
title: LeetCode - Lowest Common Ancestor of a BST（二元搜尋樹的最低公共祖先）
date: 2024-08-18 21:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個二元搜尋樹（BST）的根節點以及兩個節點 `p` 和 `q`，找到它們的最低公共祖先（LCA）。"
---

## 題目描述
給定一個二元搜尋樹（BST）的根節點以及兩個節點 `p` 和 `q`，找到它們的最低公共祖先（LCA）。

在二元搜尋樹中，最低公共祖先（LCA）定義為距離 `p` 和 `q` 最近的節點，且該節點是 `p` 和 `q` 的祖先。由於是二元搜尋樹，因此有以下特性：
- 對於每個節點 `N`，左子樹的所有節點值小於 `N.val`，右子樹的所有節點值大於 `N.val`。

**範例**：

```
輸入：root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
輸出：6
解釋：節點 2 和 8 的最低公共祖先是 6。

輸入：root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
輸出：2
解釋：節點 2 和 4 的最低公共祖先是 2，因為根據 LCA 定義，一個節點可以是它自己的祖先。
```

**限制**：
- 節點的數量範圍是 `[2, 10^5]`。
- 每個節點的值都是唯一的，且為 `[-10^9, 10^9]` 範圍內的整數。
- `p` 和 `q` 一定在樹中。

## 解法思路
利用二元搜尋樹的特性，可以更高效地找到最低公共祖先。遍歷過程中：
1. 如果當前節點值同時大於 `p` 和 `q` 的值，則 `p` 和 `q` 必在當前節點的左子樹中，移動至左子節點。
2. 如果當前節點值同時小於 `p` 和 `q` 的值，則 `p` 和 `q` 必在當前節點的右子樹中，移動至右子節點。
3. 否則，當前節點即為 `p` 和 `q` 的最低公共祖先。

## 範例代碼

以下是利用 BST 特性的 Python 解法：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    current = root
    while current:
        # 如果 p 和 q 都小於當前節點，移動到左子樹
        if p.val < current.val and q.val < current.val:
            current = current.left
        # 如果 p 和 q 都大於當前節點，移動到右子樹
        elif p.val > current.val and q.val > current.val:
            current = current.right
        else:
            # 否則當前節點為 LCA
            return current
```

## 代碼解析
1. **遍歷 BST**：從根節點開始遍歷，根據 `p` 和 `q` 值的大小進行選擇。
2. **判斷條件**：
   - 當 `p` 和 `q` 值同時小於當前節點值時，移動到左子樹。
   - 當 `p` 和 `q` 值同時大於當前節點值時，移動到右子樹。
   - 當 `p` 和 `q` 值分佈在左右兩邊時，當前節點即為 LCA。

## 時間和空間複雜度
- **時間複雜度**：O(H)，其中 `H` 是樹的高度。最壞情況下，複雜度為 `O(N)`（對於不平衡的樹）。
- **空間複雜度**：O(1)，僅使用了常數額外空間。
