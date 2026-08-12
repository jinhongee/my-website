import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import work from '../data/work'

export default function WorkDetail() {
  const { slug } = useParams()
  const item = work.find((wk) => wk.slug === slug)
  if (!item) return <Navigate to="/work" replace />
  const Viz = item.viz

  return (
    <Page title={item.title}>
      <Link to="/work" className="back-link">
        ← Work
      </Link>

      <motion.div
        className="viz-panel"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <Viz />
        <span className="viz-chip">{item.figure}</span>
        <span className="viz-chip-right">{item.figureRight}</span>
      </motion.div>

      <h1 className="page-title">{item.title}</h1>
      <div className="detail-org">{item.org}</div>

      <section className="detail-section">
        <div className="section-label">Summary</div>
        <div className="prose">
          {item.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <div className="section-label">Selected References</div>
        <ol className="ref-list">
          {item.papers.map((ref) => (
            <li key={ref.title} className="ref-item">
              <span className="ref-body">
                {ref.authors}. <span className="ref-title">“{ref.title}.”</span>{' '}
                <span className="ref-venue">{ref.venue}</span>, {ref.year}.{' '}
                <a className="ref-link" href={ref.link} target="_blank" rel="noreferrer">
                  [link]
                </a>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  )
}
