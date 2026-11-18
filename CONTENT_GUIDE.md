# 內容更新指南

## 一次修改的流程

1. 在專案資料夾開終端機，執行 `pnpm run dev`，打開終端機顯示的本機網址。第一次使用時先依照 [README](README.md) 安裝依賴。
2. 用文字編輯器開啟 `src/content/` 中對應分類的 `records.json`。修改舊資料時可用標題搜尋，新增時可複製下方範本。外層方括號內，每兩筆之間放一個逗號，最後一筆後面省略逗號。
3. 編輯期間保留 `"status": "draft"`。準備檢查頁面時改成 `"published"`、儲存，並在本機重新整理分類或直接開啟該筆網址。檢查標題、正文、照片與相關連結。
4. 執行 `pnpm run build` 確認正式建置。還在整理的草稿可改回 `draft`。正式網站更新請依照 [部署指南](DEPLOYMENT_GUIDE.md)。

## 新增一件作品

將下面這筆資料加到 `src/content/works/records.json` 的陣列。這是空白示範。填入確認過的事實後，將 `status` 改為 `published`，即可在 `/works/my-work/` 查看。可補上 `subtitle`、`role`、`team`、`venue`、`observation` 與 `externalLinks`。

```json
{
  "id": "my-work",
  "slug": "my-work",
  "title": "填入作品名稱",
  "type": "works",
  "category": "performance",
  "excerpt": "",
  "body": [],
  "tags": [],
  "gallery": [],
  "videoUrls": [],
  "relatedIds": [],
  "status": "draft",
  "featured": false
}
```

作品分類值為 `performance`、`interdisciplinary`、`film` 或 `production`。把已發布作品的 `featured` 改為 `true`，即可顯示於首頁精選。

## 新增一篇手記

將以下示範加到 `src/content/journal/records.json`，填妥內容後改為 `published`。發布後網址為 `/journal/my-note/`。每個 `body` 字串是一段內文。日期可用 `YYYY-MM-DD`，只知道年份時可填 `year`。未確認的日期可以留空，`updatedAt` 可記錄最後更新日。

```json
{
  "id": "my-note",
  "slug": "my-note",
  "title": "填入手記標題",
  "type": "journal",
  "category": "everyday",
  "excerpt": "填入摘要",
  "body": ["填入第一段", "填入第二段"],
  "tags": ["日常", "攝影"],
  "gallery": [],
  "videoUrls": [],
  "relatedIds": ["returning-home"],
  "status": "draft",
  "featured": false
}
```

手記分類值為 `everyday`、`labor`、`home`、`photography`、`body-notes`、`reflection`。標籤可複選。現有的主題索引使用 `index: true`，可透過關聯連到正式文章。每筆的 `id` 全站都要唯一，`slug` 在同一分類下要唯一並使用小寫英文字母、數字及連字號。發布後保留原本的 `slug`，以維持既有連結。

## 新增旅程與身體檔案

複製同分類既有紀錄再改寫。旅程的 `type` 是 `journeys`。可填寫 `subtitle`、`date`、`place`、`routeUrl`、`excerpt`、`body`，再把影像日誌放進 `gallery`，及用 `relatedIds` 連到手記和作品。身體檔案的 `type` 是 `body`，分類值為 `practice`、`teaching`、`research`。

## 相片、影片與連結

- 將相片放進 `public/images/`。例如將 `my-photo.webp` 加入作品的相片集時，把範本的 `"gallery": []` 換成下面的資料。將替代文字和尺寸改成實際資訊。要設為封面時，將同樣的影像物件放在 `coverImage` 欄位。
- 有不同尺寸時，在影像物件加入 `"variants":[{"src":"images/my-photo-600.webp","width":600},{"src":"images/my-photo.webp","width":1200}]`。請填入真實像素資訊。
- 在 YouTube 或 Vimeo 的影片頁按「分享」，把複製的完整網址貼在 `videoUrls` 的方括號裡，每個網址加雙引號。儲存後從作品或手記頁展開影片標題，確認播放器與「前往原始影片」都指向該影片。播放器能否播放取決於影片擁有者的嵌入設定。
- 使用 `externalLinks` 加入相關外部資源，例如 `[{"label":"節目頁","url":"https://example.org/program"}]`。用 `relatedIds` 放入另一筆資料的 `id`，兩頁都會顯示相互連結。

```json
"gallery": [
  {
    "src": "images/my-photo.webp",
    "alt": "填寫畫面中可見的內容",
    "width": 1200,
    "height": 800
  }
]
```

## 草稿、首頁與履歷

- 將 `status` 設為 `draft` 可隱藏頁面、列表、精選及 sitemap 項目。公開 GitHub 儲存庫仍會顯示原始 JSON，私密草稿請先在本機保管。
- 在 `src/data/site.json` 的 `home` 修改首頁標題、副標、介紹與探索提示。標題會在第一個英文單字後換行。
- `profile` 控制肖像、聯絡與合作資訊，`socials` 可用 `{"label":"Instagram","url":"https://www.instagram.com/已確認帳號/"}` 格式加入。
- 完整履歷與培訓資格統一在 `src/data/cv.json`，也可用 Pages CMS 的「完整經歷履歷 CV」編輯。既有作品與教學可用 `recordId` 引用。培訓狀態依事實選擇，操作方式見 [後臺使用指南](CMS_USER_GUIDE.md)。
- HTML 履歷會在正式建置時重產。只需更新本機履歷頁時，可執行 `pnpm run cv`。
