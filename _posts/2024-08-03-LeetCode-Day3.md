---
title: LeetCode - Day 1
date: 2024-08-03 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "
兩數之和 (Two Sum)、
反轉鏈表 (Reverse Linked List)、
全排列 (Permutations)、
最大子序和 (Maximum Subarray)、
二叉樹的最大深度 (Maximum Depth of Binary Tree)
"
---

## 1. **兩數之和 (Two Sum)**
   **題目描述**：給定一個整數數組 `nums` 和一個目標值 `target`，請在該數組中找出和為目標值的那兩個整數，並返回它們的索引。

   **範例**：
   ```
   輸入：nums = [2, 7, 11, 15], target = 9
   輸出：[0, 1]
   解釋：因為 nums[0] + nums[1] == 9，返回 [0, 1]。
   ```

   **解法思路**：
   1. 使用哈希表來記錄已經遍歷過的數字及其索引。
   2. 每遍歷一個數字，檢查其與目標值的差是否存在於哈希表中，若存在，則返回結果。

   **範例代碼**（Python）：
   ```python
   def twoSum(nums, target):
       num_map = {}
       for i, num in enumerate(nums):
           diff = target - num
           if diff in num_map:
               return [num_map[diff], i]
           num_map[num] = i
       return []
   ```

   **時間複雜度**：O(n)，其中 n 是數組中的元素數量。哈希表查找時間是 O(1)，所以整體運行時間是線性的。

---

## 2. **反轉鏈表 (Reverse Linked List)**
   **題目描述**：給定一個單向鏈表，將其反轉並返回反轉後的鏈表。

   **範例**：
   ```
   輸入：1 -> 2 -> 3 -> 4 -> 5 -> NULL
   輸出：5 -> 4 -> 3 -> 2 -> 1 -> NULL
   ```

   **解法思路**：
   1. 使用三個指針：`prev`、`current`、`next`。
   2. 循環遍歷鏈表，依次將 `current.next` 指向 `prev`，實現鏈表反轉。

   **範例代碼**（Python）：
   ```python
   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

   def reverseList(head):
       prev = None
       current = head
       while current:
           next_node = current.next
           current.next = prev
           prev = current
           current = next_node
       return prev
   ```

   **時間複雜度**：O(n)，n 是鏈表中的節點數量。每個節點只被訪問一次。

---

## 3. **全排列 (Permutations)**
   **題目描述**：給定一個沒有重複數字的整數數組，返回其所有可能的排列。

   **範例**：
   ```
   輸入：[1, 2, 3]
   輸出：
   [
     [1, 2, 3],
     [1, 3, 2],
     [2, 1, 3],
     [2, 3, 1],
     [3, 1, 2],
     [3, 2, 1]
   ]
   ```

   **解法思路**：
   使用回溯法。對於每個位置，將未使用的數字放入該位置，並遞歸地處理剩下的數字。

   **範例代碼**（Python）：
   ```python
   def permute(nums):
       result = []
       def backtrack(path, remaining):
           if not remaining:
               result.append(path)
               return
           for i in range(len(remaining)):
               backtrack(path + [remaining[i]], remaining[:i] + remaining[i+1:])
       backtrack([], nums)
       return result
   ```

   **時間複雜度**：O(n!)，因為一共有 n! 種不同的排列方式，每個排列都需要 O(n) 的時間來構造。

---

## 4. **最大子序和 (Maximum Subarray)**
   **題目描述**：給定一個整數數組，找到具有最大和的連續子數組，並返回其和。

   **範例**：
   ```
   輸入：nums = [-2,1,-3,4,-1,2,1,-5,4]
   輸出：6
   解釋：連續子數組 [4,-1,2,1] 的和最大，為 6。
   ```

   **解法思路**：
   1. 使用動態規劃，對於每個數字，計算以它為結尾的最大子序和。
   2. 當前最大子序和要么是自身，要么是與之前的最大子序和相加。

   **範例代碼**（Python）：
   ```python
   def maxSubArray(nums):
       max_current = max_global = nums[0]
       for num in nums[1:]:
           max_current = max(num, max_current + num)
           if max_current > max_global:
               max_global = max_current
       return max_global
   ```

   **時間複雜度**：O(n)，n 是數組中的元素數量。每個元素只被遍歷一次。

---

## 5. **二叉樹的最大深度 (Maximum Depth of Binary Tree)**
   **題目描述**：給定一個二叉樹，找出其最大深度。樹的深度是指從根節點到最遠葉子節點的最長路徑上的節點數量。

   **範例**：
   ```
   輸入：[3, 9, 20, None, None, 15, 7]
   輸出：3
   ```

   **解法思路**：
   使用遞迴方法，對每個節點，遞迴地計算其左子樹和右子樹的深度，取較大的深度加 1 即為當前節點的深度。

   **範例代碼**（Python）：
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

   **時間複雜度**：O(n)，n 是二叉樹中的節點數量。每個節點只被訪問一次。

---

這些例子涵蓋了常見的算法題型（如哈希表、鏈表、回溯、動態規劃和樹）。
