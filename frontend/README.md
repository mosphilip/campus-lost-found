# Campus Lost & Found

A full-stack web app that helps students recover lost items on campus. People post what they lost or found, and owners prove it is theirs through a claim system, so items go back to the right person.

## Features

- Browse, search, and filter lost and found items
- Sign up, log in, and log out with JWT authentication (tokens refresh automatically)
- Post items with photos
- Claim an item by describing something only the owner would know
- Item owners approve or reject claims; approving a claim marks the item as claimed
- Dashboard with my items, claims on my items, and my claims
- Owner-only editing and deleting, enforced on the server
- Responsive layout with an animated-border login form

## Tech stack

- **Frontend:** React (Vite), React Router, plain CSS
- **Backend:** Django, Django REST Framework, SimpleJWT, django-filter
- **Database:** SQLite (development)

## Screenshots

![Home page](screenshots/home.png)
![Login](screenshots/login.png)
![Item detail and claim form](screenshots/item-detail.png)
![Dashboard](screenshots/dashboard.png)

## API overview

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/api/auth/register/` | Create an account |
| POST | `/api/auth/login/` | Get access and refresh tokens |
| POST | `/api/auth/refresh/` | Get a new access token |
| GET | `/api/items/` | List items (supports `?type=`, `?category=`, `?search=`) |
| POST | `/api/items/` | Post an item (logged in) |
| PATCH / DELETE | `/api/items/{id}/` | Edit or delete an item (owner only) |
| POST | `/api/items/{id}/claim/` | Claim an item with a proof message |
| GET | `/api/my-items/` | Items I posted |
| GET | `/api/claims/mine/` | Claims I made |
| GET | `/api/claims/received/` | Claims on my items |
| POST | `/api/claims/{id}/approve/` | Approve a claim (item owner only) |
| POST | `/api/claims/{id}/reject/` | Reject a claim (item owner only) |

## Run it locally

You need Python 3.10+ and Node.js.

**Backend**

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend** (in a second terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://127.0.0.1:8000/api/`.

## What I learned

- Designing a REST API with Django REST Framework, including custom permissions and actions
- JWT authentication with automatic token refresh in React
- Handling file uploads between React and Django
- Building a multi-step workflow (claim, approve, reject) with rules enforced on the server

## Planned

- Deployment (Render, Cloudinary, Vercel)
- Email alerts when an item is claimed
- Suggested matches between lost and found items

## Moses Phillip 

Built by Moses Philip ([@mosphilip](https://github.com/mosphilip)).
