# TODO: Fix Login Page Issue

## Problem
- Login form posts to /login, but route is /auth/login, causing "Cannot POST /login" error.
- Need to remove /auth prefix for consistency and fix the routing.

## Steps
- [x] Update routes.ts: Change auth routes from /auth/* to /*
- [x] Update src/views/auth/login.ejs: Change form action from /auth/login to /login
- [x] Update src/views/auth/register.ejs: Change form action from /auth/signup to /signup
- [x] Test the login functionality after changes
