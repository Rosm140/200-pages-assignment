# 🚀 Multi-Project Full-Stack Showcase

Welcome to the **200-Pages Assignment** repository. This is a comprehensive collection of modern web applications demonstrating high-end frontend design, robust backend architectures, and seamless third-party integrations.

---

## 🍕 Featured Project: FoodiePlace (Full-Stack)
**FoodiePlace** is a sophisticated food delivery platform featuring a robust Node.js/Express backend, MongoDB persistence, and automated customer communication systems.

### 🛠 Tech Stack (Backend)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Communication:** Nodemailer (SMTP Integration)
- **Validation:** Express-Validator

### ✨ Key Backend Features
- **Smart Order Engine:** Logic-heavy order processing that handles dynamic tax calculations, delivery fees based on order type (Pickup vs. Delivery), and automatic discounts.
- **Automated Notifications:** Integrated `mailer.js` utility that triggers real-time HTML email confirmations for new orders and status updates (Preparing, Ready, Out for Delivery).
- **Advanced Validation:** Strict schema validation ensuring data integrity for customer details, item arrays, and pricing.
- **Admin Workflow:** RESTful API endpoints for kitchen staff to manage order lifecycles and track revenue statistics via MongoDB Aggregation.

---

## 🏢 Project Portfolio

| Project | Type | Key Highlights |
| :--- | :--- | :--- |
| **FoodiePlace** | Full-Stack | Order management, Email SMTP, MongoDB Aggregation |
| **TravelGo** | Frontend | Responsive Design, Glassmorphism, Component Architecture |
| **ShopHub** | E-Commerce | Product catalogs, dynamic filtering, state management |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB Instance (Local or Atlas)
- Gmail APP Password (for email notifications)

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/200-pages-assignment.git
   ```

2. **Configure FoodiePlace Backend**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd FoodiePlace/foodieplace-backend
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in `FoodiePlace/foodieplace-backend/`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   NODE_ENV=development
   ```

4. **Run the Server**
   ```bash
   npm run dev
   ```

---

## 📡 API Documentation (FoodiePlace)

### Orders API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/orders` | Place a new order & trigger confirmation email |
| `GET` | `/api/orders` | Fetch all orders with filtering & stats (Admin) |
| `GET` | `/api/orders/:orderId` | Track a specific order |
| `PATCH` | `/api/orders/:orderId/status` | Update status & trigger update email |
| `DELETE` | `/api/orders/:orderId` | Cancel a pending order |

---

## 📂 Project Structure

```text
200-pages-assignment/
├── FoodiePlace/
│   ├── foodieplace-backend/
│   │   ├── config/          # Database and Mailer configs
│   │   ├── models/          # Mongoose Schemas
│   │   ├── routes/          # API Controllers
│   │   └── server.js        # Entry point
│   └── foodieplace-frontend/
├── travel-agency-website/   # Modern landing page showcase
└── e-commerce/              # Feature-rich shopping platform
```

---

## 🛡️ Best Practices Implemented

- **Separation of Concerns:** Distinct layers for routing, data modeling, and utility services.
- **Security:** Environment variable protection and input sanitization.
- **Performance:** Non-blocking email operations using asynchronous execution.
- **Error Handling:** Centralized try-catch blocks with developer-friendly error messages in non-production environments.

---

## 👨‍💻 Author
**Rohit**
- **Academic Context:** 200-Pages Assignment (2026)
- **Focus:** Full-Stack Web Development & System Architecture

---

<div align="center">

**Made with ❤️ and clean code.**

</div>