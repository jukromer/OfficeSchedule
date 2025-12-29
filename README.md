# Office

Office is a simple full-stack workspace coordination tool built with a Flask API and a React (Create React App) client. The backend exposes authentication, booking, and administration endpoints, while the frontend provides the calendar-style UI that your team interacts with day to day.

## Project structure

- `backend/` – Flask application (`run.py`) plus app modules, migrations, and environment files.
- `client/` – React SPA bootstrapped with Create React App (CRA) that talks to the API.

## Prerequisites

- Python 3.10+ with `pip`
- Node.js 18+ and Yarn (or `npm` if you prefer)
- SQLite (bundled with Python) or another database supported by SQLAlchemy if you adjust the config

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install flask flask_sqlalchemy flask_migrate flask_jwt_extended flask_cors python-dotenv
flask db upgrade  # runs the migrations in migrations/
python run.py     # starts the Flask dev server on http://localhost:5000
```

Environment values are loaded from `.env` / `.flaskenv`. At minimum define:

- `SECRET_KEY`, `JWT_SECRET_KEY`
- `DATABASE_URL` (defaults to SQLite `app.db`)
- LDAP credentials: `LDAP_SERVER`, `LDAP_BASE_DN`, `LDAP_USER_DN_TEMPLATE`, `LDAP_BIND_DN`, `LDAP_BIND_PASSWORD`
- Admin bootstrap values: `ADMIN_USERNAME`, `ADMIN_PASSWORD`

### Environment configuration

Create two files inside `backend/` before running the server:

```bash
# backend/.env
SECRET_KEY=change-me
JWT_SECRET_KEY=jwt-change-me
SQLALCHEMY_DATABASE_URI=sqlite:///app.db

LDAP_SERVER=ldap://your-server
LDAP_BASE_DN=dc=example,dc=local
LDAP_USER_DN_TEMPLATE={username}@example.local
LDAP_BIND_DN=user@example.local
LDAP_BIND_PASSWORD=super-secret

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

```bash
# backend/.flaskenv
FLASK_APP=app:create_app
FLASK_ENV=development
# optionally FLASK_RUN_PORT=5000, FLASK_DEBUG=1, etc.
```

Adjust the values to match your environment. Because these files contain secrets they are already listed in `.gitignore`.

## Frontend setup

```bash
cd client
yarn install
yarn start
```

CRA proxies API calls according to your `.env` configuration (see `client/README.md`). When both servers are running concurrently, UI requests will be sent to the Flask API at `http://localhost:5000`.

## Next steps

1. Update the environment files with your organization-specific secrets and LDAP details.
2. Add any missing Python dependencies to a `requirements.txt` or `pyproject.toml` so they can be installed with a single command.
3. Customize the frontend copy, branding, and API endpoints to match the data your backend exposes.
