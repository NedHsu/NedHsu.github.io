---
title: LeetCode - 字母異位詞分組 (Group Anagrams)
date: 2024-08-13 23:30:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個字符串數組，將異位詞分組。異位詞是指包含相同字母但順序不同的字符串"
---

## **題目描述**：
給定一個字符串數組，將異位詞分組。異位詞是指包含相同字母但順序不同的字符串。

## **範例**：
   ```
   輸入：["eat", "tea", "tan", "ate", "nat", "bat"]
   輸出：[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
   ```

## **解法思路**：
   1. 我們可以通過對每個字符串進行排序，將異位詞變成相同的排序結果，然後將這些相同的結果分組。
   2. 使用一個哈希表來儲存排序後的結果作為鍵，異位詞組作為值。

## **範例代碼**（Python）：
   ```python
   from collections import defaultdict

   def groupAnagrams(strs):
       anagrams = defaultdict(list)
       for s in strs:
           key = ''.join(sorted(s))
           anagrams[key].append(s)
       return list(anagrams.values())
   ```

## **時間複雜度**：
O(n * k log k)，其中 `n` 是字符串數組的長度，`k` 是字符串的最大長度。排序每個字符串的時間複雜度為 O(k log k)。
