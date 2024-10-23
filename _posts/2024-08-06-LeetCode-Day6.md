---
title: LeetCode - Day 4
date: 2024-08-06 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "
K 個一組翻轉鏈表 (Reverse Nodes in k-Group)、
最大矩形 (Maximal Rectangle)、
搜索旋轉排序數組 (Search in Rotated Sorted Array)、
N 皇后問題 (N-Queens)、
分隔鏈表 (Split Linked List in Parts)
"
---

## 18. **K 個一組翻轉鏈表 (Reverse Nodes in k-Group)**
   **題目描述**：給定一個鏈表，將其中每 `k` 個節點一組進行翻轉，並返回翻轉後的鏈表。如果節點數目不是 `k` 的倍數，則最後剩餘的節點保持原樣。

   **範例**：
   ```
   輸入：head = [1,2,3,4,5], k = 2
   輸出：[2,1,4,3,5]
   ```

   **解法思路**：
   1. 使用遞歸或迭代的方式，每次找到 `k` 個節點後，進行翻轉，然後將翻轉後的鏈表與剩餘的鏈表相接。
   2. 對於不足 `k` 個的最後一段鏈表，保持原樣。

   **範例代碼**（Python）：
   ```python
   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

   def reverseKGroup(head, k):
       def reverseLinkedList(head, k):
           prev, curr = None, head
           while k > 0:
               next_node = curr.next
               curr.next = prev
               prev = curr
               curr = next_node
               k -= 1
           return prev

       count = 0
       ptr = head
       while count < k and ptr:
           ptr = ptr.next
           count += 1

       if count == k:
           reversed_head = reverseLinkedList(head, k)
           head.next = reverseKGroup(ptr, k)
           return reversed_head
       return head
   ```

   **時間複雜度**：O(n)，n 是鏈表的長度。每個節點被訪問兩次，一次是計數，一次是翻轉。

---

## 19. **最大矩形 (Maximal Rectangle)**
   **題目描述**：給定一個由 '0' 和 '1' 組成的二維二進制矩陣，找出只包含 '1' 的最大矩形，並返回其面積。

   **範例**：
   ```
   輸入：
   [
     ["1","0","1","0","0"],
     ["1","0","1","1","1"],
     ["1","1","1","1","1"],
     ["1","0","0","1","0"]
   ]
   輸出：6
   ```

   **解法思路**：
   1. 可以將每一行看作直方圖的基礎，並利用 **84. 柱狀圖中最大的矩形** 的解法來處理每一行的最大矩形。
   2. 對每一行，計算其高度（即當前行及以上的 '1' 的連續個數），然後在每一行上運用柱狀圖的最大矩形算法。

   **範例代碼**（Python）：
   ```python
   def maximalRectangle(matrix):
       if not matrix:
           return 0

       def largestRectangleArea(heights):
           stack = []
           max_area = 0
           heights.append(0)
           for i in range(len(heights)):
               while stack and heights[i] < heights[stack[-1]]:
                   h = heights[stack.pop()]
                   w = i if not stack else i - stack[-1] - 1
                   max_area = max(max_area, h * w)
               stack.append(i)
           return max_area

       max_area = 0
       heights = [0] * len(matrix[0])
       for row in matrix:
           for i in range(len(row)):
               heights[i] = heights[i] + 1 if row[i] == '1' else 0
           max_area = max(max_area, largestRectangleArea(heights))
       return max_area
   ```

   **時間複雜度**：O(m * n)，m 和 n 分別是矩陣的行數和列數。對每一行計算高度，並且對每一行運行 O(n) 的柱狀圖算法。

---

## 20. **搜索旋轉排序數組 (Search in Rotated Sorted Array)**
   **題目描述**：給定一個已經旋轉過的升序排序數組，要求在其中搜索某個目標值，並返回其索引。如果目標值不存在，返回 -1。

   **範例**：
   ```
   輸入：nums = [4,5,6,7,0,1,2], target = 0
   輸出：4
   ```

   **解法思路**：
   1. 利用二分搜尋法來解決，首先找到旋轉點，然後根據旋轉點將數組劃分成兩部分。
   2. 對每次搜索的中點進行判斷，確定目標值位於哪一半，然後繼續進行二分搜尋。

   **範例代碼**（Python）：
   ```python
   def search(nums, target):
       left, right = 0, len(nums) - 1
       while left <= right:
           mid = (left + right) // 2
           if nums[mid] == target:
               return mid
           if nums[left] <= nums[mid]:
               if nums[left] <= target < nums[mid]:
                   right = mid - 1
               else:
                   left = mid + 1
           else:
               if nums[mid] < target <= nums[right]:
                   left = mid + 1
               else:
                   right = mid - 1
       return -1
   ```

   **時間複雜度**：O(log n)，n 是數組的長度。這是一個經典的二分搜尋變形問題。

---

## 21. **N 皇后問題 (N-Queens)**
   **題目描述**：給定一個整數 `n`，返回所有不同的 N 皇后問題的解。每一個解法的擺放方式要保證所有皇后彼此之間不會互相攻擊。

   **範例**：
   ```
   輸入：n = 4
   輸出：
   [
     [".Q..","...Q","Q...","..Q."],
     ["..Q.","Q...","...Q",".Q.."]
   ]
   ```

   **解法思路**：
   1. 使用回溯法來解決這個問題。對於每一行，我們嘗試將皇后放置在每一個可行的列中，並檢查是否會與前面的皇后發生衝突。
   2. 如果放置成功，則繼續遞歸處理下一行；如果放置失敗，則回退到前一步重新選擇。

   **範例代碼**（Python）：
   ```python
   def solveNQueens(n):
       def is_valid(board, row, col):
           for i in range(row):
               if board[i] == col or abs(board[i] - col) == abs(i - row):
                   return False
           return True

       def backtrack(row, board):
           if row == n:
               result.append(['.' * board[i] + 'Q' + '.' * (n - board[i] - 1) for i in range(n)])
               return
           for col in range(n):
               if is_valid(board, row, col):
                   board[row] = col
                   backtrack(row + 1, board)
                   board[row] = -1

       result = []
       backtrack(0, [-1] * n)
       return result
   ```

   **時間複雜度**：O(n!)，n 是棋盤的邊長。這是因為每一行最多有 n 個選擇，而每次選擇後需要進行有效性檢查。

---

## 22. **分隔鏈表 (Split Linked List in Parts)**
   **題目描述**：給定一個鏈表和一個整數 `k`，將鏈表分成 `k` 個部分，盡可能均勻分配節點。如果節點無法均勻分配，則較多的部分應包含一個額外的節點。

   **範例**：
   ```
   輸入：root = [1, 2, 3], k = 5
   輸出：[[1],[2],[3],[],[]]
   ```

   **解法思路**：
   1. 計算鏈表的長度，然後確定每個部分應該包含的節點數量，以及多餘的節點應該分配給前幾個部分。
   

 2. 遍歷鏈表，依次將節點分配到各部分，並將剩餘部分設置為空。

   **範例代碼**（Python）：
   ```python
   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

   def splitListToParts(root, k):
       curr = root
       length = 0
       while curr:
           length += 1
           curr = curr.next

       part_size, extra = divmod(length, k)
       result = []
       curr = root
       for i in range(k):
           head = curr
           for j in range(part_size + (i < extra) - 1):
               if curr:
                   curr = curr.next
           if curr:
               next_part, curr.next = curr.next, None
               curr = next_part
           result.append(head)
       return result
   ```

   **時間複雜度**：O(n)，n 是鏈表的長度。這是因為我們需要遍歷鏈表來計算其長度，並進行分隔。

---

這些題目涵蓋了不同的數據結構和算法，能幫助你理解和解決更複雜的問題。
