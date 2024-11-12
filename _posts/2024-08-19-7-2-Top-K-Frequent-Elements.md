---
title: LeetCode - Top K Frequent Elements（前 K 個出現頻率最高的元素）
date: 2024-08-19 20:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個整數數組 `nums` 和一個整數 `k`，返回出現頻率最高的 `k` 個元素。返回的答案可以按任意順序排列。"
---

## 題目描述
給定一個整數數組 `nums` 和一個整數 `k`，返回出現頻率最高的 `k` 個元素。返回的答案可以按任意順序排列。

**範例**：

```
輸入：nums = [1,1,1,2,2,3], k = 2
輸出：[1,2]

輸入：nums = [1], k = 1
輸出：[1]
```

**限制**：
- `1 <= nums.length <= 10^5`
- `k` 的範圍是 `[1, the number of unique elements in the array]`
- 題目保證答案唯一

## 解法思路
這是一道查找數組中出現頻率最高的 `k` 個元素的問題，可以使用以下方法解決：

### 方法一：使用哈希表和最小堆
1. 先使用哈希表統計每個元素的出現頻率。
2. 使用最小堆來儲存頻率最高的 `k` 個元素：
   - 當堆的大小超過 `k` 時，移除頻率最低的元素。
   - 最終堆中剩下的 `k` 個元素即為出現頻率最高的 `k` 個元素。

### 方法二：桶排序（Bucket Sort）
1. 使用哈希表統計每個元素的出現頻率。
2. 建立一個桶陣列，其中索引代表頻率，每個桶儲存具有相同頻率的數字。
3. 從頻率最高的桶開始向下遍歷，直到收集到 `k` 個元素為止。

## 方法一範例代碼（使用最小堆）

以下是 Python 使用最小堆的解法：

```python
import heapq
from collections import Counter

def topKFrequent(nums, k):
    # 統計每個元素的頻率
    count = Counter(nums)
    
    # 使用最小堆找出前 k 個頻率最高的元素
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        # 如果堆的大小超過 k，則彈出頻率最低的元素
        if len(heap) > k:
            heapq.heappop(heap)
    
    # 堆中剩下的元素即為所求的結果
    return [num for freq, num in heap]
```

## 方法二範例代碼（使用桶排序）

以下是 Python 使用桶排序的解法：

```python
from collections import Counter, defaultdict

def topKFrequent(nums, k):
    # 統計每個元素的頻率
    count = Counter(nums)
    
    # 創建桶，索引為頻率，每個桶儲存具有該頻率的元素
    max_freq = max(count.values())
    buckets = [[] for _ in range(max_freq + 1)]
    
    for num, freq in count.items():
        buckets[freq].append(num)
    
    # 從高頻到低頻遍歷桶，收集前 k 個元素
    result = []
    for i in range(max_freq, 0, -1):
        for num in buckets[i]:
            result.append(num)
            if len(result) == k:
                return result
```

## 代碼解析
1. **計數頻率**：使用 `Counter` 統計數組中每個元素的出現次數。
2. **最小堆方法**：
   - 將頻率和元素存入最小堆，維持堆的大小為 `k`。
   - 彈出頻率較低的元素，最後堆中即為頻率最高的 `k` 個元素。
3. **桶排序方法**：
   - 利用桶的索引表示頻率，將相同頻率的數字放入相應的桶中。
   - 從高頻率桶開始向下收集元素，直到得到 `k` 個。

## 時間和空間複雜度
- **最小堆方法**：
  - **時間複雜度**：O(N log k)，其中 `N` 是數組長度。在最壞情況下需要將 `N` 個元素插入堆中並維護堆的大小為 `k`。
  - **空間複雜度**：O(N + k)，儲存頻率計數和堆。
- **桶排序方法**：
  - **時間複雜度**：O(N)，桶排序和頻率計數都是線性操作。
  - **空間複雜度**：O(N)，儲存頻率計數和桶。
