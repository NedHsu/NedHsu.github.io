---
title: LeetCode - Day 2
date: 2024-08-04 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "合併兩個有序鏈表 (Merge Two Sorted Lists)、買賣股票的最佳時機 (Best Time to Buy and Sell Stock)、羅馬數字轉整數 (Roman to Integer)、移動零 (Move Zeroes)、有效的括號 (Valid Parentheses)、跳躍遊戲 (Jump Game)"
---

## 6. **合併兩個有序鏈表 (Merge Two Sorted Lists)**
   **題目描述**：將兩個升序鏈表合併為一個新的升序鏈表，並返回合併後的新鏈表。

   **範例**：
   ```
   輸入：l1 = [1, 2, 4], l2 = [1, 3, 4]
   輸出：[1, 1, 2, 3, 4, 4]
   ```

   **解法思路**：
   1. 使用兩個指針分別指向兩個鏈表的頭節點。
   2. 每次比較兩個鏈表當前節點的值，將較小的節點加入新鏈表，並移動該鏈表的指針。
   3. 重複此操作直到其中一個鏈表遍歷完成，最後將另一個鏈表剩下的節點加到新鏈表後面。

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

   **時間複雜度**：O(n + m)，其中 n 和 m 是兩個鏈表的長度。每個節點只被訪問一次。

---

## 7. **買賣股票的最佳時機 (Best Time to Buy and Sell Stock)**
   **題目描述**：給定一個數組，其中第 i 個元素表示某只股票在第 i 天的價格。你只能選擇某一天買入這只股票，並選擇某一天賣出。計算你能夠獲得的最大利潤。

   **範例**：
   ```
   輸入：[7,1,5,3,6,4]
   輸出：5
   解釋：在第 2 天買入（價格 = 1），在第 5 天賣出（價格 = 6），利潤 = 6 - 1 = 5。
   ```

   **解法思路**：
   1. 我們可以通過一次遍歷來解決問題。記錄當前最小的買入價格，並在每一天計算如果在這天賣出能獲得的利潤，更新最大利潤。
   
   **範例代碼**（Python）：
   ```python
   def maxProfit(prices):
       min_price = float('inf')
       max_profit = 0
       for price in prices:
           if price < min_price:
               min_price = price
           elif price - min_price > max_profit:
               max_profit = price - min_price
       return max_profit
   ```

   **時間複雜度**：O(n)，其中 n 是價格數組的長度。每個價格只被遍歷一次。

---

## 8. **羅馬數字轉整數 (Roman to Integer)**
   **題目描述**：將一個羅馬數字轉換為整數。輸入是介於 1 到 3999 之間的羅馬數字。

   **範例**：
   ```
   輸入： "MCMXCIV"
   輸出：1994
   解釋：M = 1000, CM = 900, XC = 90, IV = 4。
   ```

   **解法思路**：
   1. 創建一個映射表，將羅馬數字與對應的整數對應起來。
   2. 從左到右掃描，如果當前數字比右邊的數字小，則減去它，否則加上它。

   **範例代碼**（Python）：
   ```python
   def romanToInt(s):
       roman_map = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
       result = 0
       for i in range(len(s)):
           if i < len(s) - 1 and roman_map[s[i]] < roman_map[s[i + 1]]:
               result -= roman_map[s[i]]
           else:
               result += roman_map[s[i]]
       return result
   ```

   **時間複雜度**：O(n)，n 是羅馬數字的長度。

---

## 9. **移動零 (Move Zeroes)**
   **題目描述**：給定一個數組，將數組中的所有 0 移動到數組的末尾，同時保持非零元素的相對順序。

   **範例**：
   ```
   輸入：[0,1,0,3,12]
   輸出：[1,3,12,0,0]
   ```

   **解法思路**：
   1. 使用雙指針。`i` 用來遍歷整個數組，`j` 用來記錄非零元素的最後位置。
   2. 當發現一個非零元素時，將其與 j 位置的元素交換，並將 j 往後移動。

   **範例代碼**（Python）：
   ```python
   def moveZeroes(nums):
       j = 0
       for i in range(len(nums)):
           if nums[i] != 0:
               nums[j], nums[i] = nums[i], nums[j]
               j += 1
   ```

   **時間複雜度**：O(n)，n 是數組的長度。每個元素只被訪問一次。

---

## 10. **有效的括號 (Valid Parentheses)**
   **題目描述**：給定一個只包括 `()`、`[]` 和 `{}` 的字符串，判斷字符串是否有效。有效的條件是括號必須以正確的順序閉合。

   **範例**：
   ```
   輸入： "()[]{}"
   輸出： true
   ```

   **解法思路**：
   1. 使用棧來存儲開括號，當遇到閉括號時，檢查棧頂的開括號是否匹配。
   2. 如果匹配，將其彈出；如果不匹配或棧為空，則返回 `false`。

   **範例代碼**（Python）：
   ```python
   def isValid(s):
       stack = []
       paren_map = {')': '(', ']': '[', '}': '{'}
       for char in s:
           if char in paren_map:
               top_element = stack.pop() if stack else '#'
               if paren_map[char] != top_element:
                   return False
           else:
               stack.append(char)
       return not stack
   ```

   **時間複雜度**：O(n)，n 是字符串的長度。每個字符最多被壓入和彈出棧一次。

---

## 11. **跳躍遊戲 (Jump Game)**
   **題目描述**：給定一個非負整數數組，你最初位於數組的第一個位置。數組中的每個元素代表你在該位置可以跳躍的最大步數。判斷你是否能夠到達最後一個位置。

   **範例**：
   ```
   輸入：[2,3,1,1,4]
   輸出：true
   解釋：從位置 0 跳 1 步到 1，然後從位置 1 跳 3 步到最後一個位置。
   ```

   **解法思路**：
   1. 從左到右遍歷數組，記錄當前能跳到的最遠位置。
   2. 如果最遠位置超過或等於最後一個位置，則返回 `true`。

   **範例代碼**（Python）：
   ```python
   def canJump(nums):
       max_reach = 0
       for i, num in enumerate(nums):
           if i > max_reach:
               return False
           max_reach = max(max_reach, i + num)
       return True
   ```

   **時間複雜

度**：O(n)，n 是數組的長度。

---

這些題目涵蓋了更多的典型算法與資料結構應用，適合不同難度層次的練習。
