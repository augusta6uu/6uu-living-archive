import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'
import { archivePath, assertContent, pageMeta, resolveRoute, routes, site } from './content'

const dist = 'dist'
const template = await readFile(join(dist, 'index.html'), 'utf8')
const siteUrl = process.env.ARCHIVE_SITE_URL?.replace(/\/$/, '')
const absolute = (path: string) => siteUrl + '/' + path.replace(/^\/+/, '')
const escape = (value: string) => value.replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char] ?? char)

assertContent()
for (const path of [...routes, '/404.html']) {
  const route = resolveRoute(path)
  const { title, description, image } = pageMeta(route)
  const canonical = siteUrl && route.kind !== 'missing' ? absolute(path) : undefined
  const ogImage = image ?? site.profile.portrait.src
  const meta = [
    `<meta name="description" content="${escape(description)}">`,
    `<meta property="og:site_name" content="6UU — A Living Archive">`,
    `<meta property="og:title" content="${escape(title)}">`,
    `<meta property="og:description" content="${escape(description)}">`,
    `<meta property="og:type" content="${route.kind === 'entry' ? 'article' : 'website'}">`,
    `<meta property="og:locale" content="zh_TW">`,
    `<meta property="og:image" content="${escape(siteUrl ? absolute(ogImage) : archivePath(ogImage))}">`,
    canonical ? `<link rel="canonical" href="${escape(canonical)}"><meta property="og:url" content="${escape(canonical)}">` : '',
    route.kind === 'missing' ? '<meta name="robots" content="noindex">' : '',
  ].join('\n    ')
  const markup = template.replace(/<title>.*?<\/title>/, () => '<title>' + escape(title) + '</title>')
    .replace('<!--archive-meta-->', () => meta)
    .replace('<!--archive-html-->', () => renderToStaticMarkup(<App route={route}/>))
  const output = path === '/404.html' ? join(dist, '404.html') : join(dist, path.slice(1), 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, markup)
}

await writeFile(join(dist, '.nojekyll'), '')
const locations = routes.map((path) => '<url><loc>' + escape(siteUrl ? absolute(path) : archivePath(path)) + '</loc></url>')
await writeFile(join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + locations.join('\n') + '\n</urlset>\n')
await writeFile(join(dist, 'robots.txt'), 'User-agent: *\nAllow: /\n' + (siteUrl ? 'Sitemap: ' + absolute('/sitemap.xml') + '\n' : ''))
console.log('靜態頁面：' + routes.length + ' 頁，另含 404、sitemap 與 robots.txt。')
