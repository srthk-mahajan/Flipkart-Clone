# Flipkart Clone (Full-Stack E-Commerce)

A production-style full-stack e-commerce application inspired by Flipkart, built as an SDE Intern assignment submission.

It includes:

- A responsive React SPA frontend
- A Node.js + Express REST API backend
- PostgreSQL relational database with proper foreign-key relationships
- Seeded catalog data (30+ products)
- End-to-end cart and checkout flow
- Wishlist support
- Order history
- Optional email notification on order placement (Resend)

---

## Tech Stack

### Frontend

- React (Vite)
- React Router
- Context API (cart state)
- Axios
- CSS (custom, responsive)
- React Icons

### Backend

- Node.js
- Express.js
- PostgreSQL (`pg`)
- dotenv
- cors
- Resend (order emails)

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
- Flipkart-like listing page with sidebar filters, sort bar, offer cues, and assured-style badges
- Product detail layout:
  - Image carousel (left)
  - Product info + add-to-cart + buy-now (right)
- Multi-image product gallery support (`image_urls`) for true carousel images
- Cart page:
  - Quantity selector
  - Remove item
  - Price summary
- Checkout page:
  - Shipping form
  - Order summary
  - Place order button
- Order confirmation page with generated order ID and details
- Homepage auto-sliding hero carousel and clickable category/section cards

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
- Optional order email notification trigger after successful placement

---

## Database Schema (Relational)

The schema is created automatically in `backend/src/models/db.js` through `initDatabase()`.

### Tables

- `users(id, name, email)`
- `products(id, name, description, price, category, stock, image_url, image_urls[])`
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

`backend/src/seed/seedProducts.js` inserts 57 products across categories:

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
- `image_urls` (array of multiple images for carousel)
- `category`

---

## Setup Instructions

## 1) Clone and Open

Open the folder:

- `C:\Users\saart\Desktop\flipkart`

## 2) Create PostgreSQL DB

Create a local database named `flipkart_clone` (or update connection string in `.env`).

## 3) Configure Environment

Backend `.env`:

- `PORT=5000`
- `DATABASE_URL=...`
- `CLIENT_URL=http://localhost:5173`
- `DEFAULT_USER_ID=1`
- `ORDER_NOTIFICATIONS_ENABLED=false`
- `RESEND_API_KEY=...` (optional)
- `ORDER_FROM_EMAIL=...` (optional)
- `ORDER_REPLY_TO_EMAIL=...` (optional)
- `ORDER_TO_EMAIL=...` (optional fallback recipient)

Frontend `.env`:

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

## Assumptions

- A default user is available for cart/order flows (`DEFAULT_USER_ID`) when no auth user is resolved.
- Product listing follows a Flipkart-like browse row layout (not strict card grid) to match actual Flipkart category pages.
- Email notifications are optional and rely on Resend configuration.
  - If using `onboarding@resend.dev`, delivery is restricted to your Resend account email.
  - For production or multiple recipients, verify a domain in Resend and use a sender from that domain.
- Seed script resets product/cart/order data before inserting fresh sample catalog data.

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
- Product media model supports multi-image arrays for richer PDP experience
- Frontend consumes only backend APIs (no product hardcoding)
- Cart state centralized in React Context for simple, scalable state management
- Designed for extensibility: auth, payments, wishlists, and admin panel can be added cleanly
