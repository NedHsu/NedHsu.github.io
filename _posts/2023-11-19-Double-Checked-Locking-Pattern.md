---
title: 雙重檢查鎖定模式 - Double-Checked Locking Pattern
date: 2023-11-19 19:58:00 +0800
categories: [Software, Design Pattern]
tags: [Design Pattern]     
mermaid: true
excerpt: "雙重檢查鎖定模式（Double-Checked Locking Pattern） - 一種軟體設計模式用來減少並發系統中競爭和同步的開銷"
---


## 用途

> 雙重檢查鎖定模式（也被稱為"雙重檢查加鎖優化"，"鎖暗示"（Lock hint））是一種軟體設計模式用來減少並發系統中競爭和同步的開銷。雙重檢查鎖定模式首先驗證鎖定條件(第一次檢查)，只有通過鎖定條件驗證才真正的進行加鎖邏輯並再次驗證條件(第二次檢查)。

### Class

```java
// Java 5中的final語義可以不使用volatile關鍵字實現安全的創建對象

public class FinalWrapper<T> {
    public final T value;
    public FinalWrapper(T value) {
        this.value = value;
    }
}

public class Foo {
   private FinalWrapper<Helper> helperWrapper = null;

   public Helper getHelper() {
      FinalWrapper<Helper> wrapper = helperWrapper;

      if (wrapper == null) {
          synchronized(this) {
              if (helperWrapper == null) {
                  helperWrapper = new FinalWrapper<Helper>(new Helper());
              }
              wrapper = helperWrapper;
          }
      }
      return wrapper.value;
   }
}
```

## 延伸
