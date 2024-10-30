---
title: LeetCode - Linked List Cycle（鏈表環檢測）
date: 2024-08-16 21:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個單向鏈表，判斷鏈表中是否存在環。如果有環，返回 `True`；否則，返回 `False`。"
---

## 題目描述
給定一個單向鏈表，判斷鏈表中是否存在環。如果有環，返回 `True`；否則，返回 `False`。

**範例**：

```
輸入：head = [3,2,0,-4]，pos = 1
輸出：True
解釋：鏈表中有一個環，尾部連接到索引 1 的節點（節點值為 2）。
```

```
輸入：head = [1,2]，pos = 0
輸出：True
解釋：鏈表中有一個環，尾部連接到索引 0 的節點（節點值為 1）。
```

```
輸入：head = [1]，pos = -1
輸出：False
解釋：鏈表中沒有環。
```

**注意**：
- `pos` 是鏈表尾部指向的節點位置，`-1` 表示無環。

## 解法思路
這是一個**檢測環**的經典問題，可以通過**快慢指針法**（也稱為龜兔賽跑算法）來高效解決。

### 方法：快慢指針法
1. **設置快慢指針**：設置兩個指針 `slow` 和 `fast`，初始都指向鏈表的頭節點。
2. **移動指針**：
   - 每次迭代時，`slow` 向前移動一個節點，`fast` 向前移動兩個節點。
   - 如果 `fast` 指針或 `fast.next` 為 `None`，說明鏈表沒有環。
   - 若 `slow` 和 `fast` 相遇，說明鏈表中存在環。
3. **返回結果**：若 `slow` 和 `fast` 相遇，返回 `True`；若 `fast` 或 `fast.next` 為 `None`，則返回 `False`。

## 範例代碼

以下是快慢指針法的 Python 實現：

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def hasCycle(head):
    if not head or not head.next:
        return False
    
    slow, fast = head, head.next
    while slow != fast:
        if not fast or not fast.next:
            return False
        slow = slow.next
        fast = fast.next.next
    
    return True
```

## 代碼解析
1. **初始化指針**：`slow` 和 `fast` 都從頭節點開始。
2. **迴圈檢查**：若 `fast` 為 `None` 或 `fast.next` 為 `None`，鏈表無環。若 `slow` 和 `fast` 相遇，則鏈表有環。
3. **返回結果**：根據迴圈條件返回是否有環。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是鏈表的長度。即使存在環，`fast` 和 `slow` 會最終相遇，且每個節點最多遍歷一次。
- **空間複雜度**：O(1)，只使用了固定數量的指針，不需要額外的空間。
