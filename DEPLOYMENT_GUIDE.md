# GitHub Pages 部署與更新

## 本機使用

安裝 Node.js 24 LTS 及 pnpm 11.25.0，將終端機切到此專案資料夾。

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

開啟終端機印出的網址。要檢查正式版，先停止開發服務，再執行：

```sh
pnpm run build
pnpm run preview
```

正式版每個路由都有 HTML 檔，直接貼上深層網址或重新整理都可以讀到內容。部署時 GitHub Actions 會自動帶入 GitHub Pages 的子路徑，保留頁面的媒體、素材、導航與 canonical 網址。

## 確認視覺後首次部署

1. 在 GitHub 建立空白的公開儲存庫。GitHub Free 可為公開儲存庫啟用 Pages。
2. 把專案原始碼提交並推送到儲存庫的 `main` 分支，包含 `.github/workflows/pages.yml` 與 `pnpm-lock.yaml`。
3. 打開該儲存庫的 **Settings → Pages**。在 **Build and deployment → Source** 選擇 **GitHub Actions**。
4. 從 **Actions** 開啟 **Deploy 6UU Archive to GitHub Pages**，點選 **Run workflow**，使用 `main` 執行。
5. 完成後，從 **Settings → Pages** 開啟網站。用手機檢查首頁，另直接在網址列開啟 `works/eight-counts/` 並重新整理。對專案網站，請保留網域後的儲存庫名稱。

如果專案尚未使用 Git，可以在此資料夾執行以下命令完成第 2 步。將 `USERNAME` 與 `REPOSITORY` 換成 GitHub 帳號及儲存庫名稱。

```sh
git init -b main
git add .
git commit -m "Create 6UU Living Archive"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

[GitHub Pages 自訂工作流程文件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 更新與排查

- 先在本機依照[內容更新指南](CONTENT_GUIDE.md)修改資料，確認版面與建置。推送至 `main` 後，Actions 會自動發布更新。
- 如果 Actions 失敗，展開失敗步驟找第一個錯誤。資料校驗會指出重複網址、未知關聯與錯誤分類。若顯示 Pages 未啟用，檢查 **Settings → Pages** 的來源。
- 如果樣式或深層網址在部署後失效，檢查 Actions 產生的子路徑及網站網址。靜態頁透過目錄下的 `index.html` 提供內容，網址末尾使用斜線。
- 建置會產生 `sitemap.xml`、`robots.txt`、各頁 canonical 與分享資訊。部署後可從網站根目錄開啟 sitemap。
