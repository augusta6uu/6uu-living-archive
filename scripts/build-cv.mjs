import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

const read = async (path) => JSON.parse(await readFile(new URL('../' + path, import.meta.url), 'utf8'))
const [site, works, body] = await Promise.all([
  read('src/data/site.json'),
  read('src/content/works/records.json'),
  read('src/content/body/records.json'),
])
const escape = (value) => value.replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const line = (entry) => [entry.date ?? entry.year, entry.venue, entry.team, '《' + entry.title + '》', entry.role, entry.excerpt]
  .filter(Boolean).join(' · ')
const list = (title, items) => '<section><h2>' + escape(title) + '</h2><ul>' +
  items.map((item) => '<li>' + escape(item) + '</li>').join('\n') + '</ul></section>'
const sort = (entries) => [...entries].sort((a, b) => (b.date ?? b.year ?? '').localeCompare(a.date ?? a.year ?? ''))
const archiveWorks = sort(works.filter((entry) => entry.status === 'published'))
const data = [
  ['學歷', site.profile.education],
  ['劇場演出及跨域創作', archiveWorks.filter((entry) => entry.category !== 'film').map(line)],
  ['教育及培訓', [...body.filter((entry) => entry.status === 'published' && entry.category === 'teaching').map(line), ...site.cvOther['教育及培訓']].sort().reverse()],
  ['影視經歷', [...archiveWorks.filter((entry) => entry.category === 'film').map(line), ...site.cvOther['影視其他經歷']].sort().reverse()],
  ['嬋柔相關培訓', site.training.map((row) => row.join(' · '))],
  ['其他工作經驗', site.cvOther['其他工作經驗']],
]
const output = 'public/' + site.profile.cv
await mkdir(dirname(output), { recursive: true })
await writeFile(output, `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escape(site.profile.name)} / ${escape(site.profile.english)} — 專業履歷</title>
<style>
body { margin: 56px auto; width: min(calc(100% - 44px), 790px); color: #303837; font: 16px/1.65 system-ui, sans-serif; }
h1 { margin-bottom: 0; line-height: 1.3; }
h2 { font-size: 1.18em; margin: 28px 0 12px; border-bottom: 1px solid #c7cfc8; }
ul { padding-inline-start: 1.2em; }
li { margin-block: .4em; break-inside: avoid; }
@media print { body { width: auto; margin: 0; font-size: 10.5pt; } h2 { break-after: avoid; } }
</style>
</head>
<body>
<header><h1>${escape(site.profile.name)} / ${escape(site.profile.english)}</h1><p>專業履歷 · <a href="mailto:${escape(site.profile.email)}">${escape(site.profile.email)}</a></p></header>
<main>${data.map(([title, items]) => list(title, items)).join('\n')}</main>
</body>
</html>\n`)
