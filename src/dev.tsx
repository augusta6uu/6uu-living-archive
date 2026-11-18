import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import App from './App'
import { pageMeta, resolveRoute } from './content'
import { connectField } from './interaction'

export function renderDev() {
  const root = document.getElementById('root')
  if (!root) return
  const path = location.pathname.slice(import.meta.env.BASE_URL.length - 1)
  const route = resolveRoute(path)
  document.title = pageMeta(route).title
  const app = createRoot(root)
  flushSync(() => app.render(<App route={route}/>))
  root.querySelectorAll<HTMLElement>('[data-field]').forEach(connectField)
}
