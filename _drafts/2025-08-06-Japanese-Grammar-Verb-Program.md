---
title: 日語動詞語態 - 用程式邏輯搞懂動詞變化：從字串處理到活用體系
date: 2025-08-06 19:00:00 +0800
categories: [Language, Japanese]
tags: [日語, 語法, 動詞變化, Python]
excerpt: 將日語動詞變化視為字串處理與規則匹配，透過 Python 程式邏輯深入理解五段活用、一段動詞與不規則變化的內在規律。
---

## 課程預覽

1. **動詞分類邏輯 (Classification)**：區分一、二、三類動詞。
2. **語幹切換 (Stem Switching)**：模擬五十音圖的母音移位。
3. **音便演算法 (Onbin Algorithm)**：處理 `て/た` 形的發音優化。
4. **語態粘著 (Agglutination)**：組合使役、受身與敬語。
5. **Python 整合實作**：自動化變換系統。

---

## 情境 1: 動詞分類器 (Classification Logic)

在程式中，我們透過字尾字元來判斷動詞屬性。這是所有變化的「進入點」。

- **五段動詞 (第一類動詞)**: 字尾分布在「う段」的九個假名。
- **一段動詞 (第二類動詞)**: 字尾必為「る」，且前一個假名為「い/え」段 。
- **不規則動詞 (第三類不規則動詞)**: 僅限「する」與「来る」。

**Python 實作範例：**

```python
def classify(verb):
    exceptions = [ "帰る", "走る", "入る", "切る", "知る", "滑る", "減る", "蹴る", ] # 外表像二類實為一類
    if verb in ["くる", "する", "来る"] or verb.endswith("する"): return "Type3"
    if verb in exceptions: return "Type1"
    if verb.endswith("る") and verb[-2] in "いきしちにひみりえけせてねへめれ":
        return "Type2"
    return "Type1"

```

**例句：** 「**食べる (第二類動詞)**」與「**書く (第一類動詞)**」在邏輯上會走向不同的條件分支。

---

## 情境 2: 基礎語幹與五十音矩陣 (Basic Stems)

日語動詞變化本質上是「母音移位」。五段動詞在母音圖（a, i, u, e, o）上垂直移動，而一段動詞則固定「去る」。

- **未然形 (a-stem)**: 否定、使役、受身。
- **連用形 (i-stem)**: ます形、て形基礎。
- **終止形 (u-stem)**: 原形（基準點）。
- **假定形 (e-stem)**: 假設、可能形。
- **意志形 (o-stem)**: 強烈意圖 。

**Python 實作範例：**

```python
# 模擬五段動詞母音移位
ROW_MAP = {'く': {'a': 'か', 'i': 'き', 'u': 'く', 'e': 'け', 'o': 'こ'}}
def get_stem(verb, target_row):
    v_type = classify(verb)
    if v_type == "Type2": return verb[:-1] # 一段直接去る
    last = verb[-1]
    return verb[:-1] + ROW_MAP[last][target_row]

```

**例句：** 「**書く (kaku)**」將語尾 `u` 變為 `a` 即得否定語幹「**書か (kaka-)**」。

---

## 情境 3: 音便演算法 (Onbin Algorithm)

五段動詞接續 `て/た` 時，為求發音效率會產生「音便」 。

- **促音便 (っ)**: 語尾為「う、つ、る」 。
- **撥音便 (ん)**: 語尾為「ぬ、ぶ、む」（後續需濁音化）。
- **イ音便 (い)**: 語尾為「く、ぐ」 。

**Python 實作範例：**

```python
def get_te_form(verb):
    last = verb[-1]
    if last in "うつる": return verb[:-1] + "って"
    if last in "ぬぶむ": return verb[:-1] + "んで"
    if last == "く": return verb[:-1] + "いて" # 行く除外
    return verb

```

**例句：** 「**待つ (matsu)**」發生促音便變為「**待って (matte)**」。

---

## 情境 4: 語態粘著與複合邏輯 (Agglutination)

日語是「粘著語」，可像樂高一樣組合語素。例如：`被迫吃` = `吃 + 使役 + 受身`。

- **受身形 (Passive)**: a-stem + `れる/られる` 。
- **使役形 (Causative)**: a-stem + `せる/させる` 。
- **使役受身 (Causative-Passive)**: 表達「不情願的被迫」 。

**Python 實作範例：**

```python
# 使役受身邏輯
a_stem = get_stem(verb, 'a')
if v_type == "Type1":
    passive_causative = a_stem + "される" # 縮略形
else:
    passive_causative = a_stem + "させられる"

```

**例句：** 「**飲まされる (nomasareru)**」精確表達了「被迫喝酒」的負面情緒。

---

## 語法重點

1. **粘著特性 (Agglutination)**：動詞本身是核心，透過語幹切換決定接頭，再黏貼助動詞（Auxiliary Verbs）。
2. **例外處理的重要性**：程式邏輯中必須優先檢查 `歸る`、`行く`、`する` 等例外，否則會發生規則崩潰。
3. **社會語用邏輯**：命令形（e-stem）與禁止形（u + な）在邏輯上單純，但社會權力結構中使用受限 。

---

## 練習時間

1. **分類練習**：判斷「走る (hashiru)」屬於哪一類動詞？（提示：它是例外）。
2. **語幹轉換**：試著寫出「読む (yomu)」的意志形語幹（o-stem）。
3. **邏輯串聯**：將「教える」轉換為使役受身形（被迫教）。

---

## 學習總結

- 掌握動詞分類是程式化日語變化的基礎 。
- 五段活用是矩陣式的字母替換，一段活用是字串切片。
- 音便規則是為了處理輔音堆疊產生的發音優化 。
- 語態變換則是語素的層層遞推（Recursion）。

---

**相關文章連結：**

- [日語動詞時態 - 現在・過去・未來](/posts/Japanese-Grammar-Verb-Tenses/)
<!-- - [日語形容詞 - い形容詞・な形容詞](/posts/Japanese-Grammar-Adjectives/) -->
- [日語敬語 - です・ます・だ・である](/posts/Japanese-Grammar-Polite-Speech/)
