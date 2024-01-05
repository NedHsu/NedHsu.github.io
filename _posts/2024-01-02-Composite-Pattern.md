---
title: 組合模式 - Composite Pattern
date: 2024-01-02 19:58:00 +0800
categories: [Software, Design Pattern]
tags: [Design Pattern]     # TAG names should always be lowercase
mermaid: true
excerpt: "組合模式（Composite Pattern） - 將對象“組合”成樹結構以表示部分-整體層次結構"
---

## 用途

> 將對象"組合"成樹結構以表示部分-整體層次結構


## 例子

當談到組合模式（Composite Pattern）時，我們可以以一個組織架構為例來解釋<br>

想像一個<mark>組織</mark>，它由<mark>多個部門</mark>組成，每個部門又可以進一步分為<mark>多個小組或子部門</mark>，而這些小組或子部門又可以進一步包含更小的單位或成員<br>
整個組織結構形成了一個階層結構<br>

在組織架構中，每個部門或單位都具有相似的屬性和行為，無論是部門還是小組，都有負責特定任務的成員<br>
這種階層結構和相似的屬性和行為可以使用組合模式來設計和實現<br>

### Component

```cs
// 組織成員抽象類別
public abstract class OrganizationMember
{
    protected string name;

    public OrganizationMember(string name)
    {
        this.name = name;
    }

    public abstract void DisplayMemberInfo();
}
```

### Leaf

```cs
// 部門類別，同時也是葉子節點
public class Department : OrganizationMember
{
    public Department(string name) : base(name)
    {
    }

    public override void DisplayMemberInfo()
    {
        Console.WriteLine("Department: " + name);
    }
}
```

### Composite

```cs
// 組織類別，同時也是容器節點
public class Organization : OrganizationMember
{
    private List<OrganizationMember> members = new List<OrganizationMember>();

    public Organization(string name) : base(name)
    {
    }

    public void AddMember(OrganizationMember member)
    {
        members.Add(member);
    }

    public void RemoveMember(OrganizationMember member)
    {
        members.Remove(member);
    }

    public override void DisplayMemberInfo()
    {
        Console.WriteLine("Organization: " + name);

        foreach (var member in members)
        {
            member.DisplayMemberInfo();
        }
    }
}
```

### Client

```cs
// 建立組織架構
Organization organization = new Organization("ABC Company");

Department salesDepartment = new Department("Sales Department");
Department marketingDepartment = new Department("Marketing Department");

Department developmentDepartment = new Department("Development Department");
Department qaDepartment = new Department("QA Department");

Department customerServiceDepartment = new Department("Customer Service Department");

organization.AddMember(salesDepartment);
organization.AddMember(marketingDepartment);

organization.AddMember(developmentDepartment);
organization.AddMember(qaDepartment);

organization.AddMember(customerServiceDepartment);

// 顯示組織架構
organization.DisplayMemberInfo();

Console.ReadLine();
```

## 延伸
