---
title: LeetCode - Lowest Common Ancestor of a Binary Tree（二元樹的最低公共祖先）
date: 2024-08-17 23:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個二元樹的根節點和兩個節點 `p` 和 `q`，找到這兩個節點的最低公共祖先（LCA）。在一棵二元樹中，節點 `p` 和 `q` 的最低公共祖先是距離 `p` 和 `q` 最近的節點，且這個節點是 `p` 和 `q` 的祖先。節點可以是它自己的祖先。"
---

## 題目描述
給定一個二元樹的根節點和兩個節點 `p` 和 `q`，找到這兩個節點的最低公共祖先（LCA）。

在一棵二元樹中，節點 `p` 和 `q` 的最低公共祖先是距離 `p` 和 `q` 最近的節點，且這個節點是 `p` 和 `q` 的祖先。節點可以是它自己的祖先。

**範例**：

```
輸入：
    root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
輸出：3
解釋：節點 5 和 1 的最低公共祖先是節點 3。

輸入：
    root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
輸出：5
解釋：節點 5 和 4 的最低公共祖先是節點 5，因為根據 LCA 定義，一個節點可以是它自己的祖先。
```

**限制**：
- 二元樹中的節點數量範圍是 `[2, 10^5]`。
- 節點值範圍是 `[-10^9, 10^9]`。
- 所有節點的值都是唯一的。
- `p` 和 `q` 都是不同的且一定存在於樹中。

## 解法思路
可以使用遞歸的方法來尋找最低公共祖先。遍歷樹中的每個節點，並在遞歸過程中同時檢查節點是否包含 `p` 或 `q`。如果某個節點是 `p` 和 `q` 的公共祖先，它的子節點應該同時包含 `p` 或 `q` 的至少一個。

### 遞歸方法
1. **遞歸結束條件**：當節點為 `None`，或者當節點為 `p` 或 `q` 時返回該節點。
2. **遞歸遍歷左右子樹**：
   - 在左子樹中查找 `p` 和 `q`。
   - 在右子樹中查找 `p` 和 `q`。
3. **判斷當前節點**：
   - 如果 `p` 和 `q` 分別位於當前節點的左右子樹中，則當前節點為 `p` 和 `q` 的最低公共祖先。
   - 如果 `p` 和 `q` 都在左子樹中，則返回左子樹結果。
   - 如果 `p` 和 `q` 都在右子樹中，則返回右子樹結果。

## 範例代碼

以下是遞歸解法的 Python 實現：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def lowestCommonAncestor(root, p, q):
    # 如果根節點為 None 或者根節點為 p 或 q，則直接返回根節點
    if not root or root == p or root == q:
        return root
    
    # 遞歸查找左右子樹
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    # 如果 p 和 q 分別在當前節點的左右子樹中，則當前節點為 LCA
    if left and right:
        return root
    
    # 否則返回非空的子樹（如果 p 和 q 在同一側，返回該側的根）
    return left if left else right
```

## 代碼解析
1. **基礎情況**：當根節點是 `None` 或等於 `p` 或 `q` 時，直接返回該節點。
2. **遞歸遍歷左右子樹**：如果左右子樹都返回非空結果，說明當前節點是 `p` 和 `q` 的最低公共祖先。
3. **返回結果**：返回非空的子樹，如果只有左或右子樹含有 `p` 或 `q`，則返回該子樹的結果。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是二元樹的節點數量。每個節點都會被遍歷一次。
- **空間複雜度**：O(H)，其中 `H` 是二元樹的高度，取決於遞歸調用的最大深度。