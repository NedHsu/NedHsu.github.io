---
title: LeetCode - Day 9
date: 2024-08-11 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "合併兩個有序鏈表 (Merge Two Sorted Lists)、從排序數組中刪除重複項 (Remove Duplicates from Sorted Array)、搜索插入位置 (Search Insert Position)、買賣股票的最佳時機 (Best Time to Buy and Sell Stock)、最小窗口子字符串 (Minimum Window Substring)"
---

### 46. **合併兩個有序鏈表 (Merge Two Sorted Lists)**
   **題目描述**：給定兩個升序鏈表，將它們合併成一個新的升序鏈表並返回。

   **範例**：
   ```
   輸入：l1 = [1,2,4], l2 = [1,3,4]
   輸出：[1,1,2,3,4,4]
   ```

   **解法思路**：
   1. 使用一個指針遍歷兩個鏈表，將較小的節點添加到新鏈表中。
   2. 若某一鏈表結束，直接將另一鏈表的剩餘部分加入新鏈表中。

   **範例代碼**（Python）：
   ```python
   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

   def mergeTwoLists(l1, l2):
       dummy = ListNode()
       current = dummy
       while l1 and l2:
           if l1.val < l2.val:
               current.next = l1
               l1 = l1.next
           else:
               current.next = l2
               l2 = l2.next
           current = current.next
       current.next = l1 if l1 else l2
       return dummy.next
   ```

   **時間複雜度**：O(n + m)，其中 `n` 和 `m` 分別是兩個鏈表的長度。

---

### 47. **從排序數組中刪除重複項 (Remove Duplicates from Sorted Array)**
   **題目描述**：給定一個升序排列的整數數組，移除其中的重複項，使每個元素只出現一次，並返回新的長度。

   **範例**：
   ```
   輸入：nums = [0,0,1,1,1,2,2,3,3,4]
   輸出：5, nums = [0,1,2,3,4]
   ```

   **解法思路**：
   1. 使用雙指針方法：左指針記錄不重複元素的最後位置，右指針遍歷整個數組。
   2. 當右指針指向的新元素與左指針的不同時，更新左指針位置並寫入新值。

   **範例代碼**（Python）：
   ```python
   def removeDuplicates(nums):
       if not nums:
           return 0
       left = 0
       for right in range(1, len(nums)):
           if nums[right] != nums[left]:
               left += 1
               nums[left] = nums[right]
       return left + 1
   ```

   **時間複雜度**：O(n)，其中 `n` 是數組長度。

---

### 48. **搜索插入位置 (Search Insert Position)**
   **題目描述**：給定一個升序排列的數組和一個目標值，返回目標值的插入位置，使數組仍然有序。

   **範例**：
   ```
   輸入：nums = [1,3,5,6], target = 5
   輸出：2
   ```

   **解法思路**：
   1. 使用二分搜索，找到目標值或插入位置。
   2. 當 `left > right` 時，`left` 的位置就是插入位置。

   **範例代碼**（Python）：
   ```python
   def searchInsert(nums, target):
       left, right = 0, len(nums) - 1
       while left <= right:
           mid = (left + right) // 2
           if nums[mid] == target:
               return mid
           elif nums[mid] < target:
               left = mid + 1
           else:
               right = mid - 1
       return left
   ```

   **時間複雜度**：O(log n)。

---

### 49. **買賣股票的最佳時機 (Best Time to Buy and Sell Stock)**
   **題目描述**：給定一個價格數組 `prices`，其中 `prices[i]` 是某只股票第 `i` 天的價格。你只能選擇某一天買入，並選擇在某天賣出，返回最大利潤（買入後賣出當天的收益）。

   **範例**：
   ```
   輸入：prices = [7,1,5,3,6,4]
   輸出：5
   ```

   **解法思路**：
   1. 初始化 `min_price` 為無限大，記錄歷史最低價格。
   2. 每天計算當前價格與 `min_price` 的差值，更新最大利潤。

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

   **時間複雜度**：O(n)。

---

### 50. **最小窗口子字符串 (Minimum Window Substring)**
   **題目描述**：給定兩個字符串 `s` 和 `t`，找到 `s` 中包含 `t` 中所有字母的最小子字符串。

   **範例**：
   ```
   輸入：s = "ADOBECODEBANC", t = "ABC"
   輸出："BANC"
   ```

   **解法思路**：
   1. 使用滑動窗口，維持當前窗口內 `t` 的字母計數。
   2. 當窗口包含所有字母後，收縮左邊界以找到最小子字符串。

   **範例代碼**（Python）：
   ```python
   from collections import Counter

   def minWindow(s, t):
       if not s or not t:
           return ""
       dict_t = Counter(t)
       required = len(dict_t)
       l, r = 0, 0
       formed = 0
       window_counts = {}
       ans = float("inf"), None, None

       while r < len(s):
           character = s[r]
           window_counts[character] = window_counts.get(character, 0) + 1
           if character in dict_t and window_counts[character] == dict_t[character]:
               formed += 1

           while l <= r and formed == required:
               character = s[l]
               if r - l + 1 < ans[0]:
                   ans = (r - l + 1, l, r)
               window_counts[character] -= 1
               if character in dict_t and window_counts[character] < dict_t[character]:
                   formed -= 1
               l += 1
           r += 1
       return "" if ans[0] == float("inf") else s[ans[1]: ans[2] + 1]
   ```

   **時間複雜度**：O(|S| + |T|)，其中 |S| 和 |T| 分別是字符串 `s` 和 `t` 的長度。

---

這些題目有助於強化數據結構和算法的應用，如雙指針、滑動窗口、排序、以及動態規劃。掌握這些基礎題後，你會更具備應對各種算法題的信心。隨時告訴我需要進一步解釋或更多題目！
