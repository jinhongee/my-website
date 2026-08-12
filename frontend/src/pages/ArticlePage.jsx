import { useParams, Navigate, Link } from 'react-router-dom'
import Page from '../components/Page'
import essays from '../essays'

export default function ArticlePage() {
  const { slug } = useParams()
  const essay = essays.find((es) => es.slug === slug)
  if (!essay) return <Navigate to="/articles" replace />
  const Body = essay.component

  return (
    <Page title={essay.title}>
      <Link to="/articles" className="back-link">
        ← Essays
      </Link>
      <div className="paper-wrap">
        <article className="paper">
          <h1 className="paper-title">{essay.title}</h1>
          <div className="paper-byline">Jinhong Min</div>
          <div className="paper-abstract">
            <span className="abstract-head">Abstract</span>
            {essay.abstract}
          </div>
          <Body />
        </article>
      </div>
    </Page>
  )
}
