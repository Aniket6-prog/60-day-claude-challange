# Day 5 — Core Feature Development

## FinBuddy — Smart Expense Tracker for Students

Day 5 focused on implementing the core **Transaction Management** functionality.

Transactions are the foundation of FinBuddy because they allow users to record and understand their income and expenses.

---

## 🎯 Today's Objective

Build a complete transaction management workflow that allows authenticated users to:

- Add income
- Add expenses
- Categorize transactions
- View transactions
- Filter transactions
- Edit transactions
- Delete transactions

---

## ✅ Features Implemented

### Transaction Creation

Users can create:

- Income transactions
- Expense transactions

Each transaction contains:

- Transaction type
- Category
- Amount
- Date
- Description

---

### Transaction Categories

Transactions can be assigned to categories.

Examples:

- Food
- Transport
- Education
- Shopping
- Salary
- Freelance
- Entertainment
- Other

---

### Transaction List

Users can view their transaction history.

The transaction list displays:

- Type
- Category
- Amount
- Date
- Description

---

### Transaction Filters

Users can filter their transactions by:

- Income / Expense
- Category
- Start date
- End date

Filters can also be reset.

---

### Edit Transaction

Users can update an existing transaction.

The same validation rules used during creation are applied when updating a transaction.

---

### Delete Transaction

Users can delete transactions.

A confirmation step is used before deletion to reduce accidental data loss.

---

## 🏗️ Architecture

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│ React Frontend   │
│ Transaction UI   │
└────────┬─────────┘
         │
         │ HTTP + JWT
         ▼
┌──────────────────┐
│ Express API      │
│ Transaction      │
│ Controller       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ MySQL Database   │
│ transactions     │
└──────────────────┘