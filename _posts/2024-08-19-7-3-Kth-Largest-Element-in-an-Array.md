---
title: LeetCode - Kth Largest Element in an Array（數組中的第 K 大元素）
date: 2024-08-19 21:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個未排序的整數數組 `nums` 和一個整數 `k`，請返回數組中第 `k` 大的元素。**注意**：必須在 O(N) 的時間內完成，適合使用快速選擇（Quickselect）算法。"
---
**題目名稱**：

## 題目描述
給定一個未排序的整數數組 `nums` 和一個整數 `k`，請返回數組中第 `k` 大的元素。

**注意**：必須在 O(N) 的時間內完成，適合使用快速選擇（Quickselect）算法。

**範例**：

```
輸入：nums = [3,2,1,5,6,4], k = 2
輸出：5

輸入：nums = [3,2,3,1,2,4,5,5,6], k = 4
輸出：4
```

**限制**：
- `1 <= k <= nums.length <= 10^4`
- `-10^4 <= nums[i] <= 10^4`

## 解法思路
這道題要求返回第 `k` 大的元素，有幾種解法：

### 方法一：快速選擇算法（Quickselect）
1. 快速選擇是基於快速排序的變種，用於找出無序數組中的第 `k` 大或第 `k` 小元素。
2. 我們隨機選擇一個 pivot（基準點），將數組劃分成比 pivot 大和比 pivot 小的兩部分。
3. 判斷 pivot 的位置是否正好是我們需要的第 `k` 大元素的位置。如果是，返回該元素；否則遞歸處理左或右部分。

### 方法二：使用最小堆
1. 使用一個大小為 `k` 的最小堆來儲存數組的前 `k` 大元素。
2. 如果堆的大小超過 `k`，則移除堆頂最小值，這樣堆中剩下的就是前 `k` 大元素，堆頂即是第 `k` 大元素。

## 方法一範例代碼（Quickselect）

以下是基於 Quickselect 的 Python 實現：

```python
import random

def findKthLargest(nums, k):
    # 尋找第 k 大相當於尋找第 len(nums) - k 小
    k = len(nums) - k
    
    def quickselect(left, right):
        pivot_index = random.randint(left, right)
        pivot = nums[pivot_index]
        
        # 將 pivot 移到右邊
        nums[pivot_index], nums[right] = nums[right], nums[pivot_index]
        store_index = left

        # 將小於 pivot 的元素移到左邊
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_index], nums[i] = nums[i], nums[store_index]
                store_index += 1
        
        # 將 pivot 放回它的最終位置
        nums[store_index], nums[right] = nums[right], nums[store_index]

        # 判斷 pivot 的位置是否就是我們要找的第 k 小元素的位置
        if store_index == k:
            return nums[store_index]
        elif store_index < k:
            return quickselect(store_index + 1, right)
        else:
            return quickselect(left, store_index - 1)

    return quickselect(0, len(nums) - 1)
```

## 方法二範例代碼（使用最小堆）

以下是基於最小堆的 Python 實現：

```python
import heapq

def findKthLargest(nums, k):
    # 構建一個大小為 k 的最小堆
    min_heap = nums[:k]
    heapq.heapify(min_heap)

    # 遍歷剩餘元素，維護堆的大小為 k
    for num in nums[k:]:
        if num > min_heap[0]:
            heapq.heappop(min_heap)
            heapq.heappush(min_heap, num)
    
    # 堆頂即為第 k 大元素
    return min_heap[0]
```

## 代碼解析
1. **快速選擇方法**：
   - 隨機選擇 pivot，將數組劃分成小於和大於 pivot 的部分。
   - 判斷 pivot 的位置是否是我們要找的位置，若是則返回，否則遞歸查找左右兩部分。
2. **最小堆方法**：
   - 構建大小為 `k` 的最小堆。
   - 遍歷剩餘數字，維護堆的大小為 `k`，確保堆中儲存的是前 `k` 大的元素，堆頂就是第 `k` 大元素。

## 時間和空間複雜度
- **快速選擇**：
  - **時間複雜度**：O(N) 平均情況，O(N^2) 最壞情況。
  - **空間複雜度**：O(1)。
- **最小堆**：
  - **時間複雜度**：O(N log k)。
  - **空間複雜度**：O(k)，堆的大小為 `k`。
