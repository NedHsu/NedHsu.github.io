---
title: LeetCode - Longest Substring Without Repeating Characters（無重複字符的最長子串）
date: 2024-08-14 22:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個整數數組 `nums` 和一個目標值 `target`，請在該數組中找出和為目標值的那兩個整數，並返回它們的索引"
---

## 題目描述
給定一個字符串 `s`，請找出其中不含重複字符的 **最長子串**，並返回該子串的長度。

**範例**：

```
輸入：s = "abcabcbb"
輸出：3
解釋：最長子串是 "abc"，其長度為 3。

輸入：s = "bbbbb"
輸出：1
解釋：最長子串是 "b"，其長度為 1。

輸入：s = "pwwkew"
輸出：3
解釋：最長子串是 "wke"，其長度為 3。請注意，答案必須是子串，"pwke" 是子序列而不是子串。
```

## 解法思路
這個題目要求找出不包含重複字符的最長子串。為了解決這個問題，可以使用 **滑動窗口** 的方法。滑動窗口是一個動態區間，用於維護當前的子串並逐步延伸或縮小窗口，以找到最長的無重複子串。

### 具體步驟
1. **初始化指針與數據結構**：
   - 使用兩個指針 `left` 和 `right` 表示滑動窗口的左右邊界。
   - 使用一個哈希集合 `seen` 存儲當前窗口內的字符，從而檢查是否有重複字符。
   - 設置一個變量 `max_length` 來存儲目前找到的最長子串的長度。

2. **擴展右邊界**：
   - 循環遍歷字符串的每個字符，並逐步將 `right` 指針右移。
   - 若當前字符不在集合 `seen` 中，則將其加入集合中，並更新 `max_length` 為當前窗口大小（`right - left + 1`）。

3. **處理重複字符**：
   - 如果當前字符已在 `seen` 中，說明遇到重複字符，此時需要縮小窗口（移動 `left`）：
     - 逐步將 `left` 向右移，並從 `seen` 中刪除左邊界的字符，直到去除重複字符。

4. **更新結果**：
   - 在遍歷過程中，不斷更新 `max_length`，最終得到不含重複字符的最長子串長度。

## 範例代碼

以下是 Python 的實現：

```python
def lengthOfLongestSubstring(s):
    seen = set()  # 用於存儲當前窗口內的字符
    left = 0  # 左指針
    max_length = 0
    
    for right in range(len(s)):
        # 當遇到重複字符時，移動左指針
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        # 將當前字符添加到集合並更新最大長度
        seen.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

## 代碼解析
1. **初始化變量**：
   - `seen` 用於存儲當前窗口中的字符。
   - `left` 和 `right` 為滑動窗口的左右邊界。
   - `max_length` 儲存目前為止找到的最大子串長度。
2. **遍歷字符串**：
   - 當右邊界字符已在 `seen` 中，則通過增加 `left` 來縮小窗口。
   - 若沒有重複，將 `right` 指針指向的字符添加到 `seen` 中，並更新 `max_length`。
3. **返回結果**：
   - 最後返回 `max_length` 作為結果。

## 時間和空間複雜度
- **時間複雜度**：O(n)，其中 `n` 是字符串的長度。`left` 和 `right` 指針最多各遍歷字符串一次。
- **空間複雜度**：O(min(m, n))，其中 `m` 是字符集的大小，`n` 是字符串長度，用於存儲集合中不重複的字符。
