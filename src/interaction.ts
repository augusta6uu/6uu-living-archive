import { fieldHeight, fieldWidth, strand, type Point } from './field-geometry'

type FieldNode = { link: HTMLAnchorElement; origin: Point; current: Point }

function fieldMotion(links: HTMLAnchorElement[], groups: SVGGElement[]) {
  const positions = new Map<string | undefined, FieldNode>(links.map((link) => {
    const origin = { x: Number(link.dataset.x), y: Number(link.dataset.y) }
    return [link.dataset.node, { link, origin, current: origin }] as const
  }))
  const edges = groups.map((group) => ({
    from: positions.get(group.dataset.from)!,
    to: positions.get(group.dataset.to)!,
    paths: Array.from(group.querySelectorAll<SVGPathElement>('[data-bend]')).map((path) =>
      ({ path, bend: Number(path.dataset.bend) })),
  }))
  const media = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)')
  let frame = 0

  function pull(active: string | undefined, linked: Set<string>) {
    cancelAnimationFrame(frame)
    const focal = media.matches ? positions.get(active)?.origin : undefined
    const moves: { node: FieldNode; start: Point; target: Point }[] = []

    for (const [id, node] of positions) {
      const { origin, current } = node
      let target = origin
      if (focal && id && id !== active && linked.has(id)) {
        const dx = focal.x - origin.x
        const dy = focal.y - origin.y
        const fraction = Math.min(.085, 14 / (Math.hypot(dx, dy) || 1))
        target = { x: origin.x + dx * fraction, y: origin.y + dy * fraction }
      }
      if (current.x !== target.x || current.y !== target.y) moves.push({ node, start: current, target })
    }
    if (!moves.length) return
    const moving = new Set(moves.map(({ node }) => node))
    const affected = edges.filter(({ from, to }) => moving.has(from) || moving.has(to))

    function draw(progress: number) {
      for (const { node, start, target } of moves) {
        const x = progress === 1 ? target.x : start.x + (target.x - start.x) * progress
        const y = progress === 1 ? target.y : start.y + (target.y - start.y) * progress
        node.current = { x, y }
        node.link.style.setProperty('--pull-x', String((x - node.origin.x) * 100 / fieldWidth))
        node.link.style.setProperty('--pull-y', String((y - node.origin.y) * 100 / fieldHeight))
      }
      for (const { from, to, paths } of affected) {
        for (const { path, bend } of paths) path.setAttribute('d', strand(from.current, to.current, bend))
      }
    }
    if (!media.matches) {
      draw(1)
      return
    }

    const start = performance.now()
    const duration = focal ? 390 : 510
    function step(now: number) {
      const time = Math.max(0, Math.min((now - start) / duration, 1))
      draw(1 - (1 - time) ** 3)
      if (time < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  }

  return { media, pull }
}

export function connectField(field: HTMLElement) {
  const links = Array.from(field.querySelectorAll<HTMLAnchorElement>('[data-node]'))
  const edges = Array.from(field.querySelectorAll<SVGGElement>('.field-edge'))
  const notes = Array.from(field.querySelectorAll<HTMLElement>('[data-description]'))
  const defaultNote = field.querySelector<HTMLElement>('[data-field-default]')
  let pointer: string | undefined
  let focused: string | undefined
  let lastActive: string | undefined
  let linked = new Set<string>()
  const motion = fieldMotion(links, edges)
  motion.media.addEventListener('change', () => motion.pull(lastActive, linked))

  function update() {
    const active = focused ?? pointer
    if (active === lastActive) return
    lastActive = active
    linked = new Set<string>()
    for (const edge of edges) {
      const { from, to } = edge.dataset
      const matches = Boolean(active && (from === active || to === active))
      if (matches && from && to) {
        linked.add(from)
        linked.add(to)
      }
      edge.classList.toggle('edge-active', matches)
    }
    for (const link of links) {
      const id = link.dataset.node
      link.classList.toggle('node-active', Boolean(active && id === active))
      link.classList.toggle('node-related', Boolean(active && id && id !== active && linked.has(id)))
      link.classList.toggle('node-muted', Boolean(active && id && id !== active && !linked.has(id)))
    }
    for (const note of notes) note.hidden = note.dataset.description !== active
    if (defaultNote) defaultNote.hidden = Boolean(active)
    field.classList.toggle('field-active', Boolean(active))
    motion.pull(active, linked)
  }

  for (const link of links) {
    link.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch') return
      pointer = link.dataset.node
      update()
    })
    link.addEventListener('pointerleave', () => {
      pointer = undefined
      update()
    })
    link.addEventListener('focus', () => {
      focused = link.dataset.node
      update()
    })
    link.addEventListener('blur', () => {
      focused = undefined
      update()
    })
  }
}
