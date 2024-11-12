---
title: LeetCode - Valid Palindrome（有效回文）
date: 2024-08-13 22:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個整數數組 `nums` 和一個目標值 `target`，請在該數組中找出和為目標值的那兩個整數，並返回它們的索引"
---

## 題目描述
給定一個字符串 `s`，判斷它是否為回文串。在判斷時，需要忽略非字母和數字的字符，並且忽略大小寫。 

**回文**是指一個字符串正序和反序相同。例如 `"A man, a plan, a canal: Panama"` 是回文，而 `"race a car"` 不是回文。

**範例**：

```
輸入：s = "A man, a plan, a canal: Panama"
輸出：True

輸入：s = "race a car"
輸出：False
```

## 解法思路
本題的目標是檢查字符串是否為回文，並忽略非字母數字字符及大小寫。這可以通過以下步驟來完成：

1. **過濾有效字符**：遍歷字符串，只保留字母和數字。
2. **忽略大小寫**：將所有字母轉為小寫。
3. **判斷回文**：將過濾後的字符串與其反轉字符串進行比較。如果相等，則該字符串為回文。

另一種有效的方法是使用 **雙指針**：分別從字符串的頭和尾同時向中間移動，每次比較兩個指針指向的字符是否相同。

## 雙指針法的步驟
1. 設置左右兩個指針 `left` 和 `right`，分別指向字符串的起點和終點。
2. 當 `left` 小於 `right` 時進行循環：
   - 如果 `left` 指針指向的字符不是字母或數字，則右移 `left`。
   - 如果 `right` 指針指向的字符不是字母或數字，則左移 `right`。
   - 否則比較 `left` 和 `right` 指針指向的字符是否相等（忽略大小寫）。如果不相等，返回 `False`。
   - 若相等，將 `left` 和 `right` 分別向中間移動。
3. 若遍歷完成而無不相等情況，返回 `True`。

## 範例代碼

以下是 Python 的實現：

```python
def isPalindrome(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        # 忽略左指針的非字母數字字符
        while left < right and not s[left].isalnum():
            left += 1
        # 忽略右指針的非字母數字字符
        while left < right and not s[right].isalnum():
            right -= 1
        
        # 比較字符（忽略大小寫）
        if s[left].lower() != s[right].lower():
            return False
        
        # 移動指針
        left += 1
        right -= 1
    
    return True
```

## 代碼解析
1. 使用雙指針 `left` 和 `right`，分別從字符串的兩端向中間移動。
2. 當 `left` 和 `right` 指針所指字符都是字母或數字時，進行比較：
   - 若兩者不相等，返回 `False`。
   - 若相等，繼續移動 `left` 和 `right`。
3. 若遍歷完成而沒有返回 `False`，則說明該字符串為回文，返回 `True`。

## 時間和空間複雜度
- **時間複雜度**：O(n)，其中 `n` 是字符串的長度。每個字符最多被檢查一次。
- **空間複雜度**：O(1)，使用了常數級別的額外空間。
