---
title: LeetCode - Merge k Sorted Lists（合併 k 個排序鏈表）
date: 2024-08-20 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定 `k` 個排序的鏈表，將它們合併成一個排序鏈表，並返回該排序鏈表的頭節點。"
---

## 題目描述
給定 `k` 個排序的鏈表，將它們合併成一個排序鏈表，並返回該排序鏈表的頭節點。

**範例**：

```
輸入：lists = [[1,4,5],[1,3,4],[2,6]]
輸出：[1,1,2,3,4,4,5,6]
解釋：所有鏈表合併後變成 [1,1,2,3,4,4,5,6]

輸入：lists = []
輸出：[]

輸入：lists = [[]]
輸出：[]
```

**限制**：
- `k == lists.length`
- `0 <= k <= 10^4`
- `0 <= lists[i].length <= 500`
- `-10^4 <= lists[i][j] <= 10^4`
- `lists[i]` 已按升序排序
- `lists[i].length` 的總和不超過 `10^4`

## 解法思路
該問題是典型的**合併 k 個排序鏈表**問題，可以考慮以下幾種方法：

### 方法一：分治合併
1. 使用兩兩合併的方式，首先合併兩個鏈表，再將結果合併至第三個鏈表，如此反覆，直到最終得到一個合併的結果。
2. 這種方式類似於合併排序（merge sort），能有效降低合併的時間複雜度。

### 方法二：使用優先隊列（最小堆）
1. 將每個鏈表的頭節點放入最小堆中，最小堆可以維持節點值的排序。
2. 每次從堆中取出當前最小的節點，並將該節點的下一個節點（如果有）放入堆中。
3. 重複此過程，直到所有節點都被合併完成。

## 方法二範例代碼

以下是使用最小堆的 Python 實現：

```python
import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    
    # 定義比較函數，方便在堆中進行比較
    def __lt__(self, other):
        return self.val < other.val

def mergeKLists(lists):
    # 建立最小堆
    min_heap = []
    
    # 將每個鏈表的頭節點加入堆中
    for head in lists:
        if head:
            heapq.heappush(min_heap, head)
    
    # 建立一個虛擬頭節點，方便返回結果
    dummy = ListNode()
    current = dummy
    
    # 從堆中取出節點並構建結果鏈表
    while min_heap:
        # 取出最小節點
        node = heapq.heappop(min_heap)
        current.next = node
        current = current.next
        
        # 如果該節點的下一個節點存在，加入堆中
        if node.next:
            heapq.heappush(min_heap, node.next)
    
    return dummy.next
```

## 代碼解析
1. **建立最小堆**：將所有鏈表的頭節點加入最小堆中，以方便每次取得最小值。
2. **構建結果鏈表**：從最小堆中彈出節點，連接到結果鏈表，並將該節點的下一個節點（如果存在）加入堆中。
3. **返回結果**：返回虛擬頭節點的下一個節點，即合併後的鏈表。

## 時間和空間複雜度
- **時間複雜度**：O(N log k)，其中 `N` 是所有節點的總數，`k` 是鏈表數量。在每次插入和彈出操作中，堆的大小為 `k`。
- **空間複雜度**：O(k)，因為堆中最多儲存 `k` 個節點。
