---
title: .Net 進階設定與技巧
date: 2024-09-30 20:00:00 +0800
categories: [Software, dotnet]
tags: [dotnet] 
excerpt: ".Net 高級配置檔案管理、使用 Dependency Injection (DI) 實現靈活的架構、採用分層架構、AutoMapper、高效能的資料庫操作與查詢優化、使用 SignalR 實現即時通訊功能、微服務架構"
---

### 進階設定與技巧

在完成基本的 **Dotnet Web 應用程式** 開發後，進一步提升你的專案品質與開發效率需要掌握一些進階的設定與技巧。這些技巧不僅能增強應用程式的穩定性與效能，還能為系統的擴展性、維護性提供保障。

---

#### 1. 高級配置檔案管理

##### **環境配置**
在不同的環境（開發、測試、預生產、生產）中，系統可能需要不同的配置參數。Dotnet 提供了一個強大的配置系統，可以輕鬆管理不同的環境變數與設定。

- 使用 `appsettings.json` 檔案進行基本配置。
- 透過 `appsettings.Development.json`、`appsettings.Production.json` 進行環境配置。
- 在 `Program.cs` 或 `Startup.cs` 中根據環境載入對應配置。

範例：

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=myServer;Database=myDB;User=myUser;Password=myPass;"
  }
}
```

##### **Secrets Management**
在開發與生產中，敏感的資訊如 API 密鑰、資料庫密碼等應妥善管理。Dotnet 支援使用 **Azure Key Vault** 或者 **Secret Manager** 來保護這些敏感資料。

- 在本地開發環境中使用 `dotnet user-secrets` 儲存敏感資訊。
- 在雲端環境中，使用 Azure Key Vault 來安全管理機密資訊。

---

#### 2. 使用 Dependency Injection (DI) 實現靈活的架構

Dotnet 原生支援 **依賴注入 (Dependency Injection, DI)**，這種模式能夠讓系統中的各個模組更易於測試與維護。DI 的核心在於將依賴對象的生成和管理交給框架，而不是手動實例化它們。

##### **設定依賴注入**
在 `Startup.cs` 中配置服務：
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddTransient<IMyService, MyService>(); // 短暫生命週期
    services.AddScoped<IRepository, Repository>(); // 每個 HTTP 請求的生命週期
    services.AddSingleton<ILogger, Logger>(); // 單一實例
}
```

##### **使用依賴注入**
在控制器中，通過建構函數注入相應的服務：
```csharp
public class HomeController : Controller
{
    private readonly IMyService _myService;

    public HomeController(IMyService myService)
    {
        _myService = myService;
    }

    public IActionResult Index()
    {
        var result = _myService.DoWork();
        return View(result);
    }
}
```

---

#### 3. 採用分層架構

為了保持應用程式的可維護性與擴展性，建議使用分層架構來組織專案。

##### **典型分層架構**
- **Domain 層**：包含業務邏輯與核心概念（如模型、服務）。
- **Data 層**：負責資料存取，包括 Entity Framework 的資料庫操作。
- **Service 層**：處理業務邏輯，調用 Data 層提供的功能。
- **Web 層**：負責前端 UI 及與用戶的交互，依賴 Service 層進行業務處理。

這種結構將代碼邏輯進行明確分離，便於單元測試和後期維護。

---

#### 4. 使用 AutoMapper 自動化物件轉換

在實務專案中，我們經常需要在資料模型（Data Model）與視圖模型（ViewModel）之間進行轉換，這時可以使用 **AutoMapper** 自動完成這些映射。

##### **AutoMapper 設定**
1. 安裝 AutoMapper 套件：
   ```bash
   dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
   ```

2. 在 `Startup.cs` 中配置：
   ```csharp
   public void ConfigureServices(IServiceCollection services)
   {
       services.AddAutoMapper(typeof(Startup));
   }
   ```

3. 創建映射配置：
   ```csharp
   public class MappingProfile : Profile
   {
       public MappingProfile()
       {
           CreateMap<Book, BookViewModel>();
           CreateMap<BookViewModel, Book>();
       }
   }
   ```

4. 使用 AutoMapper 進行轉換：
   ```csharp
   public class HomeController : Controller
   {
       private readonly IMapper _mapper;

       public HomeController(IMapper mapper)
       {
           _mapper = mapper;
       }

       public IActionResult Index()
       {
           var books = _bookRepository.GetAll();
           var bookViewModels = _mapper.Map<List<BookViewModel>>(books);
           return View(bookViewModels);
       }
   }
   ```

---

#### 5. 高效能的資料庫操作與查詢優化

##### **異步資料庫操作**
在高並發的 Web 應用程式中，資料庫操作可以使用異步方法（`async`/`await`）來提升效能，防止阻塞應用程式的執行。

```csharp
public async Task<IActionResult> Index()
{
    var books = await _bookRepository.GetAllAsync();
    return View(books);
}
```

##### **查詢優化**
- 使用 **Include** 進行關聯資料的預載入，避免 **N+1 問題**。
- 使用 **AsNoTracking** 提高只讀操作的效能。
  
範例：
```csharp
var books = await _context.Books
                .Include(b => b.Author)
                .AsNoTracking()
                .ToListAsync();
```

---

#### 6. 使用 SignalR 實現即時通訊功能

如果你想要在專案中加入即時通訊功能，比如實時更新數據、聊天室等，**SignalR** 是一個非常方便的解決方案。它允許你在伺服器和客戶端之間進行雙向通訊。

##### **SignalR 簡介與實作**
1. 安裝 SignalR：
   ```bash
   dotnet add package Microsoft.AspNetCore.SignalR
   ```

2. 在 `Startup.cs` 中設定 SignalR：
   ```csharp
   public void ConfigureServices(IServiceCollection services)
   {
       services.AddSignalR();
   }

   public void Configure(IApplicationBuilder app)
   {
       app.UseEndpoints(endpoints =>
       {
           endpoints.MapHub<ChatHub>("/chatHub");
       });
   }
   ```

3. 創建 Hub 類別：
   ```csharp
   public class ChatHub : Hub
   {
       public async Task SendMessage(string user, string message)
       {
           await Clients.All.SendAsync("ReceiveMessage", user, message);
       }
   }
   ```

4. 前端與 SignalR 交互（JavaScript）：
   ```javascript
   const connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

   connection.on("ReceiveMessage", (user, message) => {
       console.log(user + ": " + message);
   });

   connection.start().catch(err => console.error(err));
   ```

---

#### 7. 微服務架構

隨著應用程式的擴展，將系統分解為多個微服務是一個提高擴展性與維護性的好方法。微服務架構中，應用程式被分解成數個獨立的服務，每個服務可以被單獨開發、部署與擴展。

##### **實現微服務架構的工具**
- **Docker**：將每個微服務封裝成 Docker 容器，實現輕鬆部署與擴展。
- **Kubernetes**：使用 Kubernetes 管理微服務的自動部署、擴展與調度。

##### **使用 Ocelot 實現 API Gateway**
API Gateway 是微服務架構中的重要組件，它提供一個統一的入口來管理多個微服務的請求。可以使用 **Ocelot** 作為 .NET 中的 API Gateway。

1. 安裝 Ocelot：
   ```bash
   dotnet add package Ocelot
   ```

2. 配置 `ocelot.json`：
   ```json
   {
     "ReRoutes": [
       {
         "DownstreamPathTemplate": "/api/books",
         "UpstreamPathTemplate": "/books",
         "DownstreamHostAndPorts": [
           {
             "Host": "localhost",
             "Port": 5001
           }
         ],
         "UpstreamHttpMethod": [ "GET" ]
       }
     ]
   }
   ```

3. 啟用 Ocelot：
   ```csharp
   public void Configure(IApplicationBuilder app)
   {
       app.UseOcelot().Wait();
   }
   ```

---

這些進階的技巧將有助於你在實際專案中應對更複雜的需求，提高系統的可擴展性、穩定性和效能。掌握它們後，你將能夠開發出高品質的、可運營的企業級應用程式。
