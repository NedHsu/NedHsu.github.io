---
title: LeetCode - Find Minimum in Rotated Sorted Array（尋找旋轉排序陣列中的最小值）
date: 2024-08-20 21:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個已經按照升序排序但旋轉過的整數數組 `nums`，請找出其中的最小值。假設該數組中的元素不重複。"
---

## 題目描述
給定一個已經按照升序排序但旋轉過的整數數組 `nums`，請找出其中的最小值。假設該數組中的元素不重複。

**範例**：

```plaintext
輸入：nums = [3,4,5,1,2]
輸出：1

輸入：nums = [4,5,6,7,0,1,2]
輸出：0

輸入：nums = [11,13,15,17]
輸出：11
```

**限制**：
- `1 <= nums.length <= 5000`
- `-5000 <= nums[i] <= 5000`
- 數組中的所有元素互不相同
- `nums` 是一個升序排列的數組，並在某個點進行了旋轉

## 解法思路
由於數組在某個未知點上進行了旋轉，因此在數組中存在一個分界點，使得分界點的左側所有元素都大於右側所有元素，且數組兩部分仍然有序。可以通過二分查找來實現 O(log n) 的時間複雜度來查找最小值。

### 二分查找步驟：
1. 設置兩個指針 `left` 和 `right` 分別指向數組的起點和終點。
2. 比較數組中間位置 `mid` 的值和 `right` 的值，以縮小查找範圍：
   - 如果 `nums[mid] > nums[right]`，則最小值一定在 `mid` 的右側。更新 `left = mid + 1`。
   - 如果 `nums[mid] < nums[right]`，則最小值一定在 `mid` 及其左側。更新 `right = mid`。
3. 重複以上步驟，直到 `left == right`，此時 `nums[left]` 即為最小值。

## 代碼實現

以下是 Python 的實現：

```python
def findMin(nums):
    left, right = 0, len(nums) - 1

    while left < right:
        mid = left + (right - left) // 2

        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid

    return nums[left]
```

## 代碼解析
1. **初始化指針**：`left` 和 `right` 分別指向數組的起點和終點。
2. **二分查找**：通過比較 `nums[mid]` 和 `nums[right]` 的值，不斷縮小查找範圍：
   - 若 `nums[mid] > nums[right]`，說明最小值在右側，因此將 `left` 移動到 `mid + 1`。
   - 若 `nums[mid] <= nums[right]`，說明最小值在左側或就是 `mid`，將 `right` 移動到 `mid`。
3. **返回結果**：當 `left == right` 時，`nums[left]` 就是最小值。

## 時間和空間複雜度
- **時間複雜度**：O(log n)，每次迭代將範圍縮小一半。
- **空間複雜度**：O(1)，只使用了常數空間。
