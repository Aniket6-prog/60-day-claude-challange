FinBuddy — Day 4 Progress

Day 4: Core Feature Implementation — Authentication 🔐

Implemented the first major user-facing feature of FinBuddy: secure user authentication.

Features Implemented

User registration

User login

Password hashing with bcrypt

JWT token generation

JWT authentication middleware

Protected backend routes

Authentication context

Protected frontend routes

Login/logout functionality

Authentication state persistence

Form validation

Frontend API integration

Backend API integration

MySQL user integration

Authentication flow testing

Authentication Architecture

User
  ↓
React Frontend
  ↓
Express API
  ↓
┌───────────────┬──────────────┐
↓               ↓
MySQL           JWT + bcrypt
Users           Authentication

Registration Flow

Registration
     ↓
Validate Input
     ↓
Hash Password with bcrypt
     ↓
Save User in MySQL
     ↓
Generate JWT
     ↓
Return Authentication Response

Login Flow

Login
  ↓
Validate Credentials
  ↓
Find User
  ↓
Compare Password
  ↓
Generate JWT
  ↓
Authenticate User
  ↓
Access Protected Resources

Protected API

GET /api/auth/me
Authorization: Bearer <JWT_TOKEN>

Security

Passwords are never stored as plain text.

User Password
      ↓
    bcrypt
      ↓
Password Hash
      ↓
    MySQL

JWT is used to authenticate protected requests.

Day 4 Verification

✅ Registration
✅ Login
✅ Password hashing
✅ JWT authentication
✅ Protected routes
✅ Authentication state
✅ Logout
✅ Frontend integration
✅ Backend integration
✅ Database integration
✅ Authentication testing

Git Commit

git add .
git commit -m "feat: implement user authentication"
git push origin main

Next — Day 5

Transaction Management:

Add Income
    ↓
Add Expense
    ↓
Categorize Transaction
    ↓
Store in MySQL
    ↓
View Transactions
    ↓
Filter / Manage Transactions