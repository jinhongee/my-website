import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Main', end: true },
  { to: '/work', label: 'Work' },
  { to: '/readings', label: 'Readings' },
  { to: '/articles', label: 'Articles' },
]

export default function Layout({ children }) {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="wordmark">
            Jinhong&nbsp;Min
          </Link>
          <nav className="site-nav">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="container main-content">{children}</main>
      <footer className="container site-footer">
        <span className="mono">© {new Date().getFullYear()} Jinhong Min</span>
        <a className="mono" href="mailto:jinhong@quno.ai">
          jinhong@quno.ai
        </a>
      </footer>
    </div>
  )
}
