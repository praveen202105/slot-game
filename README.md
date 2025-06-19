# 🎰 Slot Game – Full Stack Casino App

A full-featured, real-time slot machine game built with **Next.js**, **MongoDB**, **Redis**, and **JWT authentication**. Users can spin the machine, win coins, view their transaction history, climb the leaderboard, and claim bonus rewards when eligible.

---

## 🌐 Live Demo

Check out the live app: [https://slot-game-tau.vercel.app/](https://slot-game-tau.vercel.app/)

---

## 🚀 Features

### 🔐 User Authentication

* `POST /auth/register`: Register a new user (with hashed password)
* `POST /auth/login`: Login and receive a JWT token
* All protected routes are secured via JWT middleware
* ✅ Implemented Google OAuth (GAuth) for quick login

### 🎰 Slot Spin Logic

* `POST /api/spin`: Accepts a wager, simulates a spin
* Reels spin with random (weighted) symbols
* Deducts wager and adds winnings to user balance
* Records each spin as a transaction in MongoDB

### 💰 Balance & Transactions

* `GET /api/balance`: Returns the user's current balance
* `GET /api/transactions?page=&limit=`: Paginated transaction (spin/win) history

### 🏆 Leaderboard (Cached with Redis)

* `GET /api/leaderboard?days=7`: Top 10 users by net win over last `N` days
* Uses MongoDB aggregation 
* Response is cached in Redis for 2 minutes (via Upstash)

### 🎁 Bonus Spins

* Auto-grant bonus coins when a user spins 5 times or balance reaches 0
* `POST /api/spin/bonus`: Administer bonus coins to eligible users


---

## 🧠 Tech Stack

* **Frontend**: React, Tailwind CSS, ShadCN
* **Backend**: Next.js (API routes)
* **Database**: MongoDB with Mongoose
* **Auth**: JWT (with bcrypt hashing), Google OAuth
* **Caching**: Upstash Redis
* **Sound**: `use-sound` for spin and win audio effects

---

## 🛠 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/praveen202105/slot-game.git
cd slot-game
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Start the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📚 Learn More

To learn more about Next.js, check out:

* [Next.js Documentation](https://nextjs.org/docs)
* [Learn Next.js](https://nextjs.org/learn)
* [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## ☁️ Deploy on Vercel

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📁 Repository

> This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🏷️ License

[MIT](LICENSE)
