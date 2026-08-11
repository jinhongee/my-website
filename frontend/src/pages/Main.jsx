import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Page, { stagger, rise } from '../components/Page'
import work from '../data/work'

export default function Main() {
  return (
    <Page title={null}>
      <section className="hero">
        <div className="kicker">Machine Learning / Systems</div>
        <h1 className="page-title">
          Building agentic systems and the models underneath them.
        </h1>
        <div className="prose">
          <p>
            I am a co-founder at{' '}
            <a href="https://quno.ai" target="_blank" rel="noreferrer">
              Quno AI
            </a>
            , backed by a16z speedrun (SR004) and Pear VC.
          </p>
          <p>
            Before that, I studied computer science and statistics at Columbia University. My work
            sits where large-scale machine learning meets systems engineering — sequence models and
            representation learning on the one side, the distributed infrastructure that trains and
            serves them on the other, with a standing side interest in operating systems.
          </p>
          <p>
            Right now I care about shipping systems that hold up in production. If you want to talk
            about any of the below, reach out at{' '}
            <a href="mailto:jinhong@quno.ai">jinhong@quno.ai</a>.
          </p>
        </div>
      </section>

      <motion.div className="focus-list" variants={stagger} initial="hidden" animate="show">
        {work.map((wk, i) => (
          <motion.div key={wk.slug} variants={rise}>
            <Link to={`/work/${wk.slug}`} className="focus-row">
              <span className="focus-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="focus-name">{wk.title}</span>
              <span className="focus-domain">{wk.org}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Page>
  )
}
