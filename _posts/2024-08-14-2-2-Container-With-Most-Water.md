---
title: LeetCode - Container With Most Water（容納最多水的容器）
date: 2024-08-14 20:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個整數數組 `height`，其中每個元素 `height[i]` 表示容器兩邊垂直線的高度。每個垂直線與相鄰線的間距為 1，選擇兩條線構成容器，使其可以裝最多的水。返回該容器可以容納的最大水量"
---

## 題目描述
給定一個整數數組 `height`，其中每個元素 `height[i]` 表示容器兩邊垂直線的高度。每個垂直線與相鄰線的間距為 1，選擇兩條線構成容器，使其可以裝最多的水。返回該容器可以容納的最大水量。

**範例**：

```
輸入：height = [1,8,6,2,5,4,8,3,7]
輸出：49
解釋：選擇位置 1 和位置 8 的兩條線，高度分別為 8 和 7，間距為 7。水量為 7 * min(8, 7) = 49。
```

## 解法思路
該問題可以通過 **雙指針法** 高效解決。雙指針法從兩端開始，以逼近最大水量。

1. **初始化**：設置左指針 `left` 指向數組的起始位置，右指針 `right` 指向數組的末尾位置。
2. **計算水量**：
   - 當左指針 `left` 和右指針 `right` 所指的線高度為 `height[left]` 和 `height[right]` 時，水量取決於兩者之間的最小高度 `min(height[left], height[right])` 乘以左右指針的距離 `right - left`。
   - 計算並記錄當前水量，並更新最大水量。
3. **移動指針**：
   - 為了找到更大的水量，每次移動較短的那一邊的指針（因為較短的高度限制了容積），移動後的高度可能更高，從而獲得更大的容積。
   - 如果 `height[left] < height[right]`，將 `left` 向右移動；否則，將 `right` 向左移動。
4. **終止條件**：當 `left` 與 `right` 相遇時，遍歷結束，最大水量即為結果。

## 範例代碼

以下是 Python 的實現：

```python
def maxArea(height):
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # 計算當前容積
        width = right - left
        current_height = min(height[left], height[right])
        current_water = width * current_height
        max_water = max(max_water, current_water)
        
        # 移動指針以尋找更大容積
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water
```

## 代碼解析
1. **初始化**：`left` 指向數組起始位置，`right` 指向末尾位置，`max_water` 初始化為 0。
2. **計算容積**：
   - 每次計算容積 `current_water = width * current_height`，並更新 `max_water`。
3. **移動指針**：
   - 比較 `height[left]` 和 `height[right]`，移動較小高度的指針以尋找更高的可能性。
4. **返回結果**：最終的 `max_water` 即為可容納的最大水量。

## 時間和空間複雜度
- **時間複雜度**：O(n)，其中 `n` 是數組的長度，雙指針遍歷每個元素一次。
- **空間複雜度**：O(1)，只使用了常數空間來存儲指針和最大水量。
