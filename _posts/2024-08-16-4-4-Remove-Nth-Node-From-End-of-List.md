---
title: LeetCode - Remove Nth Node From End of List（移除鏈表倒數第 N 個節點）
date: 2024-08-16 22:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個單向鏈表，刪除鏈表的倒數第 `n` 個節點，並返回鏈表的頭節點。"
---

## 題目描述
給定一個單向鏈表，刪除鏈表的倒數第 `n` 個節點，並返回鏈表的頭節點。

**範例**：

```
輸入：head = [1,2,3,4,5], n = 2
輸出：[1,2,3,5]
```

```
輸入：head = [1], n = 1
輸出：[]
```

```
輸入：head = [1,2], n = 1
輸出：[1]
```

**限制**：
- 鏈表中節點的數量為 `sz`，`1 <= sz <= 30`。
- `0 <= Node.val <= 100`
- `1 <= n <= sz`

## 解法思路
要刪除倒數第 `n` 個節點，可以利用**雙指針法**，其中一個指針比另一個指針提前 `n` 步，從而實現一次遍歷解決問題。

### 雙指針法
1. **設置兩個指針**：初始化兩個指針 `first` 和 `second`，讓它們都指向一個新的虛擬節點 `dummy`。`dummy` 的 `next` 指向 `head`，這樣即使刪除的是頭節點也可以順利進行。
2. **移動第一個指針**：將 `first` 向前移動 `n+1` 步，這樣 `first` 與 `second` 之間的距離就是 `n`。
3. **同時移動兩個指針**：當 `first` 到達鏈表末尾時，`second` 恰好位於待刪節點的前一個節點。
4. **刪除節點**：調整 `second.next`，將它指向 `second.next.next`，以刪除目標節點。
5. **返回頭節點**：返回 `dummy.next` 作為新的頭節點。

## 範例代碼

以下是雙指針法的 Python 實現：

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    first = dummy
    second = dummy

    # 先讓 first 指針前進 n+1 步
    for _ in range(n + 1):
        first = first.next
    
    # 同時移動 first 和 second 指針，直到 first 到達鏈表末尾
    while first:
        first = first.next
        second = second.next

    # 刪除倒數第 n 個節點
    second.next = second.next.next

    return dummy.next
```

## 代碼解析
1. **雙指針初始化**：`dummy` 虛擬節點連接到 `head`，`first` 和 `second` 開始指向 `dummy`。
2. **前進第一指針**：`first` 前進 `n+1` 步，使得兩個指針之間保持 `n` 的距離。
3. **同步移動**：當 `first` 到達末尾時，`second` 位於待刪節點的前一個位置。
4. **刪除節點**：將 `second.next` 指向 `second.next.next`，即刪除倒數第 `n` 個節點。
5. **返回結果**：返回 `dummy.next` 作為新的頭結點。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是鏈表的長度，需要遍歷鏈表一次。
- **空間複雜度**：O(1)，只使用了固定數量的指針，不需要額外空間。
