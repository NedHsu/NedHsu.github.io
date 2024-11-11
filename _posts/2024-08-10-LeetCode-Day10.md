---
title: LeetCode - Day 8
date: 2024-08-10 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "字母異位詞分組 (Group Anagrams)、最長回文子串 (Longest Palindromic Substring)、兩數相加 (Add Two Numbers)、搜索旋轉排序數組 (Search in Rotated Sorted Array)、子集 (Subsets)、合併區間 (Merge Intervals)"
---

## 40. **字母異位詞分組 (Group Anagrams)**
   **題目描述**：給定一個字符串數組，將異位詞分組。異位詞是指包含相同字母但順序不同的字符串。

   **範例**：
   ```
   輸入：["eat", "tea", "tan", "ate", "nat", "bat"]
   輸出：[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
   ```

   **解法思路**：
   1. 我們可以通過對每個字符串進行排序，將異位詞變成相同的排序結果，然後將這些相同的結果分組。
   2. 使用一個哈希表來儲存排序後的結果作為鍵，異位詞組作為值。

   **範例代碼**（Python）：
   ```python
   from collections import defaultdict

   def groupAnagrams(strs):
       anagrams = defaultdict(list)
       for s in strs:
           key = ''.join(sorted(s))
           anagrams[key].append(s)
       return list(anagrams.values())
   ```

   **時間複雜度**：O(n * k log k)，其中 `n` 是字符串數組的長度，`k` 是字符串的最大長度。排序每個字符串的時間複雜度為 O(k log k)。

---

## 41. **最長回文子串 (Longest Palindromic Substring)**
   **題目描述**：給定一個字符串 `s`，找到其中最長的回文子串。

   **範例**：
   ```
   輸入："babad"
   輸出："bab"
   說明："aba" 也是一個正確答案。
   ```

   **解法思路**：
   1. 使用動態規劃來解決，定義 `dp[i][j]` 表示字符串從索引 `i` 到 `j` 是否是回文。當 `s[i] == s[j]` 時，檢查內部的子串 `s[i+1:j-1]` 是否為回文。
   2. 另一個方法是擴展中心點，對每個字符向外擴展找到可能的回文。

   **範例代碼**（Python，擴展中心點法）：
   ```python
   def longestPalindrome(s):
       def expandAroundCenter(left, right):
           while left >= 0 and right < len(s) and s[left] == s[right]:
               left -= 1
               right += 1
           return right - left - 1

       start, end = 0, 0
       for i in range(len(s)):
           len1 = expandAroundCenter(i, i)
           len2 = expandAroundCenter(i, i + 1)
           max_len = max(len1, len2)
           if max_len > end - start:
               start = i - (max_len - 1) // 2
               end = i + max_len // 2
       return s[start:end + 1]
   ```

   **時間複雜度**：O(n^2)，其中 `n` 是字符串的長度。每次擴展的時間為 O(n)，共進行了 `n` 次擴展。

---

## 42. **兩數相加 (Add Two Numbers)**
   **題目描述**：給定兩個非空鏈表來表示兩個非負整數。其中，它們的每個節點包含一位數字，數字是按逆序存儲的，求這兩個數字的和並返回一個新的鏈表表示結果。

   **範例**：
   ```
   輸入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
   輸出：7 -> 0 -> 8
   說明：342 + 465 = 807
   ```

   **解法思路**：
   1. 創建一個新的鏈表來存儲結果，從頭到尾依次遍歷兩個鏈表，對應的節點相加並處理進位。
   2. 如果某個鏈表長度較短，則補充 0 進行相加。

   **範例代碼**（Python）：
   ```python
   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

   def addTwoNumbers(l1, l2):
       dummy = ListNode()
       current = dummy
       carry = 0
       while l1 or l2 or carry:
           val1 = l1.val if l1 else 0
           val2 = l2.val if l2 else 0
           carry, out = divmod(val1 + val2 + carry, 10)
           current.next = ListNode(out)
           current = current.next
           l1 = l1.next if l1 else None
           l2 = l2.next if l2 else None
       return dummy.next
   ```

   **時間複雜度**：O(max(m, n))，其中 `m` 和 `n` 分別是兩個鏈表的長度。

---

## 43. **搜索旋轉排序數組 (Search in Rotated Sorted Array)**
   **題目描述**：給定一個按升序排序的數組，該數組在某個點被旋轉過。現在給定一個目標值，判斷該目標值是否存在於數組中，如果存在，返回其索引，否則返回 -1。

   **範例**：
   ```
   輸入：nums = [4,5,6,7,0,1,2], target = 0
   輸出：4
   ```

   **解法思路**：
   1. 使用二分搜索來解決這個問題。先判斷中間元素在哪個排序區間（左半區間或右半區間），然後根據目標值的位置進行二分搜索。
   2. 每次縮小搜索範圍，直到找到目標值或範圍為空。

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

   **時間複雜度**：O(log n)，其中 `n` 是數組的長度。

---

## 44. **子集 (Subsets)**
   **題目描述**：給定一個不包含重複數字的整數數組，返回所有可能的子集。

   **範例**：
   ```
   輸入：nums = [1,2,3]
   輸出：[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
   ```

   **解法思路**：
   1. 使用回溯法（Backtracking）生成所有可能的子集。從空集開始，每次選擇一個數字，產生一個新的子集。
   2. 也可以使用迭代方法，每當選擇一個新的數字時，將該數字加入到當前的每個子集中，生成新的子集。

   **範例代碼**（Python，迭代法）：
   ```python
   def subsets(nums):
       res = [[]]
       for num in nums:
           res += [curr + [num] for curr in res]
       return res
   ```

   **時間複雜度**：O(2^n)，其中 `n` 是數組的長度。每個數字都有包含或不包含的兩種選擇。

---

## 45. **合併區間 (Merge Intervals)**
   **題目描述**：給定一個由一些區間組成的數組，合併所有重疊的區間。

   **範例**：
   ```
   輸入：intervals = [[1,3],[2,6],[8,10],[15,18]]
   輸出：[[1,6],[8,10],[15,18]]
   ```

   **解法思路**：
   1. 首先對區間按左端點

進行排序。
   2. 然後遍歷排序後的區間，如果當前區間與前一個區間重疊，則將它們合併。

   **範例代碼**（Python）：
   ```python
   def merge(intervals):
       intervals.sort(key=lambda x: x[0])
       merged = []
       for interval in intervals:
           if not merged or merged[-1][1] < interval[0]:
               merged.append(interval)
           else:
               merged[-1][1] = max(merged[-1][1], interval[1])
       return merged
   ```

   **時間複雜度**：O(n log n)，其中 `n` 是區間數目。排序的時間複雜度為 O(n log n)，而合併的時間複雜度為 O(n)。

---

這些經典的 LeetCode 題目涵蓋了二分搜索、動態規劃、回溯、數據結構等多個算法主題。
