---
title: PHP - JSON 與 XML 資料處理 
date: 2023-09-18 19:00:00 +0800
categories: [Software, PHP]
tags: [PHP] 
excerpt: "JSON 與 XML 是常見的資料格式，廣泛用於 API 資料傳輸和配置檔案處理。本課程將講解如何使用 PHP 讀取、解析、生成 JSON 和 XML 資料，並比較兩種格式的使用場景。"
--- 

---

## 課程簡介  
JSON 與 XML 是常見的資料格式，廣泛用於 API 資料傳輸和配置檔案處理。本課程將講解如何使用 PHP 讀取、解析、生成 JSON 和 XML 資料，並比較兩種格式的使用場景。

---

## JSON 資料處理  

### 1. 什麼是 JSON  
- JSON（JavaScript Object Notation）是一種輕量級資料交換格式。  
- 其格式簡單，易於人閱讀和機器解析。

範例：  
```json
{
    "name": "John Doe",
    "age": 30,
    "languages": ["English", "French"]
}
```

---

### 2. PHP 與 JSON  

#### 讀取 JSON 資料  
使用 `json_decode` 解析 JSON 字串：  
```php
$jsonString = '{"name":"John Doe","age":30,"languages":["English","French"]}';
$data = json_decode($jsonString, true);

echo $data['name']; // John Doe
```

- **第二個參數**：設定為 `true` 時，將 JSON 解析為關聯陣列；若為 `false`（預設值），則解析為物件。

---

#### 生成 JSON 資料  
使用 `json_encode` 將 PHP 資料結構轉為 JSON 字串：  
```php
$data = [
    "name" => "John Doe",
    "age" => 30,
    "languages" => ["English", "French"]
];

$jsonString = json_encode($data, JSON_PRETTY_PRINT);
echo $jsonString;
```

- **`JSON_PRETTY_PRINT`**：讓輸出格式更易閱讀。  

---

### 3. JSON 與檔案操作  

#### 讀取 JSON 檔案  
```php
$jsonString = file_get_contents('data.json');
$data = json_decode($jsonString, true);
```

#### 寫入 JSON 檔案  
```php
$data = [
    "name" => "Jane Doe",
    "age" => 25,
    "languages" => ["Spanish", "German"]
];

$jsonString = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents('data.json', $jsonString);
```

---

## XML 資料處理  

### 1. 什麼是 XML  
- XML（eXtensible Markup Language）是一種標記語言，用於描述資料結構。  
- 常見於設定檔案與舊版 API 資料交換。

範例：  
```xml
<person>
    <name>John Doe</name>
    <age>30</age>
    <languages>
        <language>English</language>
        <language>French</language>
    </languages>
</person>
```

---

### 2. PHP 與 XML  

#### 讀取 XML 資料  
使用 `simplexml_load_string` 解析 XML 字串：  
```php
$xmlString = '<person>
                <name>John Doe</name>
                <age>30</age>
                <languages>
                    <language>English</language>
                    <language>French</language>
                </languages>
              </person>';

$xml = simplexml_load_string($xmlString);
echo $xml->name; // John Doe
```

---

#### 生成 XML 資料  
使用 `DOMDocument` 生成 XML：  
```php
$doc = new DOMDocument('1.0', 'UTF-8');

$person = $doc->createElement('person');
$doc->appendChild($person);

$name = $doc->createElement('name', 'John Doe');
$person->appendChild($name);

$age = $doc->createElement('age', '30');
$person->appendChild($age);

$doc->formatOutput = true;
echo $doc->saveXML();
```

---

### 3. XML 檔案操作  

#### 讀取 XML 檔案  
```php
$xml = simplexml_load_file('data.xml');
echo $xml->name;
```

#### 寫入 XML 檔案  
```php
$doc = new DOMDocument('1.0', 'UTF-8');
$doc->formatOutput = true;

// XML 結構建立省略
$doc->save('data.xml');
```

---

## JSON 與 XML 比較  

| 特性         | JSON                                | XML                                  |
|--------------|-------------------------------------|--------------------------------------|
| 易讀性       | 簡單，類似物件結構                  | 較冗長，標記結構需要額外學習        |
| 資料類型支持 | 支援字串、數字、布林值、陣列等      | 僅支援字串（需要額外轉換）          |
| 可擴展性     | 僅支援基本資料結構                  | 高度可擴展，可用於複雜結構          |
| 使用場景     | 現代 API 資料交換，前端與後端通訊  | 舊系統整合，設定檔案                |

---

## 教學練習  

### 練習 1：處理 JSON 資料  
1. 撰寫程式從 JSON 檔案讀取使用者清單，列出所有使用者的名字與年齡。  
2. 將清單新增一位使用者後，重新寫入 JSON 檔案。

### 練習 2：處理 XML 資料  
1. 從 XML 檔案中讀取商品清單，列出所有商品名稱與價格。  
2. 新增一項商品後，將資料存回 XML 檔案。

---

## 教學重點  
- 熟悉 JSON 與 XML 的基本結構與使用方式。  
- 掌握 PHP 的 `json_encode`、`json_decode` 與 XML 解析方法。  
- 理解 JSON 與 XML 的優缺點，選擇適合的資料格式解決不同問題。  

---
