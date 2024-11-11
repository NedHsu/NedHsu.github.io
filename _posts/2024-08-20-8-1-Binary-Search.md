---
title: LeetCode - Binary Search（二分查找）
date: 2024-08-20 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個按升序排序的整數數組 `nums` 和一個目標值 `target`，如果目標值存在於數組中，則返回其索引；否則返回 `-1`。請實現時間複雜度為 O(log n) 的算法。"
---

## 題目描述
給定一個按升序排序的整數數組 `nums` 和一個目標值 `target`，如果目標值存在於數組中，則返回其索引；否則返回 `-1`。請實現時間複雜度為 O(log n) 的算法。

**範例**：

```plaintext
輸入：nums = [-1,0,3,5,9,12], target = 9
輸出：4
解釋：9 出現在 nums 中並且索引為 4

輸入：nums = [-1,0,3,5,9,12], target = 2
輸出：-1
解釋：2 不存在於 nums 中，因此返回 -1
```

**限制**：
- `1 <= nums.length <= 10^4`
- `-10^4 < nums[i], target < 10^4`
- `nums` 中的所有元素互不相同
- `nums` 按升序排序

## 解法思路
二分查找適用於已經排序的數組，可以在 O(log n) 的時間內找到目標值：

1. 設定兩個指針 `left` 和 `right` 分別指向數組的開始和結束。
2. 計算中間位置 `mid`，並將 `nums[mid]` 與 `target` 比較。
   - 如果 `nums[mid]` 等於 `target`，返回 `mid`。
   - 如果 `nums[mid]` 小於 `target`，表示目標值在右半部分，將 `left` 設為 `mid + 1`。
   - 如果 `nums[mid]` 大於 `target`，表示目標值在左半部分，將 `right` 設為 `mid - 1`。
3. 重複以上步驟直到 `left` 超過 `right`，如果遍歷結束後未找到，返回 `-1`。

## 代碼實現

以下是二分查找的 Python 代碼：

```python
def binarySearch(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2  # 避免溢出

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

## 代碼解析
1. **初始化指針**：`left` 設置為 0，`right` 設置為 `len(nums) - 1`。
2. **查找中間點**：計算中間索引 `mid`，通過 `(left + right) // 2` 避免大數相加溢出。
3. **調整範圍**：
   - `nums[mid] == target`：返回 `mid`。
   - `nums[mid] < target`：將 `left` 設為 `mid + 1`。
   - `nums[mid] > target`：將 `right` 設為 `mid - 1`。
4. **返回結果**：若遍歷完畢未找到目標，返回 `-1`。

## 時間和空間複雜度
- **時間複雜度**：O(log n)，每次查找將數組範圍減半。
- **空間複雜度**：O(1)，僅使用了常數空間。
