---
title: LeetCode - Reverse Linked List（反轉鏈表）
date: 2024-08-16 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個單向鏈表，將鏈表進行反轉並返回反轉後的鏈表頭結點。"
---

## 題目描述
給定一個單向鏈表，將鏈表進行反轉並返回反轉後的鏈表頭結點。

**範例**：

```
輸入：1 -> 2 -> 3 -> 4 -> 5 -> NULL
輸出：5 -> 4 -> 3 -> 2 -> 1 -> NULL
```

**限制**：
- 你可以使用**迭代法**或**遞歸法**解決這個問題。

## 解法思路
鏈表的反轉可以通過**迭代**或**遞歸**兩種方式完成。下面介紹兩種解法的詳細步驟。

### 方法 1：迭代法
1. **初始化指針**：設置三個指針，`prev` 為 `None`（反轉後的鏈表尾部），`curr` 為頭節點 `head`（當前節點），`next_node` 為當前節點的下一個節點。
2. **逐步反轉**：遍歷鏈表，對每個節點執行以下步驟：
   - 保存當前節點的下一個節點到 `next_node`。
   - 將當前節點的 `next` 指針指向 `prev`。
   - 將 `prev` 更新為當前節點，`curr` 更新為 `next_node`，繼續處理下一個節點。
3. **返回新的頭節點**：當 `curr` 為 `None` 時，表示遍歷完成，`prev` 即為新的頭節點。

### 方法 2：遞歸法
1. **遞歸處理**：對於每個節點，遞歸處理其後續節點直到末尾。當遞歸回溯時，將後一個節點的 `next` 指向當前節點。
2. **返回頭結點**：遞歸基礎情況是 `head.next` 為 `None`，此時返回新的頭節點，並將每層的節點反向連接。

## 範例代碼

以下是使用**迭代法**的 Python 實現：

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next  # 保存下一個節點
        curr.next = prev       # 反轉當前節點的指針
        prev = curr            # 移動 prev 到當前節點
        curr = next_node       # 移動 curr 到下一個節點
    
    return prev
```

以下是使用**遞歸法**的 Python 實現：

```python
def reverseListRecursive(head):
    if not head or not head.next:
        return head
    
    new_head = reverseListRecursive(head.next)
    head.next.next = head  # 將後一個節點指向當前節點
    head.next = None       # 斷開當前節點的 next
    
    return new_head
```

## 代碼解析
1. **迭代法**：不斷反轉當前節點的 `next` 指針，直到遍歷完所有節點。
2. **遞歸法**：每次遞歸到尾節點後，反向連接回到上一層節點。

## 時間和空間複雜度
- **時間複雜度**：O(N)，其中 `N` 是鏈表的長度，需要遍歷每個節點一次。
- **空間複雜度**：迭代法為 O(1)，僅用到常數空間。遞歸法為 O(N)，因為遞歸調用會使用堆疊空間。
