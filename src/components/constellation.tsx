import type { CSSProperties } from 'react'
import { archivePath, nodes, site } from '../content'
import { fieldHeight, fieldWidth, strand } from '../field-geometry'

const fieldNodes = nodes.map((node) => ({
  ...node,
  position: { x: node.initialPosition[0] / 100 * fieldWidth, y: node.initialPosition[1] / 100 * fieldHeight },
}))
const connections = fieldNodes.flatMap((from, i) => fieldNodes.slice(i + 1)
  .filter((to) => from.relatedNodeIds.includes(to.id) || to.relatedNodeIds.includes(from.id))
  .map((to) => ({ from, to })))

function FieldLines() {
  return <svg className="field-lines" viewBox={`0 0 ${fieldWidth} ${fieldHeight}`} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="strand" x2="1" y2="1"><stop stopColor="var(--clay)"/><stop offset=".56" stopColor="var(--clay)"/><stop offset="1" stopColor="var(--berry)"/></linearGradient>
    </defs>
    {connections.map(({ from, to }, i) => {
      const bend = (i % 2 ? -1 : 1) * (18 + i % 4 * 9)
      return <g className="field-edge" data-from={from.id} data-to={to.id} key={from.id + to.id}>
        {[-26, -15, -7, 7, 15, 26].map((offset) => <path key={offset} className="edge-trace" data-bend={bend + offset} d={strand(from.position, to.position, bend + offset)}/>)}
        <path className="edge-line" data-bend={bend} d={strand(from.position, to.position, bend)}/>
      </g>
    })}
  </svg>
}

export function Constellation() {
  return <section className="constellation" aria-label="探索檔案的關係網絡" data-field>
    <div className="field-atmosphere" aria-hidden="true"/>
    <div className="field-label"><span className="status-dot"/> 關係網絡 <span lang="en">/ Constellation</span></div>
    <div className="field-canvas">
      <FieldLines/>
      <ul className="nodes">
        {fieldNodes.map((node, index) => <li key={node.id} style={{
          '--x': node.initialPosition[0] + '%',
          '--y': node.initialPosition[1] + '%',
          '--weight': node.visualWeight,
          '--delay': -index * 1.12 + 's',
        } as CSSProperties}>
          <a href={archivePath(node.targetUrl)} className="node" data-node={node.id} aria-labelledby={'label-' + node.id}
            aria-describedby={'description-' + node.id} data-x={node.position.x} data-y={node.position.y}>
            <span className="node-content">
              <span className="node-symbol" aria-hidden="true"><span/></span>
              <span className="node-copy">
                <span className="node-label" id={'label-' + node.id}><span lang="en">{node.label}</span> <span className="node-zh">{node.category}</span></span>
                <span className="node-description" id={'description-' + node.id}>{node.shortDescription}</span>
              </span>
            </span>
          </a>
        </li>)}
      </ul>
    </div>
    <div className="field-note" aria-hidden="true">
      <span data-field-default>{site.home.hint}</span>
      {nodes.map((node) => <span key={node.id} className="field-detail" data-description={node.id} hidden>{node.shortDescription} <b>進入{node.category} ↗</b></span>)}
    </div>
  </section>
}
