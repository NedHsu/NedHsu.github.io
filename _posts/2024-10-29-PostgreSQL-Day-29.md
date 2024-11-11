---
title: PostgreSQL - 第 29 天 - 高可用性設計
date: 2024-10-29 19:00:00 +0800
categories: [Software, PostgreSQL]
excerpt: "高可用性設計確保數據庫在發生故障時仍能提供服務，以最小的中斷持續運行。今天我們將學習 PostgreSQL 中實現高可用性的主要方法，包括主從複製、流式複製、自動故障轉移和備援集群等技術。透過這些技術，可以大幅提升數據庫系統的可靠性和容錯能力。"
---

## 課程簡介
高可用性設計確保數據庫在發生故障時仍能提供服務，以最小的中斷持續運行。今天我們將學習 PostgreSQL 中實現高可用性的主要方法，包括主從複製、流式複製、自動故障轉移和備援集群等技術。透過這些技術，可以大幅提升數據庫系統的可靠性和容錯能力。

---

## 高可用性概念

在 PostgreSQL 中，高可用性通常通過**數據複製**和**自動故障轉移**來實現：

- **數據複製**：將數據庫數據從主服務器複製到從服務器，實現多節點備援。
- **自動故障轉移**：在主服務器失效時，自動將從服務器切換為主服務器，保證服務不中斷。

---

## 主從複製

主從複製是一種基礎的高可用性配置。主節點接收並處理數據庫的寫入操作，然後將更改同步到從節點。從節點通常僅供讀取用途，也可在主節點失效時接替其角色。

### 1. 設置主從複製

在 PostgreSQL 中可以使用 **流式複製 (Streaming Replication)** 實現主從複製。主服務器會將 WAL 日誌傳送到從服務器，確保從節點上的數據持續更新。

#### 主服務器設置

在主服務器的 `postgresql.conf` 文件中啟用 WAL 日誌和流式複製設定：

```conf
wal_level = replica
max_wal_senders = 10
```

修改主服務器 `pg_hba.conf` 文件，允許從服務器的 IP 地址進行連接：

```conf
host replication all <slave_ip_address>/32 md5
```

#### 從服務器設置

在從服務器上使用 `pg_basebackup` 命令進行初始備份並設置同步：

```bash
pg_basebackup -h <primary_host> -D /var/lib/postgresql/data -P -U replication_user --wal-method=stream
```

從服務器啟動並連接到主服務器，即可實現數據同步。

---

### 2. 驗證主從複製狀態

可以通過 `pg_stat_replication` 檢視複製的狀態：

```sql
SELECT * FROM pg_stat_replication;
```

該查詢會顯示當前從節點的同步狀態，以便確認數據同步是否正常。

---

## 故障轉移與高可用性集群

### 1. 自動故障轉移

故障轉移機制允許當主節點故障時，自動切換到可用的從節點，避免服務中斷。可以使用 **Patroni** 或 **pg_auto_failover** 等工具來實現 PostgreSQL 的自動故障轉移。

#### 使用 Patroni 實現自動故障轉移

Patroni 是一個開源的高可用性解決方案，適用於 PostgreSQL 集群。它可以自動監控節點狀態，並在主節點失效時進行自動故障轉移。

- 安裝並配置 Patroni，使其監控主從節點。
- 設置 `ETCD` 或 `Consul` 等一致性服務，以便 Patroni 進行狀態管理和主從切換。

### 2. 高可用性集群架構

在高可用性集群架構中，通常包含多個從節點和監控節點。這些監控節點會監視主從狀態，並在發現故障時進行自動轉移，確保數據庫的穩定性。

高可用性集群架構通常包括以下角色：

- **主節點 (Primary)**：處理所有寫入操作。
- **從節點 (Replicas)**：作為讀取節點，並在主節點故障時接管。
- **監控節點**：監視主節點和從節點的狀態，並協調自動轉移。

---

## 異地容災 (Disaster Recovery)

異地容災指的是在不同地理位置的服務器之間進行數據同步，確保在災難性故障發生時仍能快速恢復數據庫服務。PostgreSQL 可以通過 **異步複製** 實現異地容災，將數據異步地同步到遠程備援服務器。

### 1. 設置異步複製

在配置中將流式複製設置為異步模式，這樣在網路延遲較大的情況下，主服務器不需等待所有從節點的確認即可完成寫入操作。

#### 設置異步模式

在從節點中設定 `synchronous_standby_names`：

```conf
synchronous_commit = off
```

這樣主節點不需要等待異地從節點的回應，適合需要地理容災的情況。

---

## 數據備份和恢復

即使有了高可用性配置，定期的數據備份仍是保障數據安全的關鍵。可以使用 `pg_basebackup` 或 `pg_dump` 進行數據備份，並定期測試恢復過程以確保數據完整性。

### 1. 使用 `pg_basebackup` 備份

`pg_basebackup` 可以創建完整的物理備份，適合用於主從複製的同步起點。

```bash
pg_basebackup -h <host> -D /path/to/backup -U backup_user -Ft -z -P
```

### 2. 使用 `pg_dump` 備份

`pg_dump` 用於創建邏輯備份，適合細粒度數據還原。

```bash
pg_dump -U username -d dbname -f /path/to/backup.sql
```

---

## 高可用性設計的最佳實踐

1. **設定主從複製**：設置並測試主從複製，確保從節點能夠即時接收數據。
2. **自動故障轉移**：使用 Patroni 或 pg_auto_failover 等工具配置自動故障轉移。
3. **異地容災**：配置異地容災備援，確保在地理災難下數據庫仍然可以恢復。
4. **定期備份和還原測試**：建立定期備份計畫，並定期進行數據還原測試。
5. **監控與警報**：配置數據庫監控工具，及時獲取數據庫狀態變化，便於快速響應故障。

---

## 本日總結
今天我們學習了 PostgreSQL 的高可用性設計，包括主從複製、自動故障轉移、異地容災和數據備份。這些技術確保數據庫在面臨硬體故障或災難情況下仍能穩定運行。明天我們將進行最終課程，綜合回顧 PostgreSQL 的核心知識和應用技巧。