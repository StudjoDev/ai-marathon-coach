# AI 半馬教練

手機優先的 AI 馬拉松教練 MVP。第一版針對單一女跑者，使用靜態資料、簡單規則與瀏覽器本機疼痛紀錄，協助判斷本週是否該增加距離或維持恢復。

## 功能

- 今日：今日訓練建議、賽事倒數、本週課表調整、週五長跑提醒、跑後回饋
- 課表：6/14 到 6/20 一日一卡課表，含本週調整摘要
- 賽事：賽事時間軸、A/B/C 定位、報到與寄物提醒、詳情彈窗、賽前檢查清單
- 紀錄：最近三次訓練、距離趨勢、平均心率趨勢
- 疼痛：膝蓋與右大腿後側疼痛追蹤，資料存於瀏覽器本機
- 教練：靜態規則產生的每日教練建議與長跑升級判斷

## 本機啟動

```bash
npm install
npm run dev
```

開啟 Vite 顯示的本機網址即可使用。

## 建置

```bash
npm run test
npm run build
npm run preview
```

GitHub Pages base path 預覽：

```bash
npm run preview:pages
```

開啟：

```txt
http://127.0.0.1:4173/ai-marathon-coach/
```

## 部署到 GitHub Pages

專案已設定 GitHub Pages workflow：

- `vite.config.ts` 的 `base` 為 `/ai-marathon-coach/`
- push 到 `main` branch 後會自動執行 `npm ci` 與 `npm run qa`
- build 成功後會將 `dist` 部署到 GitHub Pages

若 GitHub repo 名稱不是 `ai-marathon-coach`，請同步調整 `vite.config.ts` 的 `base`。

部署前 QA checklist：

- `git status --short` 只包含預期變更
- 更新 `src/data/appMeta.ts` 的 `version` 與 `releaseNote`
- 執行 `npm ci`
- 執行 `npm run qa`
- 執行 `npm run preview:pages`，打開 `/ai-marathon-coach/`
- 手動檢查：今日、課表、疼痛、紀錄、賽事、教練六個 tab
- 手動檢查：賽事詳情彈窗、官方連結、疼痛紀錄新增/編輯/刪除、右上角版本號
- 瀏覽器 console 不應有錯誤

GitHub Pages cache 驗證：

- Repo Settings > Pages 的 Source 應為 `GitHub Actions`
- push 後等待 deploy job 成功
- 用帶版號 query 的網址檢查最新版：

```txt
https://studjodev.github.io/ai-marathon-coach/?v=v2026.06.15.7
```

- 右上角版本必須等於 `src/data/appMeta.ts`
- 若仍看到舊版，請用無痕視窗或 hard refresh；Vite 已處理 JS/CSS hash，主要要確認入口頁沒有載入舊快取

## 版本策略

- `package.json` 使用 SemVer，例如 `0.1.1`
- `src/data/appMeta.ts` 使用部署可見版號，例如 `v2026.06.15.7`
- 每次公開部署都更新 `appMeta.version` 與 `releaseNote`
- 只改資料或文案：patch
- 新增頁面或資料結構：minor
- 不相容本機儲存或資料格式變更：major

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

每一天都包含日期、標題、訓練目的、課表項目與注意事項。需要距離判斷的日子可加上 `distanceKm`、`fallbackDistanceKm`、`targetPace` 與 `successCriteria`。

`weeklyPlanAdjustment` 記錄本週調整原因與變更項目，目前內容為：

- 週二改為臀肌與穩定訓練
- 週三改為輕鬆跑 4K
- 週四取消輕鬆跑 5K，改為長跑前恢復日
- 週五改為長跑 8-9K
- 週六改為跑後恢復日

首頁與週課表會用瀏覽器本地日期判斷「今天」並 highlight 對應課表；本週資料仍維持 2026-06-14 到 2026-06-20 這一週。

## 疼痛紀錄規則

疼痛資料存在瀏覽器本機儲存：

```txt
ai-marathon-coach:painLogs
```

每筆紀錄包含日期、膝蓋疼痛 0-10、右大腿後側疼痛 0-10、疼痛位置、是否有刺痛或拉扯感、隔天上下樓梯是否正常與備註。

目前提醒規則：

- 任一紀錄膝蓋疼痛達 5/10 以上：本週不建議增加距離
- 連續 2 天膝蓋疼痛達 5/10 以上：建議暫停跑步，改恢復訓練
- 最新紀錄膝蓋疼痛達 4 分以上：本週不建議再跑步，週六請改恢復日
- 最新紀錄右大腿後側疼痛達 4 分以上：避免衝刺、深蹲與硬舉
- 膝蓋與右大腿後側都在 2 分以下，且樓梯正常、沒有刺痛或拉扯感：下週可考慮恢復 10-11K 長跑
- 疼痛超過 48 小時仍達 4 分以上：暫停跑步，改恢復訓練，必要時尋求專業評估

## 賽事模組

賽事資料集中在：

```txt
src/data/races.ts
```

新增一場賽事時，加入一筆 `Race` 物件即可。必要欄位包含賽事名稱、短名稱、日期、距離、地點、報到方式、報到提醒、集合時間、寄物資訊、開跑時間、限時、賽事定位、報名狀態、官方來源狀態、官方連結、目標、策略與賽前提醒。若資料仍需人工確認，欄位要明確寫「未確認」或「需人工覆核」，不要寫成已確認。

目前六場賽事都以使用者已報名處理，`registrationStatus` 使用 `registered`。`sourceStatus` 用來標示資料可信度：板橋、桃園落羽松、Garmin Run、TigerRun 由官方頁完整確認；SporTaiwan 由官方頁確認主要資訊，但寄物安排建議賽前再確認；永慶盃由路協賽事表確認日期、地點與 10.5K 組別，官方 PDF 連結已找到但內容仍需人工覆核。

連結欄位：

- `officialUrl`：官方公告或公開活動頁
- `signupUrl`：報名頁，沒有獨立報名頁時可省略
- `backupInfoUrl`：備用公開資訊來源，只有需要交叉確認時才填

賽事卡片應優先呈現行動資訊：報到方式、集合時間、寄物、開跑時間、限時與最重要的一則賽前提醒。完整來源備註與官方連結放在詳情彈窗。

賽事定位：

- A 賽：年度主要目標賽，訓練週期會以它為核心，需要賽前減量調整
- B 賽：重要測驗賽，用來驗證訓練成果，不一定全力
- C 賽：輔助賽、恢復賽或趣味賽，不影響主要訓練，不應該硬拼

目前賽事時間軸：

- 09/20 永慶盃 10.5K｜B 賽
- 11/08 板橋半馬 21K｜A 賽
- 11/22 桃園落羽松 11K｜C 賽｜半馬後恢復景觀跑
- 11/29 Garmin 5K｜C 賽
- 12/12 TigerRun 10K｜B 賽
- 12/13 SporTaiwan 10K｜C 賽

11 月賽事密集提醒：板橋半馬後 14 天就是桃園落羽松 11K，再 7 天是 Garmin 5K，不應連續拼成績。

賽事會影響訓練週期呈現。`TrainingPeriodization` 會把每場賽事放進基礎耐受期、半馬專項期、賽後恢復期與年末賽事期，讓跑者知道每場比賽的角色。

未來可擴充：

- 補給站資訊
- GPX 路線
- 賽後回顧

## MVP Roadmap

目前版本：

- 單一跑者
- 靜態資料
- 瀏覽器本機疼痛紀錄
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
