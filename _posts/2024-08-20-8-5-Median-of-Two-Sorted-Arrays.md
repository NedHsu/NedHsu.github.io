---
title: LeetCode - Median of Two Sorted Arrays（兩個排序數組的中位數）
date: 2024-08-20 23:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定兩個大小分別為 `m` 和 `n` 的排序數組 `nums1` 和 `nums2`，請找出這兩個排序數組的中位數，並要求算法的時間複雜度為 O(log(min(m, n)))。"
---

## 題目描述
給定兩個大小分別為 `m` 和 `n` 的排序數組 `nums1` 和 `nums2`，請找出這兩個排序數組的中位數，並要求算法的時間複雜度為 O(log(min(m, n)))。

**範例**：

```plaintext
輸入：nums1 = [1, 3], nums2 = [2]
輸出：2.0

輸入：nums1 = [1, 2], nums2 = [3, 4]
輸出：2.5
```

**限制**：
- `nums1` 和 `nums2` 的長度範圍均在 `[0, 1000]`。
- `-10^6 <= nums1[i], nums2[i] <= 10^6`。
- 保證 `nums1` 和 `nums2` 不同的整數數組，並且至少有一個數組非空。

## 解法思路
這道題要求時間複雜度為 O(log(min(m, n)))，因此使用「二分查找」來實現。由於中位數的位置與數組長度相關，我們需要找到合併後數組的「第 k 個元素」。

### 二分法步驟：
1. **確定短數組**：為了優化二分查找，我們令 `nums1` 為較短的數組（若 `nums1` 比 `nums2` 長，則交換）。
2. **計算分割點**：
   - 我們在 `nums1` 上進行二分查找。設置兩個指針 `left` 和 `right` 表示分割範圍，找到 `i` 使得 `i` 和 `j` (其中 `j = (m + n + 1) // 2 - i`) 將數組劃分成兩部分，滿足左右部分的平衡。
3. **檢查條件**：
   - 若 `nums1[i-1] <= nums2[j]` 且 `nums2[j-1] <= nums1[i]`，則滿足條件，找到了合適的分割點。
4. **計算中位數**：
   - 若合併後數組長度為奇數，則中位數為左半部分的最大值。
   - 若長度為偶數，則中位數為左半部分最大值與右半部分最小值的平均值。

## 代碼實現

以下是 Python 的實現：

```python
def findMedianSortedArrays(nums1, nums2):
    # 保證 nums1 是較短的數組
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1

    m, n = len(nums1), len(nums2)
    left, right = 0, m
    half_len = (m + n + 1) // 2

    while left <= right:
        i = (left + right) // 2
        j = half_len - i

        if i < m and nums1[i] < nums2[j - 1]:
            left = i + 1
        elif i > 0 and nums1[i - 1] > nums2[j]:
            right = i - 1
        else:
            # 符合條件的分割點
            if i == 0: max_of_left = nums2[j - 1]
            elif j == 0: max_of_left = nums1[i - 1]
            else: max_of_left = max(nums1[i - 1], nums2[j - 1])

            if (m + n) % 2 == 1:
                return max_of_left

            if i == m: min_of_right = nums2[j]
            elif j == n: min_of_right = nums1[i]
            else: min_of_right = min(nums1[i], nums2[j])

            return (max_of_left + min_of_right) / 2.0
```

## 代碼解析
1. **確保短數組在前**：若 `nums1` 長於 `nums2`，則交換，確保在較短的數組上進行二分查找。
2. **二分查找分割點**：根據 `i` 和 `j` 的值，調整 `left` 和 `right` 的位置。
3. **計算中位數**：當找到滿足條件的 `i` 和 `j` 時，根據數組的總長度是否為奇數或偶數來計算中位數。

## 時間和空間複雜度
- **時間複雜度**：O(log(min(m, n)))，我們在較短的數組上進行二分查找。
- **空間複雜度**：O(1)，只使用了常數空間。
