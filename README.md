# 6UU — A Living Archive

**Moving Through Life｜在移動之間，練習生活。**

劉穎蓉 / Augusta 的生命檔案與藝術作品集。首頁以 SVG 曲線連接七個探索節點，內頁以繁體中文為主。React、TypeScript 與 Vite 在建置時產生每一個可直接造訪的 HTML 頁面。

## 在本機開啟

先安裝 Node.js 24 LTS 和 pnpm 11.25.0。在此目錄開啟終端機，再執行：

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

用瀏覽器開啟終端機印出的網址，預設為 `http://127.0.0.1:5173/`。按 Ctrl+C 停止服務。

## 檢查正式版

```sh
pnpm run check
pnpm run build
pnpm run preview
```

開啟終端機顯示的預覽網址，直接造訪 `/works/eight-counts/` 並重新整理。正式輸出在 `dist/`。

## 維護

- [Pages CMS 後臺使用指南](CMS_USER_GUIDE.md) 說明如何連接 GitHub，並透過瀏覽器編輯文字、照片與影片。
- [內容更新指南](CONTENT_GUIDE.md) 說明如何新增作品、文章、照片與關聯。
- [設計系統](DESIGN_SYSTEM.md) 說明節點樣式、色彩、版面與動畫。
- [部署指南](DEPLOYMENT_GUIDE.md) 說明如何啟用免費 GitHub Pages，以及如何檢查更新。

內容位於 `src/content/`。首頁文字、節點與個人資料位於 `src/data/`。圖片放在 `public/images/`。網站以本地檔案與瀏覽器功能運作，已確認的影片可用外部嵌入。
