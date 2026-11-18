import { archivePath, type Media } from '../content'

export function safeUrl(value?: string) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url : undefined
  } catch {
    return undefined
  }
}
export function Picture({ image, sizes = '(max-width: 720px) 90vw, 760px' }: { image: Media; sizes?: string }) {
  const hasSize = image.width && image.height
  return <img src={archivePath(image.src)} alt={image.alt} width={hasSize ? image.width : undefined}
    height={hasSize ? image.height : undefined} loading="lazy" decoding="async"
    srcSet={image.variants?.map((variant) => archivePath(variant.src) + ' ' + variant.width + 'w').join(', ')}
    sizes={image.variants?.length ? sizes : undefined}/>
}
export function Photo({ image, caption }: { image: Media; caption?: string }) {
  const labels = [image.caption || caption, image.credit && '攝影 ' + image.credit].filter(Boolean)
  return <figure>
    <Picture image={image}/>
    {!!labels.length && <figcaption>{labels.join(' · ')}</figcaption>}
  </figure>
}
function videoEmbed(url: URL) {
  const parts = url.pathname.split('/').filter(Boolean)
  if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'].includes(url.hostname)) {
    const id = url.searchParams.get('v') ?? (url.hostname === 'youtu.be' ? parts[0] : parts[1])
    if (/^[\w-]{11}$/.test(id ?? '')) return 'https://www.youtube-nocookie.com/embed/' + id
  }
  if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(url.hostname)) {
    const id = parts.find((part) => /^\d+$/.test(part))
    const hash = url.searchParams.get('h') ?? (id && parts[parts.indexOf(id) + 1])
    if (id) return 'https://player.vimeo.com/video/' + id + (hash && /^[\da-f]+$/i.test(hash) ? '?h=' + hash : '')
  }
}
export function Video({ value, title }: { value: string; title: string }) {
  const url = safeUrl(value)
  if (!url) return null
  const embed = videoEmbed(url)
  return <details className="video">
    <summary>{title}</summary>
    {embed && <iframe title={title} src={embed} loading="lazy" allow="encrypted-media; fullscreen; picture-in-picture" allowFullScreen/>}
    <a href={url.href} className="text-link">前往原始影片 ↗</a>
  </details>
}
