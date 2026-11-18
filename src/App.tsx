import { Arrow, Layout, Mark, ResumeLink } from './components/layout'
import { Constellation } from './components/constellation'
import { Photo, Picture, safeUrl, Video } from './components/media'
import { archivePath, entries, entryRoute, getRelated, isSection, pages, site, topics, type Entry, type Page, type Route, type Section } from './content'

const tones = ['blue', 'gold', 'purple'] as const
function Artwork({ entry, tone = 0 }: { entry: Entry; tone?: number }) {
  return entry.coverImage
    ? <div className="card-art"><Picture image={entry.coverImage} sizes="(max-width: 720px) 90vw, 410px"/></div>
    : <div className={'card-art abstract ' + tones[tone % tones.length]} aria-hidden="true">
        <svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 17 }, (_, i) => <path key={i}
            d={`M -20 ${135 + i * 6} C ${60 + i * 4} ${50 - i * 2}, ${154 + i * 7} ${260 - i * 11}, ${422 - i * 2} ${29 + i * 6}`}/>)}
        </svg>
      </div>
}
function categoryName(entry: Entry) {
  return entry.category ? topics(entry.type)[entry.category]?.[1] : undefined
}
function Card({ entry, index, heading: Title = 'h2' }: { entry: Entry; index: number; heading?: 'h2' | 'h3' }) {
  return <article className="entry-card">
    <a href={archivePath(entryRoute(entry))}>
      <Artwork entry={entry} tone={index}/>
      <div className="card-caption">
        <div className="entry-meta">{[entry.date ?? entry.year, categoryName(entry)].filter(Boolean).join(' / ')}</div>
        <Title>{entry.title}</Title>
        {entry.subtitle && <p lang="en">{entry.subtitle}</p>}
        <span className="card-arrow"><Arrow/></span>
      </div>
    </a>
  </article>
}
function Home() {
  const featured = entries.filter((entry) => entry.type === 'works' && entry.featured)
  const words = site.home.title.split(' ')
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="eyebrow-rule"/> 個人生命檔案 <span className="divider">/</span> <span lang="en">Artist Archive</span></p>
          <h1 id="hero-title" lang="en">{words[0]}<br/><em>{words.slice(1).join(' ')}</em></h1>
          <p className="hero-tagline">{site.home.tagline}</p>
          <p className="hero-intro">{site.home.intro}</p>
          <a className="hero-link" href={featured.length ? '#selected' : archivePath('/works/')}><span className="circle-arrow"><Arrow down/></span> 探索檔案</a>
        </div>
        <Constellation/>
      </div>
    </section>
    {!!featured.length && <section id="selected" className="featured wrap" aria-labelledby="selected-title">
      <header className="section-heading">
        <div><p className="eyebrow" lang="en">Selected Works</p><h2 id="selected-title">精選創作</h2></div>
        <a href={archivePath('/works/')} className="text-link">所有創作 <Arrow/></a>
      </header>
      <div className="card-grid">{featured.map((entry, index) => <Card key={entry.id} entry={entry} index={index} heading="h3"/>)}</div>
    </section>}
  </>
}
function Heading({ en, title, description }: { en: string; title: string; description?: string }) {
  return <header className="page-heading">
    <a className="back" href={archivePath('/')}>← 回到關係網絡</a>
    <p className="eyebrow" lang="en">{en}</p>
    <h1>{title}</h1>
    {description && <p className="lede">{description}</p>}
  </header>
}
function About() {
  return <div className="wrap inner-page">
    <Heading en="About" title={site.profile.name + ' / ' + site.profile.english} description={site.profile.intro}/>
    <div className="about-grid">
      <Photo image={site.profile.portrait} caption={site.profile.name + ' / ' + site.profile.english}/>
      <div className="prose">
        <h2>創作與生活</h2>
        <p>{site.profile.statement}</p>
        <h2>學習背景</h2>
        <ul>{site.profile.education.map((line) => <li key={line}>{line}</li>)}</ul>
        <p>專業經歷涵蓋場館前台、偏鄉藝術教育、舞團行政、劇場與影像製作。藝文工作之外，也從事過餐飲外場及居家清潔。</p>
        <ResumeLink/>
      </div>
    </div>
    <section className="timeline"><h2>生命時間軸</h2>
      <ol>{site.timeline.map(([year, description]) => <li key={year}><span>{year}</span><p>{description}</p></li>)}</ol>
    </section>
  </div>
}
function Contact() {
  return <div className="wrap inner-page">
    <Heading en="Contact" title="聯絡" description={pages.contact[2]}/>
    <section className="contact-panel">
      <div><p className="eyebrow">電子郵件</p><a className="email" href={'mailto:' + site.profile.email}>{site.profile.email} <Arrow/></a></div>
      <div><h2>合作方向</h2><ul>{site.profile.collaborations.map((label) => <li key={label}>{label}</li>)}</ul></div>
      {site.profile.socials.map((social: { label: string; url: string }) => {
        const url = safeUrl(social.url)
        return url && <a className="text-link" key={url.href} href={url.href}>{social.label} <Arrow/></a>
      })}
      <ResumeLink/>
    </section>
  </div>
}
function EntryRow({ entry }: { entry: Entry }) {
  return <li><a className="entry-row" href={archivePath(entryRoute(entry))}>
    <span className="entry-meta">{entry.date ?? entry.year ?? (entry.index ? '主題索引' : categoryName(entry))}</span>
    <span><strong>{entry.title}</strong>{entry.subtitle && <small lang="en">{entry.subtitle}</small>}</span>
    <Arrow/>
  </a></li>
}
function EntryList({ list }: { list: Entry[] }) {
  return list.length ? <ul className="entry-list">{list.map((entry) => <EntryRow key={entry.id} entry={entry}/>)}</ul>
    : <p className="empty">這個主題的內容待補。</p>
}
function Collection({ section, filter }: { section: Section; filter?: string }) {
  const [en, zh, description] = pages[section]
  const list = entries.filter((entry) => entry.type === section && (!filter || entry.category === filter))
  const filters = Object.entries(topics(section))
  const active = filter ? topics(section)[filter] : undefined
  return <div className="wrap inner-page">
    <Heading en={active?.[0] ?? en} title={active?.[1] ?? zh} description={description}/>
    {!!filters.length && <nav aria-label={zh + '分類'} className="filters">
      <a href={archivePath('/' + section + '/')} aria-current={!filter ? 'page' : undefined}>全部</a>
      {filters.map(([id, [label, name]]) => <a title={label} key={id} href={archivePath('/' + section + '/' + id + '/')}
        aria-current={id === filter ? 'page' : undefined}>{name}</a>)}
    </nav>}
    {section === 'works' && list.length ? <div className="card-grid">{list.map((entry, index) => <Card key={entry.id} entry={entry} index={index}/>)}</div> :
      section === 'body' && !filter ? <div className="body-groups">
        {filters.map(([key, [label, name]]) => <section key={key}><p className="eyebrow" lang="en">{label}</p><h2>{name}</h2><EntryList list={list.filter((entry) => entry.category === key)}/></section>)}
      </div> : <EntryList list={list}/>}
  </div>
}
function Training() {
  return <section className="training">
    <h2>培訓紀錄</h2>
    <p>履歷目前載列課程資訊。結訓與正式證照狀態待確認。</p>
    <ol>{site.training.map(([date, title, place, state]) =>
      <li key={date}><span>{date}</span><div><strong lang="en">{title}</strong><p>{place} · {state}</p></div></li>)}</ol>
  </section>
}
const missingText = {
  works: '作品介紹、個人觀察與影像資料待補。',
  body: '練習及觀察筆記待補。',
  journeys: '詳細日期、路線、影像日誌與旅程手記待補。',
  journal: '此主題的文章與影像待補。',
}
function Detail({ entry }: { entry: Entry }) {
  const [en, zh] = pages[entry.type]
  const related = getRelated(entry)
  const metadata = [['日期', entry.date ?? entry.year], ['類型', categoryName(entry)], ['角色', entry.role], ['合作團隊', entry.team], ['演出／展出', entry.venue], ['地點', entry.place]]
  const routeUrl = safeUrl(entry.routeUrl)
  return <article className="wrap inner-page detail-page">
    <header className="page-heading">
      <a className="back" href={archivePath('/' + entry.type + '/')}>← 回到{zh}</a>
      <p className="eyebrow" lang="en">{en}{entry.index ? ' / 主題索引' : ''}</p>
      <h1>{entry.title}</h1>
      {entry.subtitle && <p className="entry-subtitle" lang="en">{entry.subtitle}</p>}
      {entry.excerpt && <p className="lede">{entry.excerpt}</p>}
    </header>
    {entry.coverImage && <div className="detail-cover"><Photo image={entry.coverImage}/></div>}
    <div className="prose">
      {metadata.some(([, value]) => value) && <dl className="metadata">
        {metadata.map(([key, value]) => value && <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}
      </dl>}
      {entry.body?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      {entry.id === 'gyrokinesis' && <Training/>}
      {entry.observation && <section><h2>參與觀察</h2><p>{entry.observation}</p></section>}
      {routeUrl && <a className="text-link" href={routeUrl.href}>查看旅程路線 <Arrow/></a>}
      {!!entry.tags?.length && <ul className="tags" aria-label="標籤">{entry.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
      {!entry.body?.length && !entry.observation && entry.id !== 'gyrokinesis' && <p className="empty">{missingText[entry.type]}</p>}
    </div>
    {!!entry.gallery?.length && <section className="detail-gallery"><h2>影像紀錄</h2><div>{entry.gallery.map((image, index) => <Photo key={image.src + ':' + index} image={image}/>)}</div></section>}
    {!!entry.videoUrls?.length && <section className="prose"><h2>影片</h2>{entry.videoUrls.map((url, i) => <Video key={url} value={url} title={entry.title + ' · 影片 ' + (i + 1)}/>)}</section>}
    {!!entry.externalLinks?.length && <ul className="prose">{entry.externalLinks.map((link) => {
      const url = safeUrl(link.url)
      return url && <li key={url.href}><a href={url.href}>{link.label} <Arrow/></a></li>
    })}</ul>}
    {!!related.length && <section className="related"><h2>相關檔案</h2><EntryList list={related}/></section>}
  </article>
}
function Missing() {
  return <div className="wrap inner-page missing"><Mark/><Heading en="404" title="找不到頁面" description="這個網址可能已移動。可從關係網絡或上方導覽繼續探索。"/></div>
}

export default function App({ route }: { route: Route }) {
  let current: Page | undefined
  let page
  if (route.kind === 'home') page = <Home/>
  if (route.kind === 'missing') page = <Missing/>
  if (route.kind === 'entry') {
    current = route.entry.type
    page = <Detail entry={route.entry}/>
  }
  if (route.kind === 'page') {
    current = route.page
    if (current === 'about') page = <About/>
    if (current === 'contact') page = <Contact/>
    if (isSection(current)) page = <Collection section={current} filter={route.filter}/>
  }
  return <Layout current={current}>{page}</Layout>
}
