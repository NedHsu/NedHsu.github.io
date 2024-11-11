---
title: LeetCode - 乘積除自身數組 (Product of Array Except Self)
date: 2024-08-13 21:00:00 +0800
categories: [Software, LeetCode]
excerpt: "給定一個整數數組 `nums` 和一個目標值 `target`，請在該數組中找出和為目標值的那兩個整數，並返回它們的索引"
---

## **題目描述**：
給定一個整數數組 `nums`，返回一個數組 `output`，其中 `output[i]` 是 `nums` 中除 `nums[i]` 之外的所有元素的乘積。

## **範例**：
   ```
   輸入：nums = [1,2,3,4]
   輸出：[24,12,8,6]
   ```

## **解法思路**：
   1. 先構造一個數組 `left_products`，其中 `left_products[i]` 是 `nums[i]` 左邊所有元素的乘積。
   2. 再構造一個數組 `right_products`，其中 `right_products[i]` 是 `nums[i]` 右邊所有元素的乘積。
   3. 最後，將 `left_products` 和 `right_products` 相乘得到最終結果。

## **範例代碼**（Python）：
   ```python
   def productExceptSelf(nums):
       n = len(nums)
       result = [1] * n

       left_product = 1
       for i in range(n):
           result[i] = left_product
           left_product *= nums[i]

       right_product = 1
       for i in range(n-1, -1, -1):
           result[i] *= right_product
           right_product *= nums[i]

       return result
   ```

## **時間複雜度**：
O(n)，其中 `n` 是數組的長度。空間複雜度也是 O(n)，但如果不計算輸出數組，則可以視為 O(1)。
