---
title: LeetCode - Day 7
date: 2024-08-09 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "二元樹的最大深度 (Maximum Depth of Binary Tree)、爬樓梯 (Climbing Stairs)、合併兩個有序數組 (Merge Sorted Array)、有效的括號 (Valid Parentheses)、買賣股票的最佳時機 (Best Time to Buy and Sell Stock)、最小的 K 個數 (Kth Largest Element in an Array)"
---

## 34. **二元樹的最大深度 (Maximum Depth of Binary Tree)**
   **題目描述**：給定一個二元樹，找出其最大深度。樹的最大深度是從根節點到最遠葉子節點的最長路徑上的節點數。

   **範例**：
   ```
   輸入：
        3
       / \
      9  20
        /  \
       15   7

   輸出：3
   ```

   **解法思路**：
   1. 使用遞歸的深度優先搜索（DFS）來遍歷每個節點，計算左右子樹的深度，最終取其最大值。
   2. 根節點的深度為 1，依次遞歸到子節點，直到葉子節點返回深度。

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

   **時間複雜度**：O(n)，其中 `n` 是二元樹中的節點數量。每個節點都被訪問一次。

---

## 35. **爬樓梯 (Climbing Stairs)**
   **題目描述**：假設你正在爬一個樓梯，總共需要 `n` 步才能到達頂端。每次你可以爬 1 或 2 步，求有多少種不同的方法可以爬到頂端。

   **範例**：
   ```
   輸入：n = 3
   輸出：3
   說明：共有三種方法：
   1. 1 步 + 1 步 + 1 步
   2. 1 步 + 2 步
   3. 2 步 + 1 步
   ```

   **解法思路**：
   1. 這是一個經典的動態規劃問題，類似於斐波那契數列。當你爬到第 `n` 步時，只可能是從 `n-1` 步或 `n-2` 步到達的。
   2. 定義動態規劃狀態 `dp[i]`，表示到達第 `i` 步的方法數。遞推公式為 `dp[i] = dp[i-1] + dp[i-2]`。

   **範例代碼**（Python）：
   ```python
   def climbStairs(n):
       if n <= 2:
           return n
       dp = [0] * (n + 1)
       dp[1], dp[2] = 1, 2
       for i in range(3, n + 1):
           dp[i] = dp[i - 1] + dp[i - 2]
       return dp[n]
   ```

   **時間複雜度**：O(n)，其中 `n` 是樓梯的步數。

---

## 36. **合併兩個有序數組 (Merge Sorted Array)**
   **題目描述**：給定兩個有序整數數組 `nums1` 和 `nums2`，將 `nums2` 合併到 `nums1` 中，使得合併後的數組也是有序的。`nums1` 的初始長度為 `m + n`，其中前 `m` 個元素表示有效的數據，後面 `n` 個位置為空，存放 `nums2` 的元素。

   **範例**：
   ```
   輸入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
   輸出：[1,2,2,3,5,6]
   ```

   **解法思路**：
   1. 從後向前遍歷，這樣可以避免覆蓋掉 `nums1` 中已有的數據。每次從 `nums1` 和 `nums2` 中選取最大的元素，放置到 `nums1` 的末尾。
   2. 當其中一個數組遍歷完後，將另一個數組的剩餘部分直接放入 `nums1` 中。

   **範例代碼**（Python）：
   ```python
   def merge(nums1, m, nums2, n):
       i, j, k = m - 1, n - 1, m + n - 1
       while i >= 0 and j >= 0:
           if nums1[i] > nums2[j]:
               nums1[k] = nums1[i]
               i -= 1
           else:
               nums1[k] = nums2[j]
               j -= 1
           k -= 1
       nums1[:j + 1] = nums2[:j + 1]
   ```

   **時間複雜度**：O(m + n)，其中 `m` 和 `n` 分別是 `nums1` 和 `nums2` 的長度。

---

## 37. **有效的括號 (Valid Parentheses)**
   **題目描述**：給定一個只包括 `'('、')'、'{'、'}'、'['、']'` 的字符串，判斷字符串是否有效。有效字符串需滿足：
   - 左括號必須用相同類型的右括號閉合。
   - 左括號必須以正確的順序閉合。

   **範例**：
   ```
   輸入："()[]{}"
   輸出：True
   ```

   **解法思路**：
   1. 使用堆疊來解決這個問題。當遇到左括號時，將其推入堆疊；當遇到右括號時，檢查堆疊頂部的元素是否與其匹配。如果匹配則彈出堆疊，否則返回 False。
   2. 最終，堆疊應該是空的，這樣才能確保所有的括號都被正確閉合。

   **範例代碼**（Python）：
   ```python
   def isValid(s):
       stack = []
       mapping = {')': '(', '}': '{', ']': '['}
       for char in s:
           if char in mapping:
               top_element = stack.pop() if stack else '#'
               if mapping[char] != top_element:
                   return False
           else:
               stack.append(char)
       return not stack
   ```

   **時間複雜度**：O(n)，其中 `n` 是字符串的長度。

---

## 38. **買賣股票的最佳時機 (Best Time to Buy and Sell Stock)**
   **題目描述**：給定一個數組，表示某支股票每天的價格，請找出買入和賣出股票以獲得最大利潤的最佳時機。你最多只能進行一次交易（即買一次和賣一次）。

   **範例**：
   ```
   輸入：[7,1,5,3,6,4]
   輸出：5
   說明：在第 2 天（價格 = 1）買入，並在第 5 天（價格 = 6）賣出，利潤 = 6-1 = 5。
   ```

   **解法思路**：
   1. 我們需要找到一個最小的買入價格，並在其後找到一個最大的賣出價格來最大化利潤。
   2. 可以在一次遍歷中完成這個操作，保持追蹤當前的最小價格和最大利潤。

   **範例代碼**（Python）：
   ```python
   def maxProfit(prices):
       min_price = float('inf')
       max_profit = 0
       for price in prices:
           min_price = min(min_price, price)
           max_profit = max(max_profit, price - min_price)
       return max_profit
   ```

   **時間複雜度**：O(n)，其中 `n` 是價格數組的長度。

---

## 39. **最小的 K 個數 (Kth Largest Element in an Array)**
   **題目描述**：給定一個未排序的數組，找到其中第 K 大的元素。

   **範

例**：
   ```
   輸入：[3,2,1,5,6,4], k = 2
   輸出：5
   ```

   **解法思路**：
   1. 可以使用快排的思想來解決這個問題，進行部分排序。
   2. 也可以使用最小堆來維持當前找到的最大元素，然後將元素放入堆中。

   **範例代碼**（Python）：
   ```python
   import heapq

   def findKthLargest(nums, k):
       return heapq.nlargest(k, nums)[-1]
   ```

   **時間複雜度**：O(n log k)，其中 `n` 是數組長度。

---

這些題目進一步幫助你掌握不同算法和數據結構的應用。
