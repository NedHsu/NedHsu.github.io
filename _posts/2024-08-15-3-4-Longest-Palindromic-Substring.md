---
title: LeetCode - Longest Palindromic Substring（最長回文子串）
date: 2024-08-15 22:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個字符串 `s`，找到 `s` 中最長的回文子串。回文串是指正讀和反讀相同的字符串。"
---

### 題目描述
給定一個字符串 `s`，找到 `s` 中最長的回文子串。回文串是指正讀和反讀相同的字符串。

**範例**：

```
輸入：s = "babad"
輸出："bab"
解釋："aba" 也是一個有效答案。
```

```
輸入：s = "cbbd"
輸出："bb"
```

**注意**：
- 如果存在多個長度相同的最長回文子串，返回其中任意一個。

### 解法思路
這是一個經典的**中心擴展法**問題。可以通過**動態規劃**或**中心擴展**來解決。

#### 方法 1：中心擴展法
1. **遍歷每個字符**：考慮每個字符為回文的中心，嘗試向左右兩側擴展，檢查最大可能的回文子串。
2. **雙指針擴展**：
   - 回文可以有奇數或偶數長度，因此需要檢查以每個字符為中心（奇數長度回文）和以每兩個相鄰字符為中心（偶數長度回文）兩種情況。
3. **記錄結果**：在每次擴展過程中記錄最長的回文子串，並返回最長的結果。

#### 方法 2：動態規劃
1. **定義子問題**：使用 `dp[i][j]` 表示子串 `s[i:j+1]` 是否為回文。
2. **遞推公式**：若 `s[i] == s[j]` 且 `dp[i+1][j-1]` 為真（即 `s[i+1:j]` 是回文），則 `dp[i][j]` 也為真。
3. **初始化**：所有長度為 1 的子串是回文。
4. **填表**：填寫動態規劃表 `dp`，更新最長回文子串的起始位置和長度。

### 範例代碼

以下是使用中心擴展法的 Python 實現：

```python
def longestPalindrome(s):
    def expandFromCenter(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return left + 1, right - 1

    start, end = 0, 0
    for i in range(len(s)):
        # 奇數長度回文
        left1, right1 = expandFromCenter(i, i)
        # 偶數長度回文
        left2, right2 = expandFromCenter(i, i + 1)
        
        # 更新最長回文子串的邊界
        if right1 - left1 > end - start:
            start, end = left1, right1
        if right2 - left2 > end - start:
            start, end = left2, right2

    return s[start:end + 1]
```

### 代碼解析
1. **中心擴展**：對每個字符執行中心擴展檢查，以找到以該字符為中心的最長回文。
2. **更新最長回文**：在每次檢查後更新目前發現的最長回文子串的邊界。
3. **返回結果**：最終從 `s` 中截取最長的回文子串。

### 時間和空間複雜度
- **時間複雜度**：O(N^2)，其中 `N` 是 `s` 的長度。中心擴展會對每個字符執行最長 N 次的擴展。
- **空間複雜度**：O(1)，只需常數空間來存儲指針和邊界。
