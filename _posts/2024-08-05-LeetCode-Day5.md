---
title: LeetCode - Day 3
date: 2024-08-05 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "
合併區間 (Merge Intervals)、
子集 (Subsets)、
尋找峰值 (Find Peak Element)、
長度最小的子數組 (Minimum Size Subarray Sum)、
最長回文子串 (Longest Palindromic Substring)、
除自身以外數組的乘積 (Product of Array Except Self)
"
---

## 12. **合併區間 (Merge Intervals)**
   **題目描述**：給定若干個區間的集合，將重疊的區間合併。

   **範例**：
   ```
   輸入：[[1,3],[2,6],[8,10],[15,18]]
   輸出：[[1,6],[8,10],[15,18]]
   解釋：區間 [1,3] 和 [2,6] 重疊，合併為 [1,6]。
   ```

   **解法思路**：
   1. 首先按照區間的起點進行排序。
   2. 遍歷排序後的區間，合併那些起點和終點重疊或連接的區間。

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

   **時間複雜度**：O(n log n)，n 是區間的個數。排序需要 O(n log n)，遍歷區間需要 O(n)。

---

## 13. **子集 (Subsets)**
   **題目描述**：給定一個不含重複元素的整數數組，返回其所有可能的子集。

   **範例**：
   ```
   輸入：[1,2,3]
   輸出：[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
   ```

   **解法思路**：
   1. 使用回溯法來生成所有可能的子集。
   2. 對於每個元素，都可以選擇是否將它加入當前子集，然後遞歸地生成後續的子集。

   **範例代碼**（Python）：
   ```python
   def subsets(nums):
       result = []
       def backtrack(start, path):
           result.append(path)
           for i in range(start, len(nums)):
               backtrack(i + 1, path + [nums[i]])
       backtrack(0, [])
       return result
   ```

   **時間複雜度**：O(2^n)，n 是數組的長度，因為每個元素都有選擇是否加入子集的兩種可能。

---

## 14. **尋找峰值 (Find Peak Element)**
   **題目描述**：給定一個整數數組，找到一個峰值元素，峰值元素是指該元素大於相鄰的兩個元素。數組中可能存在多個峰值，返回其中任何一個的索引即可。

   **範例**：
   ```
   輸入：nums = [1,2,3,1]
   輸出：2
   解釋：3 是峰值元素，返回其索引 2。
   ```

   **解法思路**：
   1. 使用二分搜尋法來解決此問題。每次比較中間元素與其右邊元素的大小。
   2. 如果中間元素比右邊元素小，說明右邊存在峰值；否則，左邊存在峰值。

   **範例代碼**（Python）：
   ```python
   def findPeakElement(nums):
       left, right = 0, len(nums) - 1
       while left < right:
           mid = (left + right) // 2
           if nums[mid] < nums[mid + 1]:
               left = mid + 1
           else:
               right = mid
       return left
   ```

   **時間複雜度**：O(log n)，n 是數組的長度。這是一個經典的二分搜尋問題。

---

## 15. **長度最小的子數組 (Minimum Size Subarray Sum)**
   **題目描述**：給定一個整數數組和一個目標值 `target`，找到該數組中和大於或等於 `target` 的最小連續子數組，並返回其長度。如果不存在此類子數組，返回 0。

   **範例**：
   ```
   輸入：target = 7, nums = [2,3,1,2,4,3]
   輸出：2
   解釋：子數組 [4,3] 是最短的。
   ```

   **解法思路**：
   1. 使用滑動窗口技術來維持一個窗口，計算窗口內的和。
   2. 當窗口內的和大於或等於 `target` 時，記錄當前窗口的長度，然後縮小窗口。

   **範例代碼**（Python）：
   ```python
   def minSubArrayLen(target, nums):
       left = 0
       total = 0
       min_length = float('inf')
       for right in range(len(nums)):
           total += nums[right]
           while total >= target:
               min_length = min(min_length, right - left + 1)
               total -= nums[left]
               left += 1
       return min_length if min_length != float('inf') else 0
   ```

   **時間複雜度**：O(n)，n 是數組的長度。滑動窗口的每個元素最多被訪問兩次。

---

## 16. **最長回文子串 (Longest Palindromic Substring)**
   **題目描述**：給定一個字符串 `s`，找到 `s` 中最長的回文子串。

   **範例**：
   ```
   輸入："babad"
   輸出："bab"
   解釋："aba" 也是一個有效答案。
   ```

   **解法思路**：
   1. 中心擴展法：對每個字符，嘗試以它為中心擴展回文子串。需要考慮奇數和偶數長度的回文。
   
   **範例代碼**（Python）：
   ```python
   def longestPalindrome(s):
       def expand_around_center(left, right):
           while left >= 0 and right < len(s) and s[left] == s[right]:
               left -= 1
               right += 1
           return s[left + 1:right]
       
       result = ""
       for i in range(len(s)):
           odd_palindrome = expand_around_center(i, i)
           even_palindrome = expand_around_center(i, i + 1)
           result = max(result, odd_palindrome, even_palindrome, key=len)
       return result
   ```

   **時間複雜度**：O(n^2)，n 是字符串的長度。每次中心擴展的操作最多需要 O(n)。

---

## 17. **除自身以外數組的乘積 (Product of Array Except Self)**
   **題目描述**：給定一個數組 `nums`，返回一個數組 `output`，其中 `output[i]` 是 `nums` 中除 `nums[i]` 之外的其他元素的乘積。你不能使用除法，且時間複雜度為 O(n)。

   **範例**：
   ```
   輸入：[1,2,3,4]
   輸出：[24,12,8,6]
   ```

   **解法思路**：
   1. 首先計算每個位置左邊所有元素的乘積。
   2. 然後再從右往左計算右邊所有元素的乘積，並與左邊的結果相乘，得到最終結果。

   **範例代碼**（Python）：
   ```python
   def productExceptSelf(nums):
       length = len(nums)
       left_products = [1] * length
       right_products = [1] * length
       output = [1] * length

       for i in range(1, length):
           left_products[i] = left_products[i - 1] * nums[i - 1]

       for i in range(length - 2, -1, -1):
           right_products[i] = right_products[i + 1] * nums[i + 1]

       for i in range(length):
           output[i] = left_products[i] * right_products[i]

       return output
   ```

   **時間複雜度**：O(n)，n 是數組的長度。該算法通過兩次遍歷實現，符合要求

的時間複雜度。

---

這些題目涵蓋了更多樣的算法與資料結構，並且有助於理解更高階的問題解決技巧。
