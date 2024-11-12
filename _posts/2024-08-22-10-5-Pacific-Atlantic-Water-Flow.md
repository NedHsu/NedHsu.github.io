---
title: LeetCode - Pacific Atlantic Water Flow（太平洋和大西洋水流）
date: 2024-08-22 23:00:00 +0800
categories: [Software, LeetCode]
tags: [LeetCode] 
excerpt: "給定一個 `m x n` 的矩陣 `heights`，其中 `heights[r][c]` 表示地形在位置 `(r, c)` 的高度。矩陣的左邊界和上邊界與太平洋相鄰，右邊界和下邊界與大西洋相鄰。水可以從高地流向低地或等高的相鄰格子。找出所有可以流向**太平洋和大西洋**的坐標點"
---

## 題目描述
給定一個 `m x n` 的矩陣 `heights`，其中 `heights[r][c]` 表示地形在位置 `(r, c)` 的高度。矩陣的左邊界和上邊界與太平洋相鄰，右邊界和下邊界與大西洋相鄰。水可以從高地流向低地或等高的相鄰格子。找出所有可以流向**太平洋和大西洋**的坐標點。

**範例**：

```
輸入：heights = [
  [1,2,2,3,5],
  [3,2,3,4,4],
  [2,4,5,3,1],
  [6,7,1,4,5],
  [5,1,1,2,4]
]
輸出：[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
```

在這個範例中，坐標點 `(0, 4)` 和 `(1, 3)` 等可以流向太平洋和大西洋。

## 解法思路
這個問題可以通過**深度優先搜索（DFS）或廣度優先搜索（BFS）**解決。我們可以反向思考問題：找出可以流向**太平洋**的所有點，然後找出可以流向**大西洋**的所有點，最後取兩者的交集。

### 具體步驟
1. **初始化兩個佔位矩陣**：`pacific_reachable` 和 `atlantic_reachable`，這兩個矩陣的值用來表示該位置是否可以流向對應的海洋。

2. **從邊界開始反向搜索**：
   - 對於太平洋，可以從左邊界和上邊界的所有點開始搜索。
   - 對於大西洋，可以從右邊界和下邊界的所有點開始搜索。
   
3. **進行 DFS 或 BFS 搜索**：從每個邊界的點開始搜索，將當前高度的鄰居高度如果大於等於當前點，則該點可以流向海洋，繼續搜索鄰居點。如此反向遍歷，標記所有可以到達太平洋或大西洋的點。

4. **取交集**：遍歷整個矩陣，將同時標記在 `pacific_reachable` 和 `atlantic_reachable` 中的點作為結果返回。

## 範例代碼

以下是使用 DFS 的 Python 實現：

```python
def pacificAtlantic(heights):
    if not heights or not heights[0]:
        return []

    m, n = len(heights), len(heights[0])
    pacific_reachable = [[False] * n for _ in range(m)]
    atlantic_reachable = [[False] * n for _ in range(m)]

    def dfs(r, c, reachable):
        reachable[r][c] = True
        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:  # 四個方向
            nr, nc = r + dr, c + dc
            if (0 <= nr < m and 0 <= nc < n and not reachable[nr][nc]
                and heights[nr][nc] >= heights[r][c]):
                dfs(nr, nc, reachable)

    # 從太平洋邊界開始搜索
    for i in range(m):
        dfs(i, 0, pacific_reachable)  # 左邊界
        dfs(i, n - 1, atlantic_reachable)  # 右邊界
    for j in range(n):
        dfs(0, j, pacific_reachable)  # 上邊界
        dfs(m - 1, j, atlantic_reachable)  # 下邊界

    # 找到交集
    result = []
    for i in range(m):
        for j in range(n):
            if pacific_reachable[i][j] and atlantic_reachable[i][j]:
                result.append([i, j])

    return result
```

## 代碼解析
1. **初始化矩陣**：`pacific_reachable` 和 `atlantic_reachable` 分別標記可以流向太平洋和大西洋的點。
2. **DFS 遍歷**：對於每個邊界點，使用 DFS 更新 `reachable` 矩陣，找出從該點可以到達的所有點。
3. **找交集**：遍歷整個矩陣，找出同時標記在 `pacific_reachable` 和 `atlantic_reachable` 的點，並將其添加到結果中。

## 時間和空間複雜度
- **時間複雜度**：O(m * n)，其中 `m` 是矩陣的行數，`n` 是矩陣的列數。我們會訪問每個點並進行 DFS 遍歷。
- **空間複雜度**：O(m * n)，用於存儲 `pacific_reachable` 和 `atlantic_reachable` 兩個矩陣。
