import works from './content/works/records.json'
import body from './content/body/records.json'
import journeys from './content/journeys/records.json'
import journal from './content/journal/records.json'
import siteData from './data/site.json'
import nodes from './data/nodes.json'

export type Section = 'works' | 'body' | 'journeys' | 'journal'
export type Media = {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
  credit?: string
  variants?: { src: string; width: number }[]
}
export interface Entry {
  id: string
  slug: string
  title: string
  subtitle?: string
  type: Section
  category?: string
  date?: string
  year?: string
  excerpt: string
  body: string[]
  tags: string[]
  coverImage?: Media
  gallery: Media[]
  videoUrls: string[]
  relatedIds: string[]
  status: 'draft' | 'published'
  featured: boolean
  updatedAt?: string
  role?: string
  team?: string
  venue?: string
  place?: string
  routeUrl?: string
  observation?: string
  externalLinks?: { label: string; url: string }[]
  index?: boolean
}
type OptionalOnSave = 'id' | 'excerpt' | 'body' | 'tags' | 'gallery' | 'videoUrls' | 'relatedIds'
type StoredEntry = Omit<Entry, OptionalOnSave> & Partial<Pick<Entry, OptionalOnSave>>

// Pages CMS omits empty strings and empty lists from saved JSON.
function normalizeRecords(rows: StoredEntry[]): Entry[] {
  return rows.map((entry) => ({
    ...entry,
    id: entry.id || entry.slug,
    excerpt: entry.excerpt ?? '',
    body: entry.body ?? [],
    tags: entry.tags ?? [],
    gallery: entry.gallery ?? [],
    videoUrls: entry.videoUrls ?? [],
    relatedIds: entry.relatedIds ?? [],
  }))
}

const records = {
  works: normalizeRecords(works as StoredEntry[]),
  body: normalizeRecords(body as StoredEntry[]),
  journeys: normalizeRecords(journeys as StoredEntry[]),
  journal: normalizeRecords(journal as StoredEntry[]),
}
const socials = (siteData.profile as { socials?: { label: string; url: string }[] }).socials ?? []
const site = { ...siteData, profile: { ...siteData.profile, socials } }
export const sections = Object.keys(records) as Section[]
export const entries = Object.values(records).flat()
  .filter((entry) => entry.status === 'published')
  .sort((a, b) => (b.date ?? b.year ?? '').localeCompare(a.date ?? a.year ?? ''))
export const entryRoute = (entry: Entry) => '/' + entry.type + '/' + entry.slug + '/'
export const archivePath = (path: string) => import.meta.env.BASE_URL + path.replace(/^\/+/, '')
export const getRelated = (entry: Entry) => entries.filter((other) =>
  entry.relatedIds.includes(other.id) || other.relatedIds.includes(entry.id))

export const categories = {
  works: { performance: ['Performance', '表演'], interdisciplinary: ['Interdisciplinary', '跨域創作'], film: ['Film & Documentary', '影像紀錄'], production: ['Production', '製作與協作'] },
  body: { practice: ['Practice', '身體實踐'], teaching: ['Teaching', '教學'], research: ['Research', '研究'] },
  journeys: {},
  journal: { everyday: ['Everyday Life', '日常'], labor: ['Home & Labor', '家與勞動'], home: ['Returning Home', '返鄉'], photography: ['Photography', '攝影'], 'body-notes': ['Body Notes', '身體筆記'], reflection: ['Reflection', '觀察與思考'] },
} satisfies Record<Section, Record<string, string[]>>
export const topics = (section: Section): Record<string, string[]> => categories[section]
export const pages = {
  about: ['About', '關於', '從劇場、身體教學到勞動與移動，沿著生命時間軸認識劉穎蓉 / Augusta。'],
  works: ['Works', '創作', '劇場演出、跨域創作、紀錄影像與幕後協作。'],
  body: ['Body', '身體', '從動作、感知與呼吸出發，記錄身體實踐、教學及研究。'],
  journeys: ['Journeys', '旅程', '在不同地方生活、工作、行走。'],
  journal: ['Journal', '手記', '從家事勞動、攝影與返鄉生活，記下日常的觀察。'],
  contact: ['Contact', '聯絡', '表演、身體教學或影像計畫，歡迎來信。'],
}
export type Page = keyof typeof pages
export type Route = { kind: 'home' | 'missing' } | { kind: 'page'; page: Page; filter?: string } | { kind: 'entry'; entry: Entry }
const pageKeys = Object.keys(pages) as Page[]
export const isSection = (page: string): page is Section => sections.some((section) => section === page)
export function resolveRoute(path: string): Route {
  const parts = path.split('/').filter(Boolean)
  if (!parts.length) return { kind: 'home' }
  const [page, slug] = parts
  if (parts.length === 1 && pageKeys.some((key) => key === page)) return { kind: 'page', page: page as Page }
  if (parts.length === 2 && isSection(page)) {
    if (Object.hasOwn(topics(page), slug)) return { kind: 'page', page, filter: slug }
    const entry = entries.find((item) => item.type === page && item.slug === slug)
    if (entry) return { kind: 'entry', entry }
  }
  return { kind: 'missing' }
}

export const routes = [
  '/',
  ...pageKeys.map((page) => '/' + page + '/'),
  ...sections.flatMap((section) => Object.keys(topics(section)).map((key) => '/' + section + '/' + key + '/')),
  ...entries.map(entryRoute),
]

export function assertContent() {
  const ids = new Set<string>()
  const paths = new Set<string>()
  for (const section of sections) {
    for (const entry of records[section]) {
      const path = entryRoute(entry)
      if (!entry.id || ids.has(entry.id)) throw new Error('重複或空白的 id：' + entry.id)
      if (entry.type !== section || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) ||
          paths.has(path) || Object.hasOwn(topics(section), entry.slug)) {
        throw new Error('無效或重複的網址：' + path)
      }
      if (!entry.title.trim() || !['draft', 'published'].includes(entry.status)) throw new Error('請檢查標題與狀態：' + entry.id)
      if (entry.category && !Object.hasOwn(topics(section), entry.category)) throw new Error('未知分類：' + entry.category)
      ids.add(entry.id)
      paths.add(path)
    }
  }
  const allNodeIds = new Set(nodes.map((node) => node.id))
  if (allNodeIds.size !== nodes.length) throw new Error('節點 id 重複')
  for (const node of nodes) {
    if (!routes.includes(node.targetUrl) || node.relatedNodeIds.some((id) => !allNodeIds.has(id))) {
      throw new Error('節點網址或關聯無效：' + node.id)
    }
  }
  for (const entry of Object.values(records).flat()) {
    if (entry.relatedIds.some((id) => id === entry.id || !ids.has(id))) throw new Error('未知或無效的關聯：' + entry.id)
  }
}

export function pageMeta(route: Route) {
  const home = { title: '6UU — ' + site.home.title, description: site.home.intro, image: site.profile.portrait.src }
  if (route.kind === 'home') return home
  if (route.kind === 'missing') return { title: '找不到頁面 · 6UU', description: site.home.tagline }
  if (route.kind === 'entry') {
    const { entry } = route
    return { title: entry.title + ' · 6UU', description: entry.excerpt || [entry.title, entry.date ?? entry.year, entry.team, entry.role].filter(Boolean).join(' · '), image: entry.coverImage?.src }
  }
  if (route.kind === 'page') {
    const [label, zh, description] = pages[route.page]
    const filter = route.filter && isSection(route.page) ? topics(route.page)[route.filter][1] + ' · ' : ''
    return { title: filter + zh + ' ' + label + ' · 6UU', description, image: route.page === 'about' ? site.profile.portrait.src : undefined }
  }
  return home
}
export { site, nodes }
