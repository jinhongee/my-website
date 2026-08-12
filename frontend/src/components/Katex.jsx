import katex from 'katex'
import 'katex/dist/katex.min.css'

export function Eq({ children }) {
  const html = katex.renderToString(children, { throwOnError: false })
  return <span className="eq-inline" dangerouslySetInnerHTML={{ __html: html }} />
}

export function EqBlock({ children }) {
  const html = katex.renderToString(children, { throwOnError: false, displayMode: true })
  return <div className="eq-block" dangerouslySetInnerHTML={{ __html: html }} />
}
