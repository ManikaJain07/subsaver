# 03 - Architecture

## Prototype (what is live on GitHub Pages)
```
Browser
 ├─ index.html   (structure)
 ├─ style.css    (design system)
 └─ app.js       (logic: dashboard, swipe, add, points)
        │
        ▼
   localStorage  (data stays on the user's device)
```
GitHub Pages serves static files only, so there is no server or real database here.

## Future version
```
Web app  ->  REST API (Node/Express)  ->  Database (see ../database.sql)
                 ├─ /auth       login, signup
                 ├─ /subscriptions   CRUD
                 ├─ /reviews    keep/cancel decisions
                 └─ /reminders  scheduled job emails/notifies 3 days before renewal
```
Later: bank SMS/statement import to auto-detect recurring payments (needs privacy consent and security review).
