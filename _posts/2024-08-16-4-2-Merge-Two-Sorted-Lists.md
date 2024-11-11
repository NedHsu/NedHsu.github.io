---
title: LeetCode - Merge Two Sorted Lists（合併兩個排序鏈表）
date: 2024-08-16 20:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定兩個**已排序**的單向鏈表 `list1` 和 `list2`，將它們合併成一個新的**排序**鏈表並返回。新的鏈表應該由兩個鏈表的所有節點組成。"
---

## 題目描述
給定兩個**已排序**的單向鏈表 `list1` 和 `list2`，將它們合併成一個新的**排序**鏈表並返回。新的鏈表應該由兩個鏈表的所有節點組成。

**範例**：

```
輸入：list1 = 1 -> 2 -> 4, list2 = 1 -> 3 -> 4
輸出：1 -> 1 -> 2 -> 3 -> 4 -> 4
```

```
輸入：list1 = [], list2 = []
輸出：[]
```

```
輸入：list1 = [], list2 = [0]
輸出：0
```

**限制**：
- 兩個鏈表的節點數總和不會超過 `50`。
- `-100 <= Node.val <= 100`

## 解法思路
這是一個典型的**合併有序鏈表**問題，可以通過**迭代**或**遞歸**來解決。

### 方法 1：迭代法
1. **創建虛擬頭節點**：創建一個虛擬的 `dummy` 節點來作為新鏈表的起始，以方便操作。
2. **比較並合併**：使用兩個指針指向 `list1` 和 `list2` 的當前節點，依次比較它們的值：
   - 若 `list1` 的當前節點較小，將其連接到 `dummy` 的下一個節點，並移動 `list1` 指針到下一個節點。
   - 若 `list2` 的當前節點較小，則將 `list2` 當前節點連接到 `dummy` 的下一個節點，並移動 `list2` 指針。
3. **處理剩餘節點**：當一個鏈表遍歷完時，將另一個鏈表的剩餘部分直接連接到新鏈表的末尾。
4. **返回結果**：返回 `dummy.next` 作為合併後的新鏈表頭節點。

### 方法 2：遞歸法
1. **比較當前節點**：對於 `list1` 和 `list2` 的當前節點，遞歸地選取較小的節點，並將其與合併後的剩餘鏈表相連。
2. **返回結果**：當一個鏈表為空時，直接返回另一個鏈表。

## 範例代碼

以下是使用**迭代法**的 Python 實現：

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    dummy = ListNode()  # 虛擬頭節點
    current = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    # 連接剩餘的節點
    current.next = list1 if list1 else list2

    return dummy.next
```

以下是使用**遞歸法**的 Python 實現：

```python
def mergeTwoListsRecursive(list1, list2):
    if not list1:
        return list2
    if not list2:
        return list1

    if list1.val <= list2.val:
        list1.next = mergeTwoListsRecursive(list1.next, list2)
        return list1
    else:
        list2.next = mergeTwoListsRecursive(list1, list2.next)
        return list2
```

## 代碼解析
1. **迭代法**：通過 `dummy` 節點來簡化合併操作，指針依次連接較小的節點。
2. **遞歸法**：使用遞歸的方式不斷將較小節點的 `next` 連接到合併後的鏈表。

## 時間和空間複雜度
- **時間複雜度**：O(N + M)，其中 `N` 和 `M` 分別是 `list1` 和 `list2` 的長度，需要遍歷兩個鏈表。
- **空間複雜度**：迭代法為 O(1)，不需要額外空間；遞歸法為 O(N + M)，因為遞歸需要堆棧空間。
