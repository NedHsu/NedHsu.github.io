---
title: LeetCode - Day 6
date: 2024-08-08 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "字母異位詞分組 (Group Anagrams)、乘積除自身數組 (Product of Array Except Self)、三數之和 (3Sum)、找不同 (Find the Difference)、反轉二叉樹 (Invert Binary Tree)、求根到葉子節點數字之和 (Sum Root to Leaf Numbers)"
---

## 28. **字母異位詞分組 (Group Anagrams)**
   **題目描述**：給定一組字符串，將異位詞（由相同字母組成，但順序不同的單詞）分組。

   **範例**：
   ```
   輸入：strs = ["eat","tea","tan","ate","nat","bat"]
   輸出：[["eat","tea","ate"],["tan","nat"],["bat"]]
   ```

   **解法思路**：
   1. 使用字典來分組。對於每個字符串，將其排序後作為字典的鍵，對應的值是該鍵的異位詞列表。
   2. 排序後的字符串能唯一標識異位詞，因此能有效分組。

   **範例代碼**（Python）：
   ```python
   def groupAnagrams(strs):
       anagrams = {}
       for s in strs:
           key = ''.join(sorted(s))
           if key not in anagrams:
               anagrams[key] = []
           anagrams[key].append(s)
       return list(anagrams.values())
   ```

   **時間複雜度**：O(n * k log k)，其中 `n` 是字符串的數量，`k` 是字符串的平均長度。對於每個字符串，排序操作需要 O(k log k) 的時間。

---

## 29. **乘積除自身數組 (Product of Array Except Self)**
   **題目描述**：給定一個整數數組 `nums`，返回一個數組 `output`，其中 `output[i]` 是 `nums` 中除 `nums[i]` 之外的所有元素的乘積。

   **範例**：
   ```
   輸入：nums = [1,2,3,4]
   輸出：[24,12,8,6]
   ```

   **解法思路**：
   1. 先構造一個數組 `left_products`，其中 `left_products[i]` 是 `nums[i]` 左邊所有元素的乘積。
   2. 再構造一個數組 `right_products`，其中 `right_products[i]` 是 `nums[i]` 右邊所有元素的乘積。
   3. 最後，將 `left_products` 和 `right_products` 相乘得到最終結果。

   **範例代碼**（Python）：
   ```python
   def productExceptSelf(nums):
       n = len(nums)
       result = [1] * n

       left_product = 1
       for i in range(n):
           result[i] = left_product
           left_product *= nums[i]

       right_product = 1
       for i in range(n-1, -1, -1):
           result[i] *= right_product
           right_product *= nums[i]

       return result
   ```

   **時間複雜度**：O(n)，其中 `n` 是數組的長度。空間複雜度也是 O(n)，但如果不計算輸出數組，則可以視為 O(1)。

---

## 30. **三數之和 (3Sum)**
   **題目描述**：給定一個包含 `n` 個整數的數組 `nums`，判斷是否存在三個元素 `a, b, c`，使得它們的和為 0。找出所有符合條件且不重複的三元組。

   **範例**：
   ```
   輸入：nums = [-1,0,1,2,-1,-4]
   輸出：[[-1,-1,2],[-1,0,1]]
   ```

   **解法思路**：
   1. 先對數組進行排序。
   2. 使用雙指針技術來找出和為 0 的三元組。對於每個 `nums[i]`，使用雙指針來查找 `nums[i] + nums[left] + nums[right] = 0` 的組合。
   3. 注意去重，避免返回相同的三元組。

   **範例代碼**（Python）：
   ```python
   def threeSum(nums):
       nums.sort()
       result = []
       for i in range(len(nums) - 2):
           if i > 0 and nums[i] == nums[i-1]:
               continue
           left, right = i + 1, len(nums) - 1
           while left < right:
               total = nums[i] + nums[left] + nums[right]
               if total < 0:
                   left += 1
               elif total > 0:
                   right -= 1
               else:
                   result.append([nums[i], nums[left], nums[right]])
                   while left < right and nums[left] == nums[left + 1]:
                       left += 1
                   while left < right and nums[right] == nums[right - 1]:
                       right -= 1
                   left += 1
                   right -= 1
       return result
   ```

   **時間複雜度**：O(n^2)，其中 `n` 是數組的長度。排序的時間複雜度為 O(n log n)，每次雙指針查找的時間複雜度為 O(n)。

---

## 31. **找不同 (Find the Difference)**
   **題目描述**：給定兩個字符串 `s` 和 `t`，字符串 `t` 是由字符串 `s` 打亂並添加一個額外字符生成的。請找出這個額外的字符。

   **範例**：
   ```
   輸入：s = "abcd", t = "abcde"
   輸出："e"
   ```

   **解法思路**：
   1. 使用異或運算來解決這個問題。對於 `s` 和 `t` 中的所有字符進行異或運算，結果就是那個多餘的字符。
   2. 異或運算具有交換律和自反性，這意味著兩個相同的字符異或後會抵消，剩下的就是那個多餘的字符。

   **範例代碼**（Python）：
   ```python
   def findTheDifference(s, t):
       result = 0
       for c in s + t:
           result ^= ord(c)
       return chr(result)
   ```

   **時間複雜度**：O(n)，其中 `n` 是字符串的長度。空間複雜度為 O(1)。

---

## 32. **反轉二叉樹 (Invert Binary Tree)**
   **題目描述**：反轉一棵二叉樹，即將每個節點的左右子樹交換。

   **範例**：
   ```
   輸入：
        4
      /   \
     2     7
    / \   / \
   1   3 6   9

   輸出：
        4
      /   \
     7     2
    / \   / \
   9   6 3   1
   ```

   **解法思路**：
   1. 使用遞歸法，對每個節點進行左右子樹的交換。
   2. 遍歷樹時，對每個節點的左右子節點進行遞歸交換。

   **範例代碼**（Python）：
   ```python
   class TreeNode:
       def __init__(self, val=0, left=None, right=None):
           self.val = val
           self.left = left
           self.right = right

   def invertTree(root):
       if not root:
           return None
       root.left, root.right = invertTree(root.right), invertTree(root.left)
       return root
   ```

   **時間複雜度**：O(n)，其中 `n` 是二叉樹中節點的數量。每個節點都需要被訪問一次。

---

## 33. **求根到葉子節點數字之和 (Sum Root to Leaf Numbers)**
   **題目描述**：給定一個二叉樹，其中每個節點包含一個數字。從根到葉子的路徑可以表示一個數字，求這些數字的總和。

   **範例**：
   ```
   輸入：
        1
       / \
      2   3
   輸出：25
   ```

   **解法思路**：
   1. 使用深度優先搜索（DFS），從根節點開始，將每條從根到葉子的路徑上的數字組合起來。
   2. 遞歸遍歷每條路徑，並將每個節點的數字按照位數累加。

  

 **範例代碼**（Python）：
   ```python
   class TreeNode:
       def __init__(self, val=0, left=None, right=None):
           self.val = val
           self.left = left
           self.right = right

   def sumNumbers(root):
       def dfs(node, current_sum):
           if not node:
               return 0
           current_sum = current_sum * 10 + node.val
           if not node.left and not node.right:
               return current_sum
           return dfs(node.left, current_sum) + dfs(node.right, current_sum)

       return dfs(root, 0)
   ```

   **時間複雜度**：O(n)，其中 `n` 是二叉樹中節點的數量。每個節點都會被遍歷一次。

---

這些題目涵蓋了不同類型的數據結構與算法問題，繼續擴展了你的 LeetCode 練習範疇。
