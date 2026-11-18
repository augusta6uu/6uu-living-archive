# 6UU 網站後臺使用指南

Pages CMS 是 6UU 的瀏覽器編輯介面。首次連線完成後，日常編輯可以在後臺完成。

## 第一次啟用

1. 請由網站擁有者建立或選定 GitHub 儲存庫，並將這次的專案檔案放到 `main` 分支。儲存庫首頁應看得到 `src`、`public`、`package.json`、`.pages.yml` 與 `.github/workflows/pages.yml`。如果 GitHub 上還沒有任何檔案，可以使用 **Add file → Upload files**。拖入專案裡的檔案和資料夾，保留結構，確認 `.pages.yml` 在最外層。舊版備份 ZIP、`node_modules`、`.pnpm-store`、`.ssg`、`dist` 可留在本機。
2. 若要公開網站，在儲存庫的 **Settings → Pages** 找到 **Build and deployment → Source**，選 **GitHub Actions**。按 **Actions → Deploy 6UU Archive to GitHub Pages → Run workflow**，選 `main` 執行首次發布。完成後 **Settings → Pages** 會顯示公開網址。GitHub Free 的 Pages 適用於公開儲存庫，請在上傳前確認檔案都適合公開。 [GitHub Pages 設定說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
3. 開啟 [Pages CMS](https://app.pagescms.org/)，使用 GitHub 帳號登入。依畫面安裝 Pages CMS GitHub App。選擇網站儲存庫所在的帳號或組織，於 **Only select repositories** 選中 6UU 的儲存庫。
4. 回到 Pages CMS，開啟 6UU 的儲存庫與 `main` 分支。如果畫面要求建立設定檔，先回 GitHub 確認 `.pages.yml` 已上傳到該分支的最外層。左側應有「首頁與個人介紹」、「創作作品」、「身體實踐」、「旅行紀事」、「生活手記」與「照片管理」。 [Pages CMS 首次啟用說明](https://pagescms.org/docs/quick-start/)

## 修改首頁文字

1. 左側選「首頁與個人介紹」，展開「首頁文字」。
2. 分別修改大標題、副標題、首頁介紹或節點探索提示。個人介紹、肖像和聯絡資訊在同頁的「個人介紹與聯絡」。
3. 按 **Save**。首頁設定儲存後即會進入發布流程。

## 新增一件作品或手記

1. 左側選「創作作品」，按清單底部的新增按鈕。編輯既有作品時，展開原來的那筆。手記可在「生活手記」用同樣方式新增。
2. 輸入標題以及全站未使用過的「網址短名」，例如 `spring-rehearsal`。短名只用小寫英文、數字及連字號。已公開的作品請保留原短名，這樣舊連結仍可開啟。舊資料若顯示「內容代號」，它會隨資料保留。
3. 選擇內容類型，填入確定的日期、摘要及個人角色。「內文段落」可逐段新增與排序。未填的選填欄位會省略。創作作品勾選「首頁精選」並公開後，會出現在首頁。
4. 要建立關聯，在「相關內容代號」逐個加入對方的「內容代號（舊資料）」。若對方的代號欄位是空的，就填它的網址短名。雙方都公開後，兩頁都會顯示關聯。
5. 選「草稿」或「公開」，再按 **Save**。

## 上傳及更換照片

1. 展開作品的「封面照片」，按照片欄位開啟選擇器。可以選既有照片或按上傳，從電腦選擇 JPG、PNG、WebP 等圖片。也可以先到左側「照片管理」上傳。
2. 選好後填「替代文字」，用一句話描述畫面。可加上「圖片說明」及「攝影者」，兩者會顯示在詳細頁。若更換照片，記得更新這些欄位。寬高是選填，若原欄位留有舊照片尺寸，可改成新尺寸或清空。
3. 要上傳多張，在「照片集」按新增，每一列選一張照片。用列旁的拖曳把手重新排序。
4. 按 **Save**。上傳檔案和儲存作品可能是兩次提交，最後一次成功部署後，再查看正式頁面。

## 加入 YouTube 或 Vimeo 影片

1. 在影片原頁按「分享」，複製 https 網址。
2. 在作品或手記的「YouTube／Vimeo 影片網址」按新增，每列貼一支影片的網址。
3. 儲存並發布後，從網站的詳細頁展開影片標題。若影片擁有者限制嵌入，可用「前往原始影片」開啟。

## 儲存、發布和預覽

- **草稿**會儲存到 GitHub，但不會出現在網站、作品清單或站點地圖。若儲存庫是公開的，原始資料與上傳照片仍可被查看。請把私人素材留在本機。
- **公開**項目儲存到 `main` 後，GitHub Actions 會建置網站。到儲存庫的 **Actions** 查看最新的 **Deploy 6UU Archive to GitHub Pages**。看到綠色勾號後，從 **Settings → Pages** 開啟或重新整理公開網站。
- 已發布項目每次儲存都可能更新公開頁面。若想練習編輯既有作品，首次可先在 GitHub 從 `main` 建立測試分支，再在 Pages CMS 切到該分支練習。正式發布流程監聽 `main`。
- 若 Actions 顯示失敗，展開失敗的步驟。網址短名重複或相關代號填錯時，修正欄位並再按 **Save**。

## 還原錯誤修改

- **還沒按 Save** 時，離開畫面並放棄修改。
- **已儲存且改動很少** 時，回到 Pages CMS 把內容改回來，再按 **Save**。
- **整筆內容需要復原** 時，在 GitHub 打開受影響的檔案並按 **History**。選擇改動前的版本，開啟該版本的原始檔並下載。保留原檔名，切回 `main` 的同一資料夾，用 **Add file → Upload files** 將舊檔上傳到相同位置並提交。此方式會還原整份清單，若同檔案已有其他新的編輯，先確認是否也需要保留。提交後到 **Actions** 確認重新部署。
