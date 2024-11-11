---
title: LeetCode - Implement strStr()（實現字符串查找）
date: 2024-08-15 23:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定兩個字符串 `haystack` 和 `needle`，在 `haystack` 中找到 `needle` 出現的第一個位置（從 0 開始），如果 `needle` 不是 `haystack` 的一部分，則返回 `-1`。"
---

## 題目描述
實現 `strStr()` 函數。  
給定兩個字符串 `haystack` 和 `needle`，在 `haystack` 中找到 `needle` 出現的第一個位置（從 0 開始），如果 `needle` 不是 `haystack` 的一部分，則返回 `-1`。

**例子**：

```
輸入：haystack = "hello", needle = "ll"
輸出：2
```

```
輸入：haystack = "aaaaa", needle = "bba"
輸出：-1
```

**注意**：
- 當 `needle` 為空字符串時，根據題意，返回 0。

## 解法思路
這是一個典型的字符串查找問題，可以通過多種方法實現，包括**暴力匹配**、**KMP 算法**等。以下介紹較簡單的**暴力匹配**法來實現。

1. **檢查空字串**：若 `needle` 為空，直接返回 0。
2. **遍歷 `haystack`**：從 `haystack` 的起始位置開始，逐一檢查 `needle` 是否與 `haystack` 當前子串匹配。
3. **比較子串**：若 `haystack` 的子串從當前位置 `i` 開始的 `needle.length` 字符與 `needle` 相同，則返回 `i`。
4. **返回結果**：若未找到匹配的子串，返回 `-1`。

## 範例代碼

以下是 Python 的實現：

```python
def strStr(haystack, needle):
    if not needle:
        return 0
    
    needle_len = len(needle)
    haystack_len = len(haystack)
    
    # 從 haystack 中找到與 needle 長度相同的子串
    for i in range(haystack_len - needle_len + 1):
        # 檢查當前子串是否等於 needle
        if haystack[i:i + needle_len] == needle:
            return i

    return -1
```

## 代碼解析
1. **檢查空字串**：若 `needle` 是空字符串，返回 0。
2. **遍歷查找**：對於 `haystack` 的每個位置，取 `needle` 長度的子串進行比較。
3. **匹配成功返回**：若找到匹配子串，立即返回位置；若遍歷完成無匹配則返回 `-1`。

## 時間和空間複雜度
- **時間複雜度**：O(N * M)，其中 `N` 是 `haystack` 的長度，`M` 是 `needle` 的長度。
- **空間複雜度**：O(1)，不需要額外空間。
