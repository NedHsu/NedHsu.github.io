---
title: LeetCode - Minimum Window Substring（最小覆蓋子串）
date: 2024-08-14 23:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定兩個字符串 `s` 和 `t`，在字符串 `s` 中找到包含 `t` 中所有字母的最小子串，並返回該子串。如果不存在符合條件的子串，則返回空字符串。如果 `t` 中的字母在 `s` 中多次出現，則要求匹配數量也必須相同"
---

## 題目描述
給定兩個字符串 `s` 和 `t`，在字符串 `s` 中找到包含 `t` 中所有字母的最小子串，並返回該子串。如果不存在符合條件的子串，則返回空字符串 `""`。如果 `t` 中的字母在 `s` 中多次出現，則要求匹配數量也必須相同。

**範例**：

```
輸入：s = "ADOBECODEBANC", t = "ABC"
輸出："BANC"
解釋：在 "ADOBECODEBANC" 中，包含 "ABC" 所有字母的最小子串是 "BANC"。
```

## 解法思路
這是一個經典的**滑動窗口問題**。目標是找到一個最短的子串，使得它包含 `t` 中的所有字母及其頻率。滑動窗口法適合解決這類最小或最大區間問題。

1. **頻率計數**：使用字典 `t_count` 計算 `t` 中每個字母的出現次數，用另一個字典 `window_count` 記錄當前窗口中每個字母的出現次數。
  
2. **滑動窗口**：
   - 使用兩個指針 `left` 和 `right` 定義滑動窗口的邊界。
   - 初始化 `right` 指針以擴展窗口，將 `s` 中的字符添加到 `window_count`，直到窗口內部包含了 `t` 中所有字符及其頻率。
   - 當滿足條件時，開始移動 `left` 指針以收縮窗口，嘗試找到更短的符合條件的子串。每次縮小窗口時都檢查當前窗口是否仍包含 `t` 中所有字符，若是，則更新最小窗口長度。
  
3. **記錄最小子串**：若找到更小的符合條件的子串，更新最小窗口的起始位置和長度。

## 範例代碼

以下是使用滑動窗口的 Python 實現：

```python
from collections import Counter

def minWindow(s, t):
    if not t or not s:
        return ""

    # 計算 t 中每個字母的出現次數
    t_count = Counter(t)
    window_count = {}
    
    # 初始化窗口邊界和條件
    have, need = 0, len(t_count)
    res, res_len = [-1, -1], float("inf")
    left = 0

    # 擴展右邊界
    for right in range(len(s)):
        char = s[right]
        window_count[char] = window_count.get(char, 0) + 1

        # 檢查當前字符是否滿足 t 的要求
        if char in t_count and window_count[char] == t_count[char]:
            have += 1

        # 當窗口滿足條件時，開始收縮左邊界
        while have == need:
            # 更新最小窗口
            if (right - left + 1) < res_len:
                res = [left, right]
                res_len = right - left + 1
            
            # 收縮左邊界
            window_count[s[left]] -= 1
            if s[left] in t_count and window_count[s[left]] < t_count[s[left]]:
                have -= 1
            left += 1

    left, right = res
    return s[left:right + 1] if res_len != float("inf") else ""
```

## 代碼解析
1. **計算頻率**：`t_count` 用來存儲 `t` 中字符的頻率。
2. **擴展和收縮窗口**：`right` 指針擴展窗口，當窗口包含所有 `t` 的字符後，使用 `left` 指針收縮窗口。
3. **更新結果**：每次找到符合條件的子串時更新最小子串的長度和範圍。
4. **返回結果**：根據最小窗口的位置返回子串。

## 時間和空間複雜度
- **時間複雜度**：O(S + T)，其中 `S` 和 `T` 分別是 `s` 和 `t` 的長度。每個字符在滑動窗口中最多訪問兩次。
- **空間複雜度**：O(S + T)，儲存 `t` 的頻率計數和窗口的頻率計數。
