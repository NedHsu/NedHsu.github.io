---
title: LeetCode - Convert Sorted Array to BST（將排序數組轉換為平衡二元搜尋樹）
date: 2024-08-18 22:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個遞增排序的整數數組，將其轉換為一棵高度平衡的二元搜尋樹（BST）。高度平衡的意思是：每個節點的左右子樹高度差不超過 1。"
---

## 題目描述
給定一個遞增排序的整數數組，將其轉換為一棵高度平衡的二元搜尋樹（BST）。高度平衡的意思是：每個節點的左右子樹高度差不超過 1。

**範例**：

```
輸入：nums = [-10, -3, 0, 5, 9]
輸出：[0, -3, 9, -10, null, 5]
解釋：[0, -10, 5, null, -3, null, 9] 也是正確答案。
```

## 解法思路
利用二元搜尋樹和數組的特性，我們可以通過以下步驟將排序數組轉換為一棵平衡 BST：
1. 選擇數組的中間元素作為根節點，這樣左右兩側的元素數量會相等或接近相等。
2. 遞歸構建左子樹和右子樹：
   - 左子樹：使用中間元素左邊的子數組。
   - 右子樹：使用中間元素右邊的子數組。

這樣每次遞歸選擇中點作為根節點，最終得到的樹會是一棵高度平衡的 BST。

## 範例代碼

以下是 Python 的遞歸實現：

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def sortedArrayToBST(nums):
    # 定義遞歸函數
    def helper(left, right):
        # 基礎條件：如果左邊界大於右邊界，返回 None
        if left > right:
            return None
        
        # 選擇中間元素作為根節點
        mid = (left + right) // 2
        root = TreeNode(nums[mid])

        # 遞歸構建左子樹和右子樹
        root.left = helper(left, mid - 1)
        root.right = helper(mid + 1, right)

        return root

    # 初始調用，使用整個數組範圍
    return helper(0, len(nums) - 1)
```

## 代碼解析
1. **遞歸函數** `helper(left, right)`：接收當前子數組的左右邊界。
2. **基礎條件**：當 `left > right` 時，返回 `None`，表示子樹結束。
3. **選擇根節點**：選取當前子數組的中間元素作為根節點。
4. **遞歸構建左右子樹**：
   - 左子樹使用 `[left, mid - 1]` 範圍。
   - 右子樹使用 `[mid + 1, right]` 範圍。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是數組長度。每個元素都需要訪問一次。
- **空間複雜度**：O(log N)，對於平衡的二元搜尋樹，遞歸深度最多為 `log N`。
