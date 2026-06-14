下面這組可以直接丟給 Codex。建議用 **Vite + React + TypeScript + Tailwind + GitHub Pages**，最快做 MVP，手機閱讀體驗最好。

---

# Prompt 1：建立專案

```md
你是一位資深前端工程師。請建立一個可部署到 GitHub Pages 的 MVP Web App。

專案名稱：ai-marathon-coach

技術棧：
- Vite
- React
- TypeScript
- Tailwind CSS
- Recharts
- localStorage
- GitHub Pages deploy workflow

目標：
這是一個「AI 馬拉松教練 App」的手機優先 Web MVP。
第一位用戶是一位女跑者：
- 女
- 33歲
- 身高 156cm
- 體重 48kg
- 半馬目標 21K
- 賽事時間：約5個多月後
- 每週可訓練 3 天
- 通常週六才有空長跑
- 左膝超過 3K 曾疼痛
- 最近訓練：
  - 6/6 跑 10.01K，平均配速 7'21/km，平均心率 173，8K 後膝蓋痛
  - 6/13 跑 11.01K，平均配速 7'23/km，平均心率 172，跑後膝蓋痛，右大腿後側酸痛

請先建立完整專案結構，包含：
- package.json
- vite.config.ts
- tailwind.config.js
- postcss.config.js
- src/main.tsx
- src/App.tsx
- src/index.css
- src/data/runnerProfile.ts
- src/data/trainingLogs.ts
- src/data/weeklyPlan.ts
- src/components/*
- .github/workflows/deploy.yml

要求：
- 手機優先設計，寬度 390px 體驗良好
- 使用卡片式 UI
- 所有文字使用繁體中文
- 頁面要像健康 App，不要像後台
- 色彩乾淨、柔和、運動感
- 不要做登入
- 不要接後端
- 資料先寫死在 TypeScript 檔案
- 支援 GitHub Pages 部署
```

---

# Prompt 2：主畫面 UX

```md
請實作 AI 馬拉松教練 App 的首頁。

首頁要包含以下區塊：

1. Header
- 顯示「AI 半馬教練」
- 顯示跑者名稱：女跑者 A
- 顯示目前狀態 badge：「恢復調整週」

2. 今日建議卡片
今天是 6/14 週日。
昨天 6/13 已完成 11.01K 長跑。
今天安排：
- 恢復日
- 散步 30~60 分鐘
- 熱敷膝蓋
- 大腿後側輕伸展
- 不跑步

3. 風險提醒卡
顯示：
- 跑後膝蓋痛
- 右大腿後側酸痛
- 本週不追距離
- 週六長跑降為 9K

4. 最新訓練摘要
顯示 6/13：
- 距離 11.01K
- 時間 1:21:18
- 平均配速 7'23/km
- 平均心率 172 bpm
- 平均步頻 169 spm
- 體感：不太喘
- 備註：膝蓋痛、右大腿後側酸

5. 本週 KPI
- 9K 完跑後膝蓋不痛
- 若 9K 才開始痛，代表有進步
- 若 8K 或更早痛，代表需要維持恢復週

設計要求：
- 手機版優先
- 卡片間距舒服
- 關鍵數字要大
- 用 emoji 或 icon 提升可讀性
- 不要塞滿文字
- 每張卡最多 5 行
```

---

# Prompt 3：週課表頁面

```md
請新增 WeeklyPlan 頁面/區塊。

本週課表時間：
6/14 週日 ～ 6/20 週六

課表內容：

週日 6/14
- 恢復日
- 散步 30~60 分鐘
- 熱敷膝蓋
- 大腿後側伸展
- 不跑步

週一 6/15
- 休息日
- 可選超慢跑 20 分鐘
- 若膝蓋痛，完全休息

週二 6/16
- Easy Run 4K
- 配速 7'50~8'30/km
- 能聊天、不喘
- 膝蓋有感覺立刻改走路

週三 6/17
- 臀肌訓練 15~20 分鐘
- 蚌殼開合 3x15
- 側躺抬腿 3x15
- 單腳橋式 3x12
- Monster Walk 3x20步

週四 6/18
- Easy Run 5K
- 配速 7'50~8'30/km
- 不追速度
- 只看舒適度

週五 6/19
- 完全休息
- 睡眠優先

週六 6/20
- Long Run 9K
- 配速 7'50~8'30/km
- 能聊天
- 不追配速
- 跑完膝蓋不痛為成功

UI 要求：
- 手機上以「一日一卡」垂直列表呈現
- 今日卡片高亮
- 週六長跑用特殊顏色標示
- 每張卡片要有「目的」欄位
- 每張卡片要有「注意事項」
```

---

# Prompt 4：訓練紀錄與趨勢

```md
請新增 TrainingLog 區塊，呈現最近訓練紀錄與趨勢。

資料：
[
  {
    date: "2026-06-01",
    distanceKm: 6.0,
    duration: "46:43",
    pace: "7'48/km",
    avgHr: 140,
    cadence: 169,
    note: "有氧狀態佳"
  },
  {
    date: "2026-06-06",
    distanceKm: 10.01,
    duration: "1:13:28",
    pace: "7'21/km",
    avgHr: 173,
    cadence: 164,
    note: "8K 後膝蓋痛"
  },
  {
    date: "2026-06-13",
    distanceKm: 11.01,
    duration: "1:21:18",
    pace: "7'23/km",
    avgHr: 172,
    cadence: 169,
    note: "跑後膝蓋痛，右大腿後側酸"
  }
]

請實作：
1. 最近紀錄卡片
2. 距離趨勢折線圖
3. 平均心率趨勢折線圖
4. 訓練提醒：
   - 距離進步很快
   - 心率資料可能偏高，需搭配主觀感受
   - 膝蓋狀況比配速更重要

使用 Recharts。
手機版圖表高度 180px。
圖表不要太複雜。
```

---

# Prompt 5：AI 教練分析頁

```md
請新增 CoachInsight 區塊。

內容要像 AI 教練給跑者的每日建議，不要像醫療診斷。

請包含：

目前判斷：
- 已具備 10K~11K 完跑能力
- 半馬完成機率高
- 目前最大限制不是心肺，而是膝蓋與肌肉耐受度
- 右大腿後側酸痛代表 Hamstring 負荷較高
- 屁股外側酸可能與臀中肌疲勞有關

本週策略：
- 不衝 12K
- 週六長跑降為 9K
- 週二、週四只跑 Easy
- 週三補臀肌訓練
- 若膝蓋痛，立刻改走路

判斷規則：
- 9K 後膝蓋不痛：下週可回到 11K
- 9K 才開始痛：代表比 8K 痛點延後，有進步
- 8K 或更早開始痛：維持 9K，不增加距離
- 疼痛超過 48 小時：停止跑步，改散步或單車

UI：
- 使用「教練說」對話卡
- 使用三個狀態 badge：良好 / 觀察 / 風險
- 不要讓文字太密
```

---

# Prompt 6：疼痛追蹤功能 MVP

```md
請新增 PainTracker 功能。

不需要後端，用 localStorage 儲存。

欄位：
- 日期
- 膝蓋疼痛分數 0~10
- 大腿後側酸痛分數 0~10
- 疼痛位置：
  - 膝蓋前側
  - 膝蓋外側
  - 膝蓋內側
  - 膝蓋下方
  - 大腿後側
  - 屁股外側
- 備註

功能：
1. 表單輸入
2. 儲存到 localStorage
3. 顯示最近 7 筆紀錄
4. 若膝蓋痛 >= 5，顯示紅色提醒：
   「本週不建議增加距離」
5. 若疼痛連續 2 天 >= 5，顯示：
   「建議暫停跑步，改恢復訓練」

UI：
- 手機友善
- 分數用大按鈕 0~10
- 疼痛位置用 chip 多選
```

---

# Prompt 7：底部導航

```md
請加入 Mobile Bottom Navigation。

Tab：
1. 今日
2. 課表
3. 紀錄
4. 疼痛
5. 教練

要求：
- 固定在底部
- iPhone Safari 安全區域處理
- 點擊切換區塊，不需要 React Router
- 目前 active tab 高亮
- App 內容底部要保留 padding，避免被 nav 擋住
```

---

# Prompt 8：GitHub Pages 部署

```md
請完成 GitHub Pages 部署設定。

需求：
- vite.config.ts 設定 base 為 "/ai-marathon-coach/"
- package.json 加入：
  - dev
  - build
  - preview
- 新增 .github/workflows/deploy.yml
- main branch push 後自動 build 並部署 GitHub Pages
- README.md 寫清楚：
  - 如何本機啟動
  - 如何部署
  - 如何修改跑者資料
  - 如何修改課表

請確認 npm run build 可成功。
```

---

# Prompt 9：UI 優化

```md
請優化整體 UI，使它更像一個成熟的手機健康 App。

設計方向：
- Mobile first
- 乾淨、柔和、專業
- 不要像簡報圖卡
- 不要資訊過載
- 每個畫面只回答一件事
- 關鍵數據使用大字
- 警告資訊要清楚但不要恐嚇

請優化：
- spacing
- typography
- card shadow
- border radius
- color system
- badge
- empty state
- button states

請定義一套簡單 design tokens：
- primary
- success
- warning
- danger
- muted
- surface
- background
```

---

# Prompt 10：README 產品化方向

```md
請在 README.md 補上一段 MVP Roadmap。

目前版本：
- 單一跑者
- 靜態資料
- localStorage 疼痛紀錄
- GitHub Pages 部署

下一階段：
1. 支援多跑者 Profile
2. 匯入 Apple Watch 截圖或手動輸入訓練資料
3. AI 自動生成每週課表
4. 疼痛風險規則引擎
5. 訓練週期化：3週累積 + 1週減量
6. Firebase / Supabase 後端
7. PWA 離線使用
8. LINE Bot 推播每日課表
9. 付費方案：
   - 個人跑者
   - 教練管理多位跑者
   - 跑團方案

請用產品文件語氣，不要太學術。
```

---

## 最推薦 MVP 資訊架構

```txt
今日
- 今天要做什麼
- 為什麼
- 注意什麼

課表
- 週日到週六
- 每天一張卡
- 週六長跑突出

紀錄
- 最近三次訓練
- 距離趨勢
- 心率趨勢

疼痛
- 今天痛幾分
- 哪裡痛
- 是否需要降載

教練
- AI 分析
- 下週是否升級
- 風險提醒
```

這個方向比圖卡好很多，因為手機上可以「分層閱讀」，而不是把所有資訊塞進一張大圖。
