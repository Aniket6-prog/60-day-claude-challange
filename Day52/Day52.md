# FinBuddy 💰

### Smart Expense Tracker for Students

FinBuddy is a student-focused personal finance application designed to help users track expenses, manage budgets, define financial goals, and understand their spending through intelligent insights.

> Built as part of the **AB Talks 60-Day Claude AI Challenge — 10-Day Capstone**.

---

## 🚀 Project Goal

Students often struggle to understand where their money goes because expenses are spread across multiple categories and there is little visibility into spending patterns.

FinBuddy aims to provide a simple dashboard where students can:

- Track income and expenses
- Categorize transactions
- Set monthly budgets
- Create financial goals
- Monitor spending
- Receive useful financial insights

---

# 🗓️ 10-Day Development Journey

| Day | Focus | Status |
|---|---|---|
| Day 1 | Product Discovery & Planning | ✅ Complete |
| Day 2 | System Design & Architecture | ✅ Complete |
| Day 3 | Project Setup | ⏳ Next |
| Day 4 | Core Feature 1 | ⏳ |
| Day 5 | Core Feature 2 | ⏳ |
| Day 6 | Data & Integration | ⏳ |
| Day 7 | UI/UX Polish | ⏳ |
| Day 8 | Testing & Bug Fixes | ⏳ |
| Day 9 | Deployment | ⏳ |
| Day 10 | Launch & Documentation | ⏳ |

---

# 🎯 Core Features

## Authentication

- User registration
- User login
- JWT-based authentication
- Current-user profile

## Transaction Management

- Add transactions
- View transactions
- Update transactions
- Delete transactions
- Categorize transactions

## Budget Management

- Create budgets
- View budgets
- Update budgets
- Monitor monthly spending limits

## Financial Goals

- Create financial goals
- Track target amounts
- Track target dates
- Update goals

## AI Insights

FinBuddy will use an AI service to analyze relevant spending data and generate useful insights.

Examples:

- Spending patterns
- Category-level observations
- Budget warnings
- General saving suggestions

---

# 🏗️ System Architecture

```mermaid
flowchart LR

    U[Student]

    FE[React Frontend]

    API[Node.js + Express API]

    DB[(MySQL Database)]

    AUTH[JWT Authentication]

    AI[OpenAI API]

    U --> FE
    FE --> API
    API --> DB
    API --> AUTH
    API --> AI
    AI --> API
    API --> FE