# AI 半馬教練

手機優先的 AI 馬拉松教練 MVP。第一版針對單一女跑者，使用靜態資料、簡單規則與 localStorage 疼痛紀錄，協助判斷本週是否該增加距離或維持恢復。

## 功能

- 今日：今日訓練建議、風險提醒、最新訓練摘要、本週目標
- 課表：6/14 到 6/20 一日一卡課表
- 紀錄：最近三次訓練、距離趨勢、平均心率趨勢
- 疼痛：膝蓋與大腿後側疼痛追蹤，資料存於 localStorage
- 教練：靜態規則產生的每日教練建議

## 本機啟動

```bash
npm install
npm run dev
```

開啟 Vite 顯示的本機網址即可使用。

## 建置

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

專案已設定 GitHub Pages workflow：

- `vite.config.ts` 的 `base` 為 `/ai-marathon-coach/`
- push 到 `main` branch 後會自動執行 `npm ci` 與 `npm run build`
- build 成功後會將 `dist` 部署到 GitHub Pages

若 GitHub repo 名稱不是 `ai-marathon-coach`，請同步調整 `vite.config.ts` 的 `base`。

## 修改跑者資料

跑者設定在：

```txt
src/data/runnerProfile.ts
```

可修改姓名、目標、身高體重、每週訓練天數、目前狀態與風險訊號。

## 修改課表

本週課表在：

```txt
src/data/weeklyPlan.ts
```

每一天都包含日期、標題、訓練目的、課表項目與注意事項。首頁與週課表目前固定以 2026-06-14 這週呈現。

## MVP Roadmap

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
5. 訓練週期化：3 週累積 + 1 週減量
6. Firebase / Supabase 後端
7. PWA 離線使用
8. LINE Bot 推播每日課表
9. 付費方案：個人跑者、教練管理多位跑者、跑團方案
