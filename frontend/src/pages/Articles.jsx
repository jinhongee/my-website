import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page, { stagger, rise } from '../components/Page'
import essays from '../essays'

export default function Articles() {
  return (
    <Page title="Articles">
      <div className="kicker">Articles</div>
      <p className="lede">
        Longer-form essays on the mathematical structure of learning systems, typeset as papers.
      </p>
      <motion.div className="article-list" variants={stagger} initial="hidden" animate="show">
        {essays.map((es, i) => (
          <motion.div key={es.slug} variants={rise}>
            <Link to={`/articles/${es.slug}`} className="article-card">
              <span className="work-idx">
                {String(i + 1).padStart(2, '0')} · {es.date}
              </span>
              <div className="article-title">{es.title}</div>
              <p className="article-abstract">{es.teaser}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Page>
  )
}
