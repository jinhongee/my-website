# jinhongmin.com

Personal site. React SPA (Vite + Framer Motion + KaTeX) served by Flask.

## Structure

- `frontend/` — React source
  - `src/data/work.js` — the five work entries (titles, summaries, cited papers)
  - `src/data/readings.js` — the readings list
  - `src/essays/` — LaTeX-typeset articles (KaTeX)
  - `src/components/viz/` — the animated canvas diagrams on each work page
- `dist/` — built frontend, **committed** so the Flask/gunicorn deploy needs no Node step
- `app.py` / `wsgi.py` — Flask serves `dist/` with an SPA catch-all

## Develop

```bash
cd frontend
npm install
npm run dev        # dev server with HMR
npm run build      # writes ../dist  (commit the result)
```

## Deploy

Same as before: gunicorn against `wsgi:app`. No Node required on the server.
