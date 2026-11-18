export const fieldWidth = 800
export const fieldHeight = 580

export type Point = { x: number; y: number }

export function strand(from: Point, to: Point, bend: number) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy) || 1
  const sx = -dy / distance * bend
  const sy = dx / distance * bend
  return `M ${from.x} ${from.y} C ${from.x + dx * .24 + sx} ${from.y + dy * .24 + sy}, ${from.x + dx * .73 + sx} ${from.y + dy * .73 + sy}, ${to.x} ${to.y}`
}
