import './styles/site.css'
import { connectField } from './interaction'

if (import.meta.env.DEV) {
  const { renderDev } = await import('./dev')
  renderDev()
} else {
  document.querySelectorAll<HTMLElement>('[data-field]').forEach(connectField)
}
