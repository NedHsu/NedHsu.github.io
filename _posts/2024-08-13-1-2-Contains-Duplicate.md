---
title: LeetCode - Contains Duplicate（判斷數組是否包含重複項）
date: 2024-08-13 20:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個整數數組 `nums`，判斷數組中是否存在重複元素。如果存在某個值在數組中出現至少兩次，返回 `True`；如果每個元素都不相同，則返回 `False`"
---

## 題目描述
給定一個整數數組 `nums`，判斷數組中是否存在重複元素。如果存在某個值在數組中出現至少兩次，返回 `True`；如果每個元素都不相同，則返回 `False`。

## **範例**：

```
輸入：nums = [1,2,3,1]
輸出：True

輸入：nums = [1,2,3,4]
輸出：False

輸入：nums = [1,1,1,3,3,4,3,2,4,2]
輸出：True
```

## 解法思路
這個題目要求檢查數組中是否存在重複項，因此可以利用以下方法：

1. **使用集合（Set）**：
   - 使用集合的特性，集合中的元素是唯一的，因此我們可以逐個將 `nums` 中的元素添加到集合中。
   - 如果遇到某個元素已經在集合中出現過，則說明存在重複元素，直接返回 `True`。
   - 如果遍歷完所有元素都沒有重複項，返回 `False`。

2. **時間複雜度分析**：
   - 該解法的時間複雜度為 O(n)，其中 `n` 是數組的長度。因為每個元素在最壞情況下會被添加到集合中一次。
   - 空間複雜度為 O(n)，因為集合需要存儲所有不重複的元素。

## 範例代碼

以下是 Python 的實現：

```python
def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False
```

## 代碼解析
1. 創建一個空集合 `seen`，用於存儲已經出現過的數字。
2. 遍歷數組 `nums` 中的每個元素 `num`：
   - 如果 `num` 已經在集合 `seen` 中，直接返回 `True`（存在重複元素）。
   - 否則，將 `num` 添加到集合 `seen` 中。
3. 若遍歷完所有元素都沒有發現重複項，返回 `False`。

## 進一步優化
在 Python 中，也可以直接使用 `set` 判斷去重後的數組長度是否變化，如下：

```python
def containsDuplicate(nums):
    return len(nums) != len(set(nums))
```

這種方式更簡潔，效率相似，不過會一次性創建整個集合，空間複雜度為 O(n)。
