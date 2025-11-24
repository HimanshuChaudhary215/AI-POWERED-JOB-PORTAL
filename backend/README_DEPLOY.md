Backend deployment notes (Render / Heroku)

Quick steps for Render (recommended):

1. Push your repo to GitHub.
2. Create a new Web Service on Render and connect your GitHub repo.
3. Set the build command to: `pip install -r backend/requirements.txt` (Render will usually detect Python)
4. Set the start command to: `gunicorn core.wsgi --log-file -`
5. Add environment variables from `.env.example` in the Render dashboard (important: `DJANGO_SECRET_KEY`, DB vars, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`).
6. Run `python manage.py migrate` and `python manage.py collectstatic --noinput` in the deploy hooks or startup commands if needed.

Notes for Heroku:
- Create an app, set `Procfile` (included) and add config vars from `.env.example`.
- Use Heroku Postgres for the database.

Static files:
- We use WhiteNoise to serve static files. Ensure `collectstatic` runs during build and `STATIC_ROOT` is set (already configured).

Local testing:
- Create a `.env` locally from `.env.example` and run:

  ```cmd
  cd backend
  pip install -r requirements.txt
  set DJANGO_SECRET_KEY=dev-secret
  set USE_SQLITE=1
  python manage.py migrate
  python manage.py runserver
  ```
