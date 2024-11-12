---
title: LeetCode - Search in Rotated Sorted Array（在旋轉排序陣列中搜尋）
date: 2024-08-20 22:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個已按升序排列的整數數組 `nums`，它被旋轉過一次或多次。給定一個目標值 `target`，如果目標值存在於數組中，則返回其索引；否則返回 `-1`。你可以假定數組中的所有值是唯一的。"
---

## 題目描述
給定一個已按升序排列的整數數組 `nums`，它被旋轉過一次或多次。給定一個目標值 `target`，如果目標值存在於數組中，則返回其索引；否則返回 `-1`。你可以假定數組中的所有值是唯一的。

**範例**：

```plaintext
輸入：nums = [4,5,6,7,0,1,2], target = 0
輸出：4

輸入：nums = [4,5,6,7,0,1,2], target = 3
輸出：-1

輸入：nums = [1], target = 0
輸出：-1
```

**限制**：
- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- `nums` 中的所有值互不相同
- `nums` 是一個升序排列的數組，並在某個點上進行了旋轉

## 解法思路
由於數組是有序的且被旋轉過，我們可以使用二分查找來實現 O(log n) 的時間複雜度。通過二分查找中的判斷邏輯，可以確定 `target` 是否位於旋轉過後的有序段中。

### 二分查找步驟：
1. 設置 `left` 和 `right` 指針分別指向數組的起點和終點。
2. 計算中間位置 `mid` 並比較 `nums[mid]` 與 `target`。
3. 根據旋轉排序數組的特性進行判斷：
   - **若 `nums[mid]` 等於 `target`**，則返回 `mid`。
   - **確定哪一側是有序的**：
     - 如果 `nums[left] <= nums[mid]`，則左側是有序的。
     - 如果 `nums[mid] <= nums[right]`，則右側是有序的。
   - **在有序的一側查找 `target`**：
     - 若左側有序且 `nums[left] <= target < nums[mid]`，則將 `right` 移到 `mid - 1`。
     - 若右側有序且 `nums[mid] < target <= nums[right]`，則將 `left` 移到 `mid + 1`。
     - 否則，將搜索範圍縮小到無序的一側。
4. 若遍歷完畢未找到目標值，則返回 `-1`。

## 代碼實現

以下是 Python 的實現：

```python
def search(nums, target):
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = left + (right - left) // 2

        if nums[mid] == target:
            return mid

        # 左側有序
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # 右側有序
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
```

## 代碼解析
1. **初始化指針**：`left` 和 `right` 指向數組的起點和終點。
2. **二分查找**：
   - 若 `nums[mid]` 等於 `target`，則返回 `mid`。
   - 若左側有序且 `target` 位於此區間內，則將 `right` 設為 `mid - 1`。
   - 若右側有序且 `target` 位於此區間內，則將 `left` 設為 `mid + 1`。
3. **返回結果**：若遍歷完畢未找到 `target`，則返回 `-1`。

## 時間和空間複雜度
- **時間複雜度**：O(log n)，每次迭代將範圍縮小一半。
- **空間複雜度**：O(1)，只使用了常數空間。
