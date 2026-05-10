# 🏠 HomeQuest – Premium Real Estate Platform

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-6C3AE8?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</div>

<br>

> India's most trusted real estate platform — built with Node.js, Express, MongoDB & Vanilla JS. Premium UI with 18 pages, REST API, Admin Dashboard, JWT Auth, and complete property management system.

---

## 📸 Overview

HomeQuest is a production-ready, full-stack real estate platform modelled after platforms like MagicBricks, 99acres, and Housing.com. It features:

- **18 Fully-Designed Frontend Pages**
- **Complete REST API Backend**
- **MongoDB Database with 9 Models**
- **JWT Authentication (User + Admin)**
- **Admin Dashboard with Analytics**
- **Property Search & Advanced Filters**
- **Wishlist, Bookings & Inquiry Systems**
- **Virtual Tour Feature**
- **Responsive Premium Light Theme UI**
- **Toast Notifications, Skeleton Loaders & AOS Animations**

---

## 📁 Project Structure

```
HomeQuest/
│
├── frontend/
│   ├── index.html                    # Homepage
│   └── pages/
│       ├── properties.html           # Property listings
│       ├── property-details.html     # Single property view
│       ├── advanced-search.html      # Advanced filters
│       ├── agents.html               # Agent directory
│       ├── agent-profile.html        # Agent detail page
│       ├── about.html                # About HomeQuest
│       ├── services.html             # Services offered
│       ├── pricing.html              # Pricing plans
│       ├── testimonials.html         # Client reviews
│       ├── blog.html                 # Blog listing
│       ├── blog-details.html         # Blog article
│       ├── wishlist.html             # Saved properties
│       ├── contact.html              # Contact form
│       ├── login.html                # User login
│       ├── register.html             # User registration
│       ├── user-dashboard.html       # User dashboard
│       └── admin-dashboard.html      # Admin panel
│   └── assets/
│       ├── css/style.css             # Global styles
│       └── js/main.js               # Global scripts
│
├── backend/
│   ├── server.js                     # Express app entry
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Agent.js
│   │   ├── Booking.js
│   │   ├── Inquiry.js
│   │   ├── Blog.js
│   │   └── ContactMessage.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── agentController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   ├── wishlistController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── agents.js
│   │   ├── wishlist.js
│   │   ├── bookings.js
│   │   ├── contact.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT middleware
│   │   └── upload.js                # Multer file upload
│   └── uploads/                     # Property images
│
├── package.json
├── .env
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/homequest.git
cd homequest
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/homequest
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Seed Database (Optional)

```bash
node backend/utils/seed.js
```

### 4. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Open in Browser

```
http://localhost:5000
```

---

## 🔑 Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@homequest.com | admin123 |
| User  | user@homequest.com | user123 |

---

## 🌐 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Protected |
| PUT | `/api/auth/profile` | Update profile | Protected |

### Properties
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/properties` | List all (with filters) | Public |
| GET | `/api/properties/featured` | Featured properties | Public |
| GET | `/api/properties/:id` | Single property | Public |
| POST | `/api/properties` | Add property | Protected |
| PUT | `/api/properties/:id` | Update property | Admin |
| DELETE | `/api/properties/:id` | Delete property | Admin |

### Agents
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/agents` | List all agents | Public |
| GET | `/api/agents/:id` | Agent + listings | Public |
| POST | `/api/agents` | Add agent | Admin |
| PUT | `/api/agents/:id` | Update agent | Admin |
| DELETE | `/api/agents/:id` | Delete agent | Admin |

### Wishlist
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/wishlist` | Get user wishlist | Protected |
| POST | `/api/wishlist/:propertyId` | Add to wishlist | Protected |
| DELETE | `/api/wishlist/:propertyId` | Remove from wishlist | Protected |

### Bookings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/bookings` | Create booking | Protected |
| GET | `/api/bookings/my` | User's bookings | Protected |
| GET | `/api/bookings` | All bookings | Admin |
| PUT | `/api/bookings/:id/status` | Update status | Admin |

### Contact
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/contact/inquiry` | Property inquiry | Public |
| POST | `/api/contact/message` | Contact message | Public |
| GET | `/api/contact/inquiries` | All inquiries | Admin |
| GET | `/api/contact/messages` | All messages | Admin |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/stats` | Dashboard stats | Admin |
| GET | `/api/admin/users` | All users | Admin |
| GET | `/api/admin/properties` | All properties | Admin |
| PUT | `/api/admin/properties/:id/approve` | Approve/reject | Admin |
| PUT | `/api/admin/properties/:id/featured` | Toggle featured | Admin |

---

## 🎨 Tech Stack

### Frontend
- **HTML5** – Semantic markup
- **CSS3** – Custom properties, Flexbox, Grid, animations
- **Vanilla JavaScript** – No framework, pure JS modules
- **AOS.js** – Scroll animations
- **Swiper.js** – Touch sliders
- **Font Awesome 6** – Icons
- **Google Fonts** – Playfair Display + DM Sans

### Backend
- **Node.js** – Runtime environment
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT** – Authentication tokens
- **Multer** – Image upload handling
- **Bcrypt.js** – Password hashing
- **Nodemailer** – Email notifications
- **CORS** – Cross-origin handling

---

## 🌍 Deployment

### Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Deploy to Render
1. Connect GitHub repository to Render
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables in Render dashboard

### Deploy to VPS (Ubuntu)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Start app
pm2 start backend/server.js --name homequest
pm2 startup
pm2 save

# Install Nginx
sudo apt install nginx
# Configure reverse proxy to port 5000
```

### MongoDB Atlas Setup
1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Get connection string
4. Add to `.env`: `MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/homequest`

---

## 🔒 Security Features

- JWT tokens with expiry
- Bcrypt password hashing (salt rounds: 12)
- Admin-only route middleware
- File type validation on uploads
- CORS configuration
- Environment variable secrets
- Input validation on all forms

---

## 📱 Responsive Breakpoints

| Device | Breakpoint |
|--------|------------|
| Mobile | < 768px |
| Tablet | 768px – 1024px |
| Desktop | > 1024px |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License – free to use for personal and commercial projects.

---

## 💬 Support

- Email: support@homequest.in
- Documentation: [docs.homequest.in](https://homequest.in)
- Issues: [GitHub Issues](https://github.com/yourusername/homequest/issues)

---

<div align="center">
  Built with ❤️ in India by the HomeQuest Team
  <br>
  <strong>© 2024 HomeQuest. All rights reserved.</strong>
</div>
