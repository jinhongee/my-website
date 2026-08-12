import { Link } from 'react-router-dom'
import Page from '../components/Page'

export default function Main() {
  return (
    <Page title={null}>
      <section className="hero">
        <div className="prose bio">
          <p>
            I am drawn to simple ideas and like to build systems that hold. I am interested in the
            fundamental questions underneath learning and intelligence. What is a model actually
            learning — the world, or the data it saw? Can a learner improve how it learns? How far
            can a system bootstrap from its own output?
          </p>
          <p>
            I am building{' '}
            <a href="https://openintellect.co/" target="_blank" rel="noreferrer">
              OpenIntellect
            </a>
            , backed by Andreessen Horowitz. Firms run their own intelligence on their own
            infrastructure — open-weight models grounded in the firm's knowledge, deployed inside
            its perimeter, so the data never leaves.
          </p>
          <p>
            The problems I keep returning to:{' '}
            <Link to="/work/sovereign-models">sovereign open-weight models</Link> — continual
            pretraining, tokenizer adaptation, alignment on domestic compute;{' '}
            <Link to="/work/supply-chain-agents">autonomous agents</Link>, where hierarchical
            planners are grounded in constrained solvers rather than free-form generation; and{' '}
            <Link to="/work/hydroacoustic-classification">signal classification</Link>, where a
            physics-derived front end supplies the structure rather than a network hunting for it in
            raw noise.
          </p>
          <p>
            Before this, I studied computer science and statistics at Columbia, where I developed a
            strong interest in operating systems and compilers.
          </p>
          <p>
            Longer arguments become <Link to="/articles">essays</Link>; what I am reading is{' '}
            <Link to="/readings">here</Link>.
          </p>
        </div>
      </section>
    </Page>
  )
}
