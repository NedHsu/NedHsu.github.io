# 日語對話《交通工具全攻略》角色圖與 Veo3 動畫 Prompt

此檔案提供：
- Banana Pro：一張圖切成 6 格的「半身角色立繪」生成 Prompt
- Veo3：讓每位角色開口說話（lip sync）的影片 Prompt
- 方便後續轉成 GIF 的統一規格

---

## 1) Banana Pro 主 Prompt（單張圖 6 角色分割）

```text
Create one single image with a clean 3x2 grid layout (six equal panels), each panel contains one Japanese-learning dialogue character in half-body portrait (from chest up), anime-inspired semi-realistic style, consistent line quality, consistent lighting, consistent camera angle, transparent-looking plain background or very light neutral background for easy post-processing.

Theme: Japan transportation conversation practice.
Mood: friendly, approachable, educational.
Framing: medium close-up, character centered in each panel, enough headroom, no cropped chin, no hands blocking mouth.
Important: Keep each character visually distinct by age, outfit, profession, and accessories.
Image quality: ultra-detailed, sharp face, clean edges, 4k.
No text, no watermark, no logo, no speech bubble.

Panel 1 (top-left): Young traveler (male, late 20s), casual smart jacket, backpack strap visible, curious expression.
Panel 2 (top-center): Bus driver (male, 50s), navy uniform and cap, calm smile.
Panel 3 (top-right): Taxi driver (female, 40s), neat dark suit uniform, white gloves implied, polite expression.
Panel 4 (bottom-left): Train station staff (male, 30s), station uniform with name tag, professional and helpful.
Panel 5 (bottom-center): Rental car clerk (female, late 20s), office uniform, tablet in hand, energetic smile.
Panel 6 (bottom-right): Airport ground staff (female, 30s), airline counter uniform with scarf, welcoming expression.

Background hint in each panel should be minimal and blurred, related to workplace:
bus interior, taxi city lights, station sign, ticket counter, rental office, airport check-in zone.

Color direction: modern Japan city palette, balanced saturation, soft cinematic contrast.
```

---

## 2) Banana Pro 負面 Prompt（建議）

```text
lowres, blurry, extra fingers, deformed face, duplicated person, wrong panel count, merged panels, text overlay, subtitle, logo, watermark, oversaturated skin, heavy shadow on mouth, mouth hidden, cropped head, cropped chin, distorted eyes, asymmetrical face, noisy background, cluttered composition
```

---

## 3) 6 位角色獨立 Prompt（需要分開重生時可用）

### 角色 1：旅客（乘客）

```text
Half-body portrait of a Japanese travel learner character, male late 20s, smart casual jacket, backpack strap on shoulder, friendly and curious eyes, slight smile, anime-inspired semi-realistic style, clean line art, soft studio lighting, plain light background, sharp facial details, no text, 4k.
```

### 角色 2：公車司機

```text
Half-body portrait of a Japanese bus driver, male 50s, navy driver uniform and cap, kind and reliable expression, anime-inspired semi-realistic style, clean edge detail, balanced light, subtle bus interior blur background, no text, 4k.
```

### 角色 3：計程車司機

```text
Half-body portrait of a Japanese taxi driver, female 40s, formal dark taxi uniform, tidy hairstyle, polite smile, confident eye contact, anime-inspired semi-realistic style, soft city-night bokeh background, no text, 4k.
```

### 角色 4：站務員

```text
Half-body portrait of a Japanese train station staff member, male 30s, station uniform with name tag and tie, professional and helpful expression, anime-inspired semi-realistic style, subtle station sign blur background, no text, 4k.
```

### 角色 5：租車店員

```text
Half-body portrait of a Japanese rental car clerk, female late 20s, office uniform, holding a tablet, energetic and service-oriented smile, anime-inspired semi-realistic style, clean lighting, rental office blur background, no text, 4k.
```

### 角色 6：機場地勤

```text
Half-body portrait of a Japanese airport ground staff, female 30s, airline check-in counter uniform with scarf, warm welcoming expression, anime-inspired semi-realistic style, bright and clean airport background blur, no text, 4k.
```

---

## 4) Veo3 主 Prompt（單張圖 6 角色同框說話，後續再切割）

> 用法：把你用 Banana Pro 生成的「3x2 六宮格角色圖」當作參考圖輸入 Veo3。  
> 目標：先生成一支同框影片，之後再切 6 支角色 GIF。

```text
Animate the provided 3x2 six-panel character sheet into a single video.
Keep the exact grid layout and panel boundaries fixed at all times.
Do not move, resize, swap, or merge panels.

Video style: anime-inspired semi-realistic, clean lines, same character identity as source image.
Camera: fully static, no zoom, no pan, no shake.
Duration: 8 seconds, 24fps.

Animation rule:
- Only one panel speaks at a time, in this order: 1 -> 2 -> 3 -> 4 -> 5 -> 6.
- When one character speaks, other five characters stay idle (only tiny blink/breathing).
- Keep lip sync accurate for the active speaker.
- Keep all mouths clearly visible, no hand/prop occlusion.

Speech lines in order:
1) 「すみません、このバスは京都駅に行きますか？」
2) 「はい、行きますよ。」
3) 「かしこまりました。高速道路は使いますか？」
4) 「山手線に乗って、3つ目の駅です。」
5) 「はい、英語と中国語に切り替え可能です。返却時はガソリンを満タンにしてください。」
6) 「パスポートをご提示ください。預け入れ荷物はございますか？」

Audio:
- Natural Japanese voices matching each character.
- Clear speech, no BGM, no ambient noise.

Output constraints for post-splitting:
- Preserve strict 3x2 equal grid for every frame.
- No subtitles, no on-screen text, no watermark.
- Consistent lighting and color across all frames.
```

---

## 5) Veo3 單張 6 角色版本（短片循環、做 GIF 更穩）

```text
Animate the provided six-panel (3x2) character sheet as a loop-friendly talking sequence.
Total duration: 6 seconds, 24fps, static camera.
Each panel speaks.
Inactive panels remain mostly still with subtle blinking only.
No panel border drift, no character crossing panel edges, no layout distortion.
No subtitles, no watermark, no extra text.
Keep output optimized for later splitting into six equal clips/GIFs.
```

---

## 6) Veo3 主 Prompt 模板（單角色重生時可套用）

> 用法：將 `{CHARACTER_NAME}`、`{JP_LINE}`、`{MOOD}` 代入。

```text
Create a short talking-head video of {CHARACTER_NAME}, half-body framing, character facing camera.
Style: anime-inspired semi-realistic, consistent with the source portrait.
Duration: 4-6 seconds.
Motion: subtle natural blinking, slight head movement, gentle shoulder breathing, accurate lip sync while speaking Japanese.
Expression: {MOOD}, friendly and clear pronunciation.
Audio: natural Japanese voice, neutral Tokyo accent, clean studio-like sound, no background music.
Background: simple and softly blurred context-matching environment.
Camera: static, medium close-up, 24fps, high detail.
Spoken line (Japanese): 「{JP_LINE}」
Output should be optimized for easy looping and later GIF conversion.
No subtitles, no on-screen text, no watermark.
```

---

## 7) Veo3 六位角色實際可用 Prompt（單角色版）

### 角色 1 旅客（公車詢問）

```text
Create a short talking-head video of a young male traveler, half-body framing, facing camera, anime-inspired semi-realistic style.
Duration: 5 seconds. Subtle blink and head tilt, accurate lip sync.
Expression: polite and curious.
Audio: natural Japanese male voice.
Spoken line (Japanese): 「すみません、このバスは京都駅に行きますか？」
Background: soft blur bus stop environment. Static camera, 24fps.
No subtitles, no text, no watermark.
```

### 角色 2 公車司機

```text
Create a short talking-head video of a male bus driver in navy uniform and cap, half-body framing, facing camera, anime-inspired semi-realistic style.
Duration: 4-5 seconds. Natural blink and subtle nod, accurate lip sync.
Expression: calm and reassuring.
Audio: natural Japanese male voice.
Spoken line (Japanese): 「はい、行きますよ。」
Background: soft blur bus interior. Static camera, 24fps.
No subtitles, no text, no watermark.
```

### 角色 3 計程車司機

```text
Create a short talking-head video of a female taxi driver in formal uniform, half-body framing, facing camera, anime-inspired semi-realistic style.
Duration: 5 seconds. Gentle facial motion and precise lip sync.
Expression: professional and polite.
Audio: natural Japanese female voice.
Spoken line (Japanese): 「かしこまりました。高速道路は使いますか？」
Background: soft blur city road at night. Static camera, 24fps.
No subtitles, no text, no watermark.
```

### 角色 4 站務員

```text
Create a short talking-head video of a male train station staff member, half-body framing, facing camera, anime-inspired semi-realistic style.
Duration: 5 seconds. Slight nod, natural blink, accurate Japanese lip sync.
Expression: helpful and clear.
Audio: natural Japanese male voice.
Spoken line (Japanese): 「山手線に乗って、3つ目の駅です。」
Background: soft blur train station signage. Static camera, 24fps.
No subtitles, no text, no watermark.
```

### 角色 5 租車店員

```text
Create a short talking-head video of a female rental car clerk holding a tablet, half-body framing, facing camera, anime-inspired semi-realistic style.
Duration: 6 seconds. Light smile change, gentle blink, accurate lip sync.
Expression: energetic and service-minded.
Audio: natural Japanese female voice.
Spoken line (Japanese): 「はい、英語と中国語に切り替え可能です。返却時はガソリンを満タンにしてください。」
Background: soft blur rental counter office. Static camera, 24fps.
No subtitles, no text, no watermark.
```

### 角色 6 機場地勤

```text
Create a short talking-head video of a female airport ground staff in airline uniform with scarf, half-body framing, facing camera, anime-inspired semi-realistic style.
Duration: 5-6 seconds. Natural breathing motion, slight head tilt, accurate lip sync.
Expression: warm and welcoming.
Audio: natural Japanese female voice.
Spoken line (Japanese): 「パスポートをご提示ください。預け入れ荷物はございますか？」
Background: soft blur airport check-in counter. Static camera, 24fps.
No subtitles, no text, no watermark.
```

---

## 8) 後續切割設定（單張 6 角色影片 -> 6 支素材）

```text
Split layout: 3 columns x 2 rows (equal size).
Panel mapping:
- Top-left: Character 1
- Top-center: Character 2
- Top-right: Character 3
- Bottom-left: Character 4
- Bottom-center: Character 5
- Bottom-right: Character 6

Cutting rules:
- Keep original fps (24fps) to maintain lip sync.
- Trim each panel clip to the time range where that panel is speaking.
- Add 0.15-0.25s lead-in and lead-out for smoother GIF loop.
- Export per panel as MP4 first, then convert to GIF/WebP if needed.
```

---

## 9) GIF 製作友善設定（建議）

```text
For all generated videos:
- Keep duration between 4 and 6 seconds
- Use static camera and fixed framing
- Avoid large body movement
- Keep mouth area clearly visible
- Match lighting and color tone across all characters
- Export 1:1 or 4:5 for portrait GIF stickers
```

