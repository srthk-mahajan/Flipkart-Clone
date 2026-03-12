# 🛒 Flipkart Clone

A full-stack, production-style e-commerce app inspired by Flipkart. Built as an SDE Intern assignment, this project demonstrates scalable architecture, modern UI, and robust backend APIs.

## 🚀 Live Demo

- [Frontend](https://frontend-three-sage-48.vercel.app/)
- [Backend Health](https://backend-eight-eta-92.vercel.app/api/health)

## 📦 Features

- Flipkart-style responsive UI
- Product listing, detail, cart, checkout, order history, wishlist
- Multi-image product galleries
- Sticky navbar, category navigation, offer cues
- Cart state managed via React Context
- Order email notifications (Resend)
- PostgreSQL relational DB with proper foreign keys
- Seeded catalog data (50+ products)

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- React Router
- Axios
- CSS (custom, responsive)
- React Icons

**Backend:**

- Node.js
- Express.js
- PostgreSQL (`pg`)
- dotenv
- cors
- Resend (order emails)

**Database:**

- PostgreSQL (Neon)

## 🗂️ Project Structure

```
/frontend
  /src
    /components
    /pages
    /services
    /context
    App.jsx
    main.jsx
/backend
  /src
    /controllers
    /routes
    /models
    /middleware
    /seed
    server.js
```

## ⚡ Quick Start

1. Clone repo: `git clone https://github.com/srthk-mahajan/Flipkart-Clone`
2. Create Neon Postgres DB, update `backend/.env`
3. Set up Vercel projects:
   - Backend: root = `backend`
   - Frontend: root = `frontend`
4. Add env vars in Vercel
5. Deploy both projects

## 🧩 API Endpoints

- `GET /api/products` — List products
- `GET /api/products/:id` — Product detail
- `GET /api/cart` — Cart
- `POST /api/cart` — Add to cart
- `PATCH /api/cart/:id` — Update cart item
- `DELETE /api/cart/:id` — Remove cart item
- `POST /api/orders` — Place order
- `GET /api/orders` — Order history
- `GET /api/health` — Backend health
- `GET /api/ping` — Lightweight uptime check

## 🏗️ Deployment

- Vercel monorepo setup (frontend/backend folders)
- Auto-deploy on GitHub push
- Edge caching for product APIs
- Short in-memory cache for fast repeated loads

## 📝 Notes

- Designed for extensibility: auth, payments, admin panel can be added
- Cart state is isolated per user/guest
- Email notifications require Resend API key
- `.env` files are gitignored for security

## 👤 Author

- Saarthak Mahajan ([GitHub](https://github.com/srthk-mahajan))

---

> Built for learning, demo, and interview discussion. Not for production use.
