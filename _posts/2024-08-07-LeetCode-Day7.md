---
title: LeetCode - Day 5
date: 2024-08-07 19:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "
合併 K 個排序鏈表 (Merge k Sorted Lists)、
全排列 (Permutations)、
單詞接龍 (Word Ladder)、
分割回文串 (Palindrome Partitioning)、
LRU 緩存機制 (LRU Cache)
"
---

## 23. **合併 K 個排序鏈表 (Merge k Sorted Lists)**
   **題目描述**：給定 `k` 個排序鏈表，將它們合併為一個排序的鏈表，並返回合併後的鏈表。

   **範例**：
   ```
   輸入：lists = [[1,4,5],[1,3,4],[2,6]]
   輸出：[1,1,2,3,4,4,5,6]
   ```

   **解法思路**：
   1. 使用 **優先隊列 (Priority Queue)** 來解決這個問題。
   2. 將每個鏈表的頭節點加入優先隊列，然後每次取出最小的節點，將其加入結果鏈表，並將該節點的下一個節點加入優先隊列。
   3. 使用優先隊列確保每次加入結果鏈表的節點都是最小的。

   **範例代碼**（Python）：
   ```python
   from heapq import heappush, heappop

   class ListNode:
       def __init__(self, val=0, next=None):
           self.val = val
           self.next = next

   def mergeKLists(lists):
       heap = []
       for l in lists:
           if l:
               heappush(heap, (l.val, l))

       dummy = ListNode(0)
       curr = dummy

       while heap:
           val, node = heappop(heap)
           curr.next = ListNode(val)
           curr = curr.next
           if node.next:
               heappush(heap, (node.next.val, node.next))

       return dummy.next
   ```

   **時間複雜度**：O(N log k)，其中 `N` 是所有節點的總數，`k` 是鏈表的數量。每次操作都涉及優先隊列的插入和取出操作，時間複雜度為 O(log k)。

---

## 24. **全排列 (Permutations)**
   **題目描述**：給定一個不含重複數字的整數數組 `nums`，返回其所有可能的全排列。

   **範例**：
   ```
   輸入：nums = [1,2,3]
   輸出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
   ```

   **解法思路**：
   1. 使用回溯法來生成全排列。對於每個位置，嘗試將剩餘的數字放入該位置，並遞歸處理剩餘的數字。
   2. 將每次生成的排列添加到結果列表中。

   **範例代碼**（Python）：
   ```python
   def permute(nums):
       def backtrack(first=0):
           if first == n:
               result.append(nums[:])
           for i in range(first, n):
               nums[first], nums[i] = nums[i], nums[first]
               backtrack(first + 1)
               nums[first], nums[i] = nums[i], nums[first]

       n = len(nums)
       result = []
       backtrack()
       return result
   ```

   **時間複雜度**：O(n * n!)，其中 `n` 是 `nums` 的長度。總共有 `n!` 種排列方式，每種排列需要 O(n) 的時間來處理。

---

## 25. **單詞接龍 (Word Ladder)**
   **題目描述**：給定兩個單詞 `beginWord` 和 `endWord` 以及一個字典 `wordList`，找出從 `beginWord` 變換到 `endWord` 的最短轉換序列長度。每次變換只能改變一個字母，並且轉換後的單詞必須在字典中。

   **範例**：
   ```
   輸入：beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]
   輸出：5
   ```

   **解法思路**：
   1. 使用廣度優先搜索 (BFS)，從起點開始，依次將每個單詞轉換為相鄰的單詞，並檢查是否到達終點。
   2. 對於每個單詞，嘗試將其每一個字母轉換為其他字母，並檢查轉換後的單詞是否存在於字典中。

   **範例代碼**（Python）：
   ```python
   from collections import deque

   def ladderLength(beginWord, endWord, wordList):
       wordSet = set(wordList)
       if endWord not in wordSet:
           return 0

       queue = deque([(beginWord, 1)])
       while queue:
           word, length = queue.popleft()
           if word == endWord:
               return length

           for i in range(len(word)):
               for char in 'abcdefghijklmnopqrstuvwxyz':
                   newWord = word[:i] + char + word[i+1:]
                   if newWord in wordSet:
                       wordSet.remove(newWord)
                       queue.append((newWord, length + 1))

       return 0
   ```

   **時間複雜度**：O(M * N)，其中 `M` 是單詞的長度，`N` 是字典中單詞的數量。對於每個單詞，我們會檢查其每一個字母的可能變化。

---

## 26. **分割回文串 (Palindrome Partitioning)**
   **題目描述**：給定一個字符串 `s`，將其分割成若干子串，使得每個子串都是回文串，並返回所有可能的分割方案。

   **範例**：
   ```
   輸入：s = "aab"
   輸出：[["a","a","b"],["aa","b"]]
   ```

   **解法思路**：
   1. 使用回溯法，對每個位置，嘗試將其分割為回文串，並遞歸處理剩下的部分。
   2. 每當找到一個有效的分割方案時，將其加入結果列表。

   **範例代碼**（Python）：
   ```python
   def partition(s):
       def isPalindrome(sub):
           return sub == sub[::-1]

       def backtrack(start):
           if start == len(s):
               result.append(path[:])
               return

           for end in range(start + 1, len(s) + 1):
               if isPalindrome(s[start:end]):
                   path.append(s[start:end])
                   backtrack(end)
                   path.pop()

       result = []
       path = []
       backtrack(0)
       return result
   ```

   **時間複雜度**：O(n * 2^n)，其中 `n` 是字符串的長度。每個字符都有分割與不分割兩種選擇，且每次分割需要 O(n) 的時間來檢查是否是回文。

---

## 27. **LRU 緩存機制 (LRU Cache)**
   **題目描述**：設計並實現一個 **最近最少使用 (Least Recently Used, LRU)** 緩存。它應支持以下操作：`get` 和 `put`。

   **範例**：
   ```
   LRUCache cache = new LRUCache(2);
   cache.put(1, 1);
   cache.put(2, 2);
   cache.get(1);       // 返回 1
   cache.put(3, 3);    // 驅逐 key 2
   cache.get(2);       // 返回 -1 (未找到)
   cache.put(4, 4);    // 驅逐 key 1
   cache.get(1);       // 返回 -1 (未找到)
   ```

   **解法思路**：
   1. 使用 **有序字典 (OrderedDict)** 來實現 LRU 緩存。
   2. 每次訪問或插入時，將該鍵值對移到字典的尾部，表示最近使用。
   3. 當超過容量限制時，刪除字典頭部的鍵值對，表示最久未使用的項目被驅逐。

   **範例代碼**（Python）：
   ```python
   from collections import OrderedDict

   class LRUCache:
       def __init__(self, capacity: int):
           self.cache = OrderedDict()
           self.capacity = capacity

       def get(self, key: int) -> int:
           if key not in self.cache:
               return -1
           self.cache.move_to_end(key)


           return self.cache[key]

       def put(self, key: int, value: int) -> None:
           if key in self.cache:
               self.cache.move_to_end(key)
           self.cache[key] = value
           if len(self.cache) > self.capacity:
               self.cache.popitem(last=False)
   ```

   **時間複雜度**：O(1) 對於 `get` 和 `put` 操作，因為使用了 `OrderedDict` 提供的高效查找、插入和移動操作。

---

這些題目從數據結構、算法設計到實際應用，覆蓋了 LeetCode 的經典題型。
