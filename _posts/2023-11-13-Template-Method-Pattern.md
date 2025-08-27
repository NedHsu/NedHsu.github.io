---
title: 模板方法模式 - Template Method Pattern
date: 2023-11-13 09:58:00 +0800
categories: [Software, Design Pattern]
tags: [Design Pattern]     
mermaid: true
excerpt: "模板方法模式（Template Method Pattern）是一種行為型設計模式，定義演算法的骨架，讓子類別可以重新定義某些步驟"
---

## 用途

模板方法模式（Template Method Pattern）是一種行為型設計模式，它定義了一個演算法的骨架，將某些步驟延遲到子類別中實作。這個模式讓子類別可以在不改變演算法結構的情況下，重新定義演算法的某些特定步驟。

### 主要特色：
- **演算法骨架**：在父類別中定義演算法的基本結構
- **步驟抽象化**：將可變的步驟定義為抽象方法或虛擬方法
- **繼承機制**：子類別透過繼承來實作特定的步驟
- **控制流程**：父類別控制演算法的執行順序

### 適用情境：
- 當有多個類別包含相似的演算法，只有某些步驟不同時
- 當需要控制子類別的擴展，只允許在特定點進行擴展時
- 當想要避免重複的程式碼，將共同的演算法邏輯提取到父類別時

```mermaid
classDiagram
  AbstractClass <|-- ConcreteClassA
  AbstractClass <|-- ConcreteClassB
  class AbstractClass {
    <<Abstract>>
    +templateMethod()
    +operation1()
    +operation2()
    +operation3()
    +{abstract} primitiveOperation1()
    +{abstract} primitiveOperation2()
    +hook()
  }
  class ConcreteClassA {
    +primitiveOperation1()
    +primitiveOperation2()
  }
  class ConcreteClassB {
    +primitiveOperation1()
    +primitiveOperation2()
  }
```

## 例子

以下是一個使用 C# 語言實作的模板方法模式範例：

```csharp
using System;

// 抽象類別定義模板方法
public abstract class BeverageTemplate
{
    // 模板方法 - 定義演算法的骨架
    public void PrepareBeverage()
    {
        BoilWater();
        Brew();
        PourInCup();
        if (CustomerWantsCondiments())
        {
            AddCondiments();
        }
    }

    // 共同實作的方法
    private void BoilWater()
    {
        Console.WriteLine("將水煮沸");
    }

    private void PourInCup()
    {
        Console.WriteLine("倒入杯中");
    }

    // 抽象方法 - 必須由子類別實作
    protected abstract void Brew();
    protected abstract void AddCondiments();

    // 鉤子方法 - 子類別可以選擇性覆寫
    protected virtual bool CustomerWantsCondiments()
    {
        return true;
    }
}

// 具體實作 - 咖啡
public class Coffee : BeverageTemplate
{
    protected override void Brew()
    {
        Console.WriteLine("用沸水沖泡咖啡粉");
    }

    protected override void AddCondiments()
    {
        Console.WriteLine("加入糖和牛奶");
    }

    protected override bool CustomerWantsCondiments()
    {
        Console.WriteLine("顧客想要加入調味料嗎？(y/n)");
        string answer = Console.ReadLine();
        return answer.ToLower().StartsWith("y");
    }
}

// 具體實作 - 茶
public class Tea : BeverageTemplate
{
    protected override void Brew()
    {
        Console.WriteLine("用沸水浸泡茶葉");
    }

    protected override void AddCondiments()
    {
        Console.WriteLine("加入檸檬");
    }
}

// 使用範例
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("製作咖啡：");
        BeverageTemplate coffee = new Coffee();
        coffee.PrepareBeverage();

        Console.WriteLine("\n製作茶：");
        BeverageTemplate tea = new Tea();
        tea.PrepareBeverage();
    }
}
```

這個範例展示了如何使用模板方法模式來定義飲料製作的演算法骨架，讓不同的飲料類別可以實作特定的步驟。

## 延伸

模板方法模式有幾種常見的變體和延伸：

### 鉤子方法（Hook Methods）
- **鉤子方法**：提供預設實作的虛擬方法，子類別可以選擇性覆寫
- **強制鉤子**：抽象方法，子類別必須實作

### 相關模式
- **策略模式（Strategy Pattern）**：當演算法完全不同時使用
- **工廠方法模式（Factory Method Pattern）**：經常與模板方法模式結合使用
- **命令模式（Command Pattern）**：可以與模板方法模式結合來處理複雜的操作序列

### 實際應用
- 框架設計中的生命週期方法
- 資料庫操作的 CRUD 模板
- 遊戲引擎中的遊戲迴圈
- 測試框架中的測試流程模板

### 優缺點
**優點：**
- 避免重複的程式碼
- 提供演算法的擴展點
- 符合開閉原則

**缺點：**
- 繼承的固有限制
- 可能違反里氏替換原則
- 父類別與子類別之間的緊耦合
