# Flipkart Clone (Full-Stack E-Commerce)

A production-style full-stack e-commerce application inspired by Flipkart, built as an SDE Intern assignment submission.

It includes:

- A responsive React SPA frontend
- A Node.js + Express REST API backend
- PostgreSQL relational database with proper foreign-key relationships
- Seeded catalog data (30+ products)
- End-to-end cart and checkout flow

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Context API (cart state)
- Axios
- CSS (custom, responsive)

### Backend

- Node.js
- Express.js
- PostgreSQL (`pg`)
- dotenv
- cors

### Database

- PostgreSQL

---

## Project Structure

```text
/frontend
  /src
    /components
      Navbar.jsx
      ProductCard.jsx
      ProductGrid.jsx
      ImageCarousel.jsx
      CartItem.jsx
    /pages
      Home.jsx
      ProductDetail.jsx
      Cart.jsx
      Checkout.jsx
      OrderConfirmation.jsx
    /services
      api.js
    /context
      CartContext.jsx
    App.jsx
    main.jsx

/backend
  /src
    /controllers
      productController.js
      cartController.js
      orderController.js
    /routes
      productRoutes.js
      cartRoutes.js
      orderRoutes.js
    /models
      db.js
    /middleware
      errorHandler.js
    /seed
      seedProducts.js
    server.js
```

---

## Features Implemented

### Flipkart-Style UI

- Blue/white clean shopping layout
- Sticky navbar with:
  - Brand mark
  - Search bar
  - Delivery/pincode marker
  - Cart icon + badge
- Category navigation rail
- Grid-based product listing
- Product cards with image/title/price/discount/add-to-cart
- Product detail layout:
  - Image carousel (left)
  - Product info + add-to-cart + buy-now (right)
- Cart page:
  - Quantity selector
  - Remove item
  - Price summary
- Checkout page:
  - Shipping form
  - Order summary
  - Place order button
- Order confirmation page with generated order ID and details

### Backend APIs

#### Products

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products?search=keyword`
- `GET /api/products?category=electronics`

#### Cart

- `GET /api/cart`
- `POST /api/cart`
- `PATCH /api/cart/:id`
- `DELETE /api/cart/:id`

#### Orders

- `POST /api/orders`
- `GET /api/orders`

---

## Database Schema (Relational)

The schema is created automatically in `backend/src/models/db.js` through `initDatabase()`.

### Tables

- `users(id, name, email)`
- `products(id, name, description, price, category, stock, image_url)`
- `cart_items(id, user_id, product_id, quantity)`
- `orders(id, user_id, total_amount, status, shipping_address, created_at)`
- `order_items(id, order_id, product_id, quantity, price)`

### Foreign Key Relationships

- `cart_items.user_id -> users.id`
- `cart_items.product_id -> products.id`
- `orders.user_id -> users.id`
- `order_items.order_id -> orders.id`
- `order_items.product_id -> products.id`

### Relationship Summary

- One **user** can have many **cart_items**
- One **product** can appear in many **cart_items**
- One **user** can place many **orders**
- One **order** can have many **order_items**
- One **product** can appear in many **order_items**

---

## Seed Data

`backend/src/seed/seedProducts.js` inserts 35 products across categories:

- electronics
- fashion
- home
- appliances
- books

Each product includes:

- `name`
- `description`
- `price`
- `stock`
- `image_url`
- `category`

---

## Setup Instructions

## 1) Clone and Open

Open the folder:

- `C:\Users\saart\Desktop\flipkart`

## 2) Create PostgreSQL DB

Create a local database named `flipkart_clone` (or update connection string in `.env`).

## 3) Configure Environment

Backend `.env` (already added):

- `PORT=5000`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/flipkart_clone`
- `CLIENT_URL=http://localhost:5173`
- `DEFAULT_USER_ID=1`

Frontend `.env` (already added):

- `VITE_API_BASE_URL=http://localhost:5000/api`

## 4) Install Dependencies

Backend:

- `cd backend`
- `npm install`

Frontend:

- `cd frontend`
- `npm install`

## 5) Seed Sample Products

From `backend` folder:

- `npm run seed`

## 6) Run Backend

From `backend` folder:

- `npm run dev`

## 7) Run Frontend

From `frontend` folder:

- `npm run dev`

Then open:

- `http://localhost:5173`

---

## Deployment Suggestions

### Backend (Render / Railway)

- Deploy `backend` as a Node service
- Set env vars in dashboard (`DATABASE_URL`, `CLIENT_URL`, `PORT`)
- Run `npm run seed` once on production DB

### Frontend (Vercel)

- Deploy `frontend`
- Set `VITE_API_BASE_URL` to deployed backend URL + `/api`

### Database (Supabase Postgres / Railway Postgres)

- Create managed Postgres instance
- Update backend `DATABASE_URL`

---

## Notes for Interview Discussion

- Clean separation by layers: routes -> controllers -> db
- Backend handles validation, stock checks, and transaction-safe order creation
- Frontend consumes only backend APIs (no product hardcoding)
- Cart state centralized in React Context for simple, scalable state management
- Designed for extensibility: auth, payments, wishlists, and admin panel can be added cleanly
