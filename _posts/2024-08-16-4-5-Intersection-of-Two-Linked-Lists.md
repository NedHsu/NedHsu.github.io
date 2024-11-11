---
title: LeetCode - Intersection of Two Linked Lists（兩個鏈表的交點）
date: 2024-08-13 19:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個整數數組 `nums` 和一個目標值 `target`，請在該數組中找出和為目標值的那兩個整數，並返回它們的索引"
---

## 題目描述
給定兩個單向鏈表 `headA` 和 `headB`，找出它們的交點。若兩鏈表沒有交點，則返回 `None`。

**定義交點**：
交點是指兩個鏈表從某一個節點開始之後的節點完全一致。

**範例**：

```
輸入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
輸出：Reference of the node with value = 8
解釋：兩個鏈表相交於值為 8 的節點。
```

```
輸入：intersectVal = 2, listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
輸出：Reference of the node with value = 2
解釋：兩個鏈表相交於值為 2 的節點。
```

```
輸入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
輸出：null
解釋：兩個鏈表不相交。
```

**限制**：
- 鏈表節點的數量範圍是 `[0, 10^4]`。
- 如果鏈表相交，則 `intersectVal` 是正整數，否則為 `0`。
- 不允許修改鏈表結構。

## 解法思路
為了找到兩個鏈表的交點，我們可以利用**雙指針法**來同步遍歷兩個鏈表。當兩個指針都遍歷過兩個鏈表後，它們會在交點處相遇，若無交點，則最終都為 `None`。

### 雙指針法
1. **設置兩個指針**：設置兩個指針 `pA` 和 `pB`，分別指向鏈表 `headA` 和 `headB` 的頭部。
2. **遍歷鏈表**：
   - 每次將 `pA` 和 `pB` 向前移動一個節點。
   - 當 `pA` 到達 `None` 時，將其重定位到 `headB`。
   - 當 `pB` 到達 `None` 時，將其重定位到 `headA`。
3. **相遇或結束**：
   - 當 `pA` 和 `pB` 在某一節點相遇時，即為交點。
   - 若兩個指針都為 `None`，說明沒有交點。
4. **返回結果**：返回交點節點的引用或 `None`。

## 範例代碼

以下是雙指針法的 Python 實現：

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def getIntersectionNode(headA, headB):
    if not headA or not headB:
        return None
    
    pA, pB = headA, headB

    # 當 pA 與 pB 不相等時，繼續遍歷
    while pA != pB:
        # 當 pA 到達結尾時，重定位到 headB，否則前進
        pA = pA.next if pA else headB
        # 當 pB 到達結尾時，重定位到 headA，否則前進
        pB = pB.next if pB else headA

    # 相交節點或 None
    return pA
```

## 代碼解析
1. **初始化指針**：指針 `pA` 和 `pB` 分別指向 `headA` 和 `headB`。
2. **同步遍歷**：如果 `pA` 或 `pB` 到達鏈表結尾，則將其重定位到另一個鏈表的頭部。
3. **相遇或結束**：當 `pA` 和 `pB` 相等時，即找到交點；若無交點，最終 `pA` 和 `pB` 都會為 `None`。

## 時間和空間複雜度
- **時間複雜度**：O(N + M)，其中 `N` 和 `M` 分別是兩個鏈表的長度，最多遍歷兩個鏈表各一次。
- **空間複雜度**：O(1)，僅使用了固定的指針，不需要額外空間。
