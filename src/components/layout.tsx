import type { ReactNode } from 'react'
import { archivePath, pages, site, type Page } from '../content'

export function Mark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
    <path d="M5 24 17 6 31 21 20 31 5 24 31 21M17 6l3 25" fill="none" stroke="currentColor" strokeWidth=".85"/>
    <g fill="currentColor"><circle cx="5" cy="24" r="2.2"/><circle cx="17" cy="6" r="3"/><circle cx="31" cy="21" r="2.4"/><circle cx="20" cy="31" r="1.85"/></g>
  </svg>
}
export function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true">{down ? '↓' : '↗'}</span>
}
function Brand() {
  return <a href={archivePath('/')} className="brand" aria-label="6UU 首頁"><Mark/><strong>6UU</strong><span>A Living Archive</span></a>
}
function NavLinks({ current }: { current?: Page }) {
  return Object.entries(pages).map(([id, [label, zh]]) =>
    <a key={id} href={archivePath('/' + id + '/')} aria-current={current === id ? 'location' : undefined}>
      <span lang="en">{label}</span><span className="nav-zh">{zh}</span>
    </a>)
}
export function Layout({ children, current }: { children: ReactNode; current?: Page }) {
  return <>
    <a className="skip" href="#main">跳至主要內容</a>
    <header className="site-header">
      <div className="header-inner">
        <Brand/>
        <nav aria-label="主要導覽" className="desktop-nav"><NavLinks current={current}/></nav>
        <details className="mobile-menu">
          <summary>選單 <span aria-hidden="true">+</span></summary>
          <nav aria-label="手機導覽"><NavLinks current={current}/></nav>
        </details>
      </div>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer">
      <Brand/>
      <span>{site.profile.name} / {site.profile.english}</span>
      <a href={archivePath('/contact/')}>聯絡與合作 <Arrow/></a>
    </footer>
  </>
}
export function ResumeLink() {
  return <a className="text-link" download href={archivePath(site.profile.cv)}>下載完整經歷履歷（HTML） <Arrow down/></a>
}
