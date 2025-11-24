Frontend deployment notes (Vercel / Netlify)

Vercel (recommended for Create React App):

1. Push your repo to GitHub.
2. Go to Vercel → New Project → Import Git Repository.
3. Set the root directory to `/frontend`.
4. Build command: `npm run build` (Vercel usually detects this).
5. Output directory: `build`.
6. Add an environment variable `REACT_APP_API_URL` pointing to your backend API (e.g. `https://api.example.com/api`).

Netlify:
- Build command: `npm run build`
- Publish directory: `build`
- Set `REACT_APP_API_URL` in Site settings → Build & deploy → Environment.

Local build:

```cmd
cd frontend
npm install
npm run build
``` 

Make sure the backend CORS settings include your frontend origin (see `backend/.env.example`).
