import { motion } from 'framer-motion'
import Page, { stagger, rise } from '../components/Page'
import readings from '../data/readings'

export default function Readings() {
  return (
    <Page title="Readings">
      <p className="lede">
        Texts I keep returning to — the mathematical substrate under machine learning, not the news
        cycle on top of it.
      </p>
      {readings.map((grp) => (
        <section key={grp.group} className="reading-group">
          <div className="section-label">{grp.group}</div>
          <motion.div variants={stagger} initial="hidden" animate="show">
            {grp.items.map((r) => (
              <motion.div key={r.title} variants={rise} className="reading-item">
                <a className="reading-title" href={r.link} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
                <div className="reading-meta">
                  {r.authors} · {r.venue} · {r.year}
                </div>
                <p className="reading-note">{r.note}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}
    </Page>
  )
}
