---
title: LeetCode - Day 10
date: 2024-08-12 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "全排列 (Permutations)、二叉樹的最大深度 (Maximum Depth of Binary Tree)、對稱二叉樹 (Symmetric Tree)、合併K個排序鏈表 (Merge k Sorted Lists)、環形鏈表 (Linked List Cycle)、打家劫舍 (House Robber)"
---

### 51. **全排列 (Permutations)**
   **題目描述**：給定一個不含重複數字的整數數組 `nums`，返回其所有可能的排列。

   **範例**：
   ```
   輸入：nums = [1,2,3]
   輸出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
   ```

   **解法思路**：
   1. 使用回溯法構造所有排列。在每一層遞歸中，通過交換當前索引位置和下一個未處理位置的元素來生成不同的排列。
   2. 每次遞歸到達末端時即為一個完整排列，將其加入結果集中。

   **範例代碼**（Python）：
   ```python
   def permute(nums):
       res = []
       def backtrack(start):
           if start == len(nums):
               res.append(nums[:])
           for i in range(start, len(nums)):
               nums[start], nums[i] = nums[i], nums[start]
               backtrack(start + 1)
               nums[start], nums[i] = nums[i], nums[start]
       backtrack(0)
       return res
   ```

   **時間複雜度**：O(n * n!)，其中 `n` 是數組的長度。

---

### 52. **二叉樹的最大深度 (Maximum Depth of Binary Tree)**
   **題目描述**：給定一個二叉樹，找出其最大深度。樹的最大深度是從根節點到最遠葉子節點的最長路徑的節點數。

   **範例**：
   ```
   輸入：[3,9,20,null,null,15,7]
   輸出：3
   ```

   **解法思路**：
   1. 使用深度優先搜索（DFS）遞歸地計算每個節點的深度。
   2. 遍歷左右子樹，返回較大深度的結果再加上 1。

   **範例代碼**（Python）：
   ```python
   def maxDepth(root):
       if not root:
           return 0
       return 1 + max(maxDepth(root.left), maxDepth(root.right))
   ```

   **時間複雜度**：O(n)，其中 `n` 是二叉樹的節點數。

---

### 53. **對稱二叉樹 (Symmetric Tree)**
   **題目描述**：檢查一棵二叉樹是否是鏡像對稱的。

   **範例**：
   ```
   輸入：[1,2,2,3,4,4,3]
   輸出：true
   ```

   **解法思路**：
   1. 使用遞歸檢查左右子樹是否對稱。
   2. 兩個節點的對稱條件為其值相同，且各自的左子樹和對方的右子樹也對稱。

   **範例代碼**（Python）：
   ```python
   def isSymmetric(root):
       def isMirror(t1, t2):
           if not t1 and not t2:
               return True
           if not t1 or not t2:
               return False
           return (t1.val == t2.val) and isMirror(t1.left, t2.right) and isMirror(t1.right, t2.left)
       return isMirror(root, root)
   ```

   **時間複雜度**：O(n)。

---

### 54. **合併K個排序鏈表 (Merge k Sorted Lists)**
   **題目描述**：合併 `k` 個升序排序的鏈表，並將其作為一個排序的鏈表返回。

   **範例**：
   ```
   輸入：lists = [[1,4,5],[1,3,4],[2,6]]
   輸出：[1,1,2,3,4,4,5,6]
   ```

   **解法思路**：
   1. 使用最小堆（小頂堆）來合併 `k` 個鏈表。將每個鏈表的首節點放入堆中，依次取出最小的節點。
   2. 若堆中取出的節點有後續節點，則將其後續節點入堆。

   **範例代碼**（Python）：
   ```python
   import heapq

   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

       def __lt__(self, other):
           return self.val < other.val

   def mergeKLists(lists):
       dummy = ListNode()
       current = dummy
       heap = []
       for l in lists:
           if l:
               heapq.heappush(heap, l)
       while heap:
           node = heapq.heappop(heap)
           current.next = node
           current = current.next
           if node.next:
               heapq.heappush(heap, node.next)
       return dummy.next
   ```

   **時間複雜度**：O(n log k)，其中 `n` 是所有鏈表的節點數，`k` 是鏈表的數量。

---

### 55. **環形鏈表 (Linked List Cycle)**
   **題目描述**：給定一個鏈表，判斷其中是否有環。

   **範例**：
   ```
   輸入：head = [3,2,0,-4]，pos = 1（表示鏈表中存在一個環，尾指向索引為 1 的節點）
   輸出：true
   ```

   **解法思路**：
   1. 使用快慢指針，快指針每次前進兩步，慢指針每次前進一步。如果兩者在某個位置相遇，說明存在環。
   2. 若快指針或其下一個節點為 `None`，則無環。

   **範例代碼**（Python）：
   ```python
   def hasCycle(head):
       slow, fast = head, head
       while fast and fast.next:
           slow = slow.next
           fast = fast.next.next
           if slow == fast:
               return True
       return False
   ```

   **時間複雜度**：O(n)。

---

### 56. **打家劫舍 (House Robber)**
   **題目描述**：給定一個非負整數數組，代表每間房屋的存款量，你不能搶劫相鄰的兩間房屋，求最大可劫取金額。

   **範例**：
   ```
   輸入：[1,2,3,1]
   輸出：4
   ```

   **解法思路**：
   1. 使用動態規劃，定義 `dp[i]` 為搶到第 `i` 間房屋的最大金額。
   2. 狀態轉移公式為 `dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])`。

   **範例代碼**（Python）：
   ```python
   def rob(nums):
       if not nums:
           return 0
       if len(nums) == 1:
           return nums[0]
       dp = [0] * len(nums)
       dp[0], dp[1] = nums[0], max(nums[0], nums[1])
       for i in range(2, len(nums)):
           dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])
       return dp[-1]
   ```

   **時間複雜度**：O(n)。

---

這些題目涵蓋了鏈表操作、二叉樹遍歷、動態規劃、以及小頂堆等常見算法技巧，希望對你的 LeetCode 練習有所幫助！需要更多題目或進一步解釋，隨時告訴我。
