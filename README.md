# 賽事備忘

手機優先的賽事備忘 App：快速看到報名了哪些賽事、下一場什麼時候、要注意什麼，賽後記錄成績與心得。資料可同步到 Supabase，兩支手機即時共用。

## 功能

- 賽事列表：今天或下一場的距離、起跑、集合、限時；本季場次與已完賽距離；即將到來與已完成的賽事
- 賽事備忘：報到方式、地點導航、注意事項、賽前清單、我的備忘
- 完賽紀錄：完賽時間、完賽／未完賽／沒出賽、心得
- 新增、編輯、刪除賽事
- 後台同步：任何人打開網址都能直接瀏覽；登入後才能編輯，修改會即時同步到其他裝置

沒有設定 Supabase 時會以「本機模式」執行，資料只存在這台裝置的瀏覽器。

## 本機啟動

```bash
npm install
npm run dev
```

## 設定 Supabase 後台

1. 到 [supabase.com](https://supabase.com) 建立專案。
2. 在 SQL Editor 貼上 [`supabase/schema.sql`](supabase/schema.sql) 整份執行，會建立 `races`、`race_entries` 兩張表、登入權限與即時同步。
3. Authentication → Sign In / Providers：保留 Email，關閉「Allow new users to sign up」。
4. Authentication → Users → Add user：建立兩人的帳號（Email + 密碼）。
5. 複製 `.env.example` 為 `.env.local`，填入 Project Settings → API 的 Project URL 與 anon public key。
6. `npm run dev`，登入後第一次載入時，會自動把 `src/data/races.ts` 的內建賽事匯入後台。

anon key 是公開金鑰，資料安全由資料表的 Row Level Security 保護：任何人都能讀取（網站公開瀏覽），只有登入的帳號能新增、修改、刪除。

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

開啟 `http://127.0.0.1:4173/ai-marathon-coach/`。

## 部署到 GitHub Pages

- `vite.config.ts` 的 `base` 為 `/ai-marathon-coach/`
- push 到 `main` 後自動執行 `npm ci` 與 `npm run qa`，成功後部署 `dist`
- 在 GitHub repo → Settings → Secrets and variables → Actions → Variables 新增 `VITE_SUPABASE_URL` 與 `VITE_SUPABASE_ANON_KEY`，部署版才會連到後台；沒設定則部署為本機模式
