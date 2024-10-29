---
title: LeetCode - Decode String（解碼字符串）
date: 2024-08-15 20:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個編碼字符串 `s`，按下述規則解碼它: 1. 數字後面緊跟著的方括號表示字符串的重複次數 2. 嵌套情況下也需要處理"
---

## 題目描述
給定一個編碼字符串 `s`，按下述規則解碼它：

- 數字後面緊跟著的方括號表示字符串的重複次數。例如，字符串 `"3[a]"` 表示 `"aaa"`；而 `"2[bc]"` 表示 `"bcbc"`。
- 嵌套情況下也需要處理，例如 `"3[a2[c]]"` 解碼為 `"accaccacc"`。

請返回解碼後的字符串。

**範例**：

```
輸入：s = "3[a]2[bc]"
輸出："aaabcbc"

輸入：s = "3[a2[c]]"
輸出："accaccacc"

輸入：s = "2[abc]3[cd]ef"
輸出："abcabccdcdcdef"
```

## 解法思路
這個問題可以通過 **棧** 來解決，以處理字符串的嵌套結構。

### 步驟
1. **初始化變量**：
   - 使用兩個棧 `num_stack` 和 `str_stack`。`num_stack` 用來存儲重複次數，`str_stack` 用來存儲字母串。
   - 使用一個變量 `current_num` 來追蹤當前重複次數，`current_str` 來構建當前字母串。

2. **遍歷字符串**：
   - 遇到數字時，將 `current_num` 更新為當前的數字（處理多位數字時，累加形成完整的數字）。
   - 遇到 `[` 時，將 `current_num` 和 `current_str` 分別推入 `num_stack` 和 `str_stack`，並重置 `current_num` 和 `current_str`。
   - 遇到 `]` 時，從 `num_stack` 中取出上一次的重複次數，從 `str_stack` 中取出上一次的字母串，並將當前構建的字母串按重複次數拼接，然後附加到上次字母串中形成完整結果。
   - 遇到字母時，將其添加到 `current_str` 中。

3. **完成解碼**：最終 `current_str` 中存儲的就是解碼後的字符串。

## 範例代碼

以下是 Python 的實現：

```python
def decodeString(s):
    num_stack = []      # 用於存儲重複次數
    str_stack = []      # 用於存儲字母串
    current_num = 0
    current_str = ""
    
    for char in s:
        if char.isdigit():  # 當前字符是數字
            current_num = current_num * 10 + int(char)  # 考慮多位數
        elif char == '[':    # 當前字符是 '['
            num_stack.append(current_num)   # 將重複次數推入棧中
            str_stack.append(current_str)   # 將當前字母串推入棧中
            current_num = 0
            current_str = ""
        elif char == ']':    # 當前字符是 ']'
            repeat_num = num_stack.pop()    # 從棧中取出重複次數
            prev_str = str_stack.pop()      # 從棧中取出之前的字母串
            current_str = prev_str + current_str * repeat_num  # 拼接解碼後的字母串
        else:                 # 當前字符是字母
            current_str += char
    
    return current_str
```

## 代碼解析
1. **初始化棧**：`num_stack` 用來存重複次數，`str_stack` 用來存前一層字母串。
2. **遍歷字符串**：
   - 數字更新 `current_num`。
   - 遇到 `[` 時，將當前數字和字母串存入棧中，並重置。
   - 遇到 `]` 時，從棧中取出重複次數與前一層字母串，完成拼接。
   - 遇到字母時，更新 `current_str`。
3. **返回結果**：最終 `current_str` 即為解碼後的完整字符串。

## 時間和空間複雜度
- **時間複雜度**：O(n)，其中 `n` 是字符串的長度，每個字符遍歷一次。
- **空間複雜度**：O(n)，因為使用棧存儲中間結果。
