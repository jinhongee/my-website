import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page, { stagger, rise } from '../components/Page'
import work from '../data/work'

export default function Work() {
  return (
    <Page title="Work">
      <div className="kicker">Selected Work</div>
      <p className="lede">
        Systems I have built and problems I have worked on. Each entry carries a technical summary
        and the literature it stands on.
      </p>
      <motion.div className="work-list" variants={stagger} initial="hidden" animate="show">
        {work.map((wk, i) => (
          <motion.div key={wk.slug} variants={rise}>
            <Link to={`/work/${wk.slug}`} className="work-card">
              <div className="work-card-top">
                <span className="work-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="work-title">{wk.title}</span>
                <span className="work-arrow">→</span>
              </div>
              <div className="work-org">{wk.org}</div>
              <p className="work-tagline">{wk.tagline}</p>
              <div className="tag-row">
                {wk.tags.map((tg) => (
                  <span key={tg} className="tag">
                    {tg}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Page>
  )
}
