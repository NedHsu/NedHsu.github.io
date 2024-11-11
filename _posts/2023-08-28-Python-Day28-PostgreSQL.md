---
title: 第28天：操作 PostgreSQL 資料庫
date: 2023-08-28 20:00:00 +0800
categories: [Software, Python]
excerpt: "操作 PostgreSQL 資料庫在 Python 中可以通過使用 `psycopg` 模組進行。這是 Python 中最常用的 PostgreSQL 資料庫接口，支援多種操作，包括查詢、插入、更新、刪除、事務控制等。以下是如何使用 `psycopg` 操作 PostgreSQL 的詳細介紹。"
---

操作 PostgreSQL 資料庫在 Python 中可以通過使用 `psycopg` 模組進行。這是 Python 中最常用的 PostgreSQL 資料庫接口，支援多種操作，包括查詢、插入、更新、刪除、事務控制等。以下是如何使用 `psycopg` 操作 PostgreSQL 的詳細介紹。

## 1. 安裝 `psycopg`

首先安裝 `psycopg` 模組：
```bash
pip install --upgrade pip               # upgrade pip to at least 20.3
pip install "psycopg[binary,pool]"      # install binary dependencies
```

## 2. 連接到 PostgreSQL 資料庫

在連接資料庫時，需要提供一些基本資訊，如資料庫名稱、用戶名、密碼等。

```python
import psycopg

# 使用上下文管理器連接到 PostgreSQL
with psycopg.connect(
    "dbname=dbname user=user password=password"
) as conn:
    with conn.cursor() as cursor:
        # 在此處執行操作
        result = cursor.execute("select 'Hello world!'")
        print(result.fetchall())
        pass
```

---

## 3. 建立資料表

可以使用 SQL 語句來建立資料表，如 `CREATE TABLE`，並用 `cursor.execute` 執行。

```python
# 建立 users 表
create_table_query = '''
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    age INT
);
'''
cursor.execute(create_table_query)
conn.commit()  # 提交變更
```

---

## 4. 插入資料

使用 `INSERT INTO` 語句插入資料，可以用 `%s` 佔位符來代入數據，並保護程式免於 SQL 注入攻擊。

```python
insert_query = '''
INSERT INTO users (username, email, age) VALUES (%s, %s, %s);
'''
data = ("Alice", "alice@example.com", 25)
cursor.execute(insert_query, data)
conn.commit()
```

---

## 5. 查詢資料

使用 `SELECT` 查詢資料，可以透過 `fetchall`、`fetchone` 或 `fetchmany` 來獲取結果。

```python
select_query = '''
SELECT * FROM users;
'''
cursor.execute(select_query)
rows = cursor.fetchall()

# 輸出查詢結果
for row in rows:
    print(f"ID: {row[0]}, Username: {row[1]}, Email: {row[2]}, Age: {row[3]}")
```

---

## 6. 更新資料

使用 `UPDATE` 語句更新資料庫中的記錄。

```python
update_query = '''
UPDATE users SET age = %s WHERE username = %s;
'''
cursor.execute(update_query, (30, "Alice"))
conn.commit()
```

---

## 7. 刪除資料

使用 `DELETE` 語句刪除資料庫中的記錄。

```python
delete_query = '''
DELETE FROM users WHERE username = %s;
'''
cursor.execute(delete_query, ("Alice",))
conn.commit()
```

---

## 8. 使用事務（Transaction）

PostgreSQL 支援事務，因此在進行多次操作時可以使用 `conn.rollback()` 撤銷變更，確保數據的一致性。

```python
try:
    cursor.execute("BEGIN;")
    cursor.execute("INSERT INTO users (username, email, age) VALUES (%s, %s, %s);", ("Bob", "bob@example.com", 28))
    cursor.execute("UPDATE users SET age = %s WHERE username = %s;", (29, "Bob"))
    conn.commit()  # 提交事務
except Exception as e:
    conn.rollback()  # 若出現錯誤則撤銷
    print("Transaction failed:", e)
```

---

## 9. 關閉連接

完成操作後，記得關閉 cursor 和資料庫連接。

```python
cursor.close()
conn.close()
```

---

## 完整範例

以下是一個完整的程式範例，演示如何連接 PostgreSQL 資料庫，並進行建立、插入、查詢、更新和刪除等操作：

```python
import psycopg

# 連接資料庫
conn = psycopg.connect(
    host="localhost",
    database="your_database",
    user="your_username",
    password="your_password"
)

cursor = conn.cursor()

# 建立資料表
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    age INT
);
''')
conn.commit()

# 插入資料
cursor.execute("INSERT INTO users (username, email, age) VALUES (%s, %s, %s);", ("Alice", "alice@example.com", 25))
conn.commit()

# 查詢資料
cursor.execute("SELECT * FROM users;")
rows = cursor.fetchall()
for row in rows:
    print(row)

# 更新資料
cursor.execute("UPDATE users SET age = %s WHERE username = %s;", (30, "Alice"))
conn.commit()

# 刪除資料
cursor.execute("DELETE FROM users WHERE username = %s;", ("Alice",))
conn.commit()

# 關閉連接
cursor.close()
conn.close()
```

## 注意事項
- **使用佔位符**：用 `%s` 來避免 SQL 注入攻擊。
- **事務控制**：在多步操作中，可以使用 `BEGIN` 和 `ROLLBACK` 控制事務，避免資料不一致。
- **資源管理**：務必在操作完成後關閉 cursor 和 conn，防止資源泄漏。
