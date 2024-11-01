---
title: LeetCode - Find Median from Data Stream（從數據流中找到中位數）
date: 2024-08-19 22:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "實現一個 `MedianFinder` 類，用於從數據流中找到中位數。支持以下兩種操作：`void addNum(int num)`：從數據流中加入一個整數 `num`。`double findMedian()`：返回當前所有元素的中位數。"
---

## 題目描述
實現一個 `MedianFinder` 類，用於從數據流中找到中位數。支持以下兩種操作：
- `void addNum(int num)`：從數據流中加入一個整數 `num`。
- `double findMedian()`：返回當前所有元素的中位數。

**說明**：
- 如果數據流中的元素數量是奇數，則中位數為中間元素。
- 如果數據流中的元素數量是偶數，則中位數為中間兩個元素的平均值。

**範例**：

```plaintext
輸入：
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
輸出：
[null, null, null, 1.5, null, 2.0]
```

**限制**：
- 最多調用 `5 * 10^4` 次 `addNum` 和 `findMedian`。
- 每次調用 `addNum` 時傳入的 `num` 在 `[-10^5, 10^5]` 範圍內。

## 解法思路
這道題要求從不斷更新的數據流中找到中位數。因為數據流是動態更新的，為了能夠在插入新元素後高效地查找中位數，可以考慮使用以下方法：

### 雙堆法（Two Heaps）
1. 使用兩個堆：一個最大堆 `left` 來儲存數據流中較小的一半元素，另一個最小堆 `right` 來儲存較大的一半元素。
2. 保持兩個堆的平衡：
   - 如果插入的數字比 `left` 堆頂大，則加入 `right`，否則加入 `left`。
   - 如果兩個堆的大小差距大於 1，則將元素從元素較多的堆移動到另一個堆，保證 `left` 和 `right` 的大小最多相差 1。
3. 根據堆的大小來計算中位數：
   - 如果兩個堆大小相等，中位數為兩個堆頂的平均值。
   - 如果堆的大小不等，中位數為元素較多的堆的堆頂。

## 代碼實現

以下是使用雙堆方法的 Python 代碼：

```python
import heapq

class MedianFinder:
    def __init__(self):
        # 最大堆存較小的一半元素（負數形式）
        self.left = []
        # 最小堆存較大的一半元素
        self.right = []

    def addNum(self, num):
        # 加入到左邊或右邊堆
        if not self.left or num <= -self.left[0]:
            heapq.heappush(self.left, -num)
        else:
            heapq.heappush(self.right, num)
        
        # 平衡兩個堆的大小
        if len(self.left) > len(self.right) + 1:
            heapq.heappush(self.right, -heapq.heappop(self.left))
        elif len(self.right) > len(self.left):
            heapq.heappush(self.left, -heapq.heappop(self.right))

    def findMedian(self):
        # 若兩個堆的大小相等，返回兩個堆頂的平均值
        if len(self.left) == len(self.right):
            return (-self.left[0] + self.right[0]) / 2
        # 否則返回元素較多的堆的堆頂
        else:
            return -self.left[0]
```

## 代碼解析
1. **初始化**：`left` 用於儲存數據流中較小的一半元素，並以負數形式存入（模擬最大堆），`right` 用於儲存較大的一半元素（最小堆）。
2. **插入元素**：根據插入元素的大小選擇將其加入 `left` 或 `right`，並在插入後檢查兩個堆的大小，進行平衡操作。
3. **查找中位數**：根據 `left` 和 `right` 的大小關係來決定中位數的計算方式。

## 時間和空間複雜度
- **時間複雜度**：
  - `addNum` 操作為 O(log N)，因為需要插入和調整堆。
  - `findMedian` 操作為 O(1)，因為直接訪問堆頂元素。
- **空間複雜度**：O(N)，儲存所有元素。
