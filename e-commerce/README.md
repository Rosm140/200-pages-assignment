# 🛒 ShopHub - Modern E‑Commerce Website

<div align="center">

![ShopHub Logo](assets/images/shophub-logo.svg)

### Frontend E‑Commerce Website | College Project

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[Home](index.html) • [Features](#-features) • [Technical Details](#-technical-implementation) • [Project Structure](#-project-structure)

**College:** [Your College Name] • **Course:** [Your Course] • **Year:** 2026

</div>

---

## 📝 Project Overview

ShopHub is a **modern, fully responsive e‑commerce front-end** that simulates a real online shopping experience for multiple categories like electronics, fashion, home, beauty, sports and books.  
It is designed to be the e‑commerce counterpart to the **TravelGo** travel‑agency site, matching it in terms of structure, polish, and documentation quality.

### 🎯 Project Objectives

- ✅ Create a professional, production‑style e‑commerce UI
- ✅ Support multiple product categories and landing pages
- ✅ Implement cart, wishlist and account‑related screens
- ✅ Reuse a consistent design system across all pages
- ✅ Provide clean, extensible vanilla JavaScript interactions

### 🏆 What I Learned

- **E‑commerce UX:** category navigation, deal sections, checkout flows
- **Component Thinking:** shared header/footer and repeated product cards
- **State & Storage:** using `localStorage` for lightweight cart state
- **Responsive Layouts:** grids for products and category cards
- **Design Systems:** tokens (colors, spacing, typography) reused everywhere

---

## ✨ Features

### 🎨 **Modern Storefront UI**
- **Hero Promotions** – Highlighted “Flash Deals” and category banners
- **Rich Product Cards** – Ratings, old/new price, discounts, badges
- **Top Utility Bar** – Sale banner, offers, and quick account access

### 🛍️ **Shopping Experience**
- **Category Pages** – Electronics, Fashion, Home, Beauty, Sports, Books
- **Utility Pages** – Deals, Offers, New Arrivals, All Products, Categories
- **Cart & Checkout** – Cart summary and checkout page mockups
- **Wishlist & Orders** – Wishlist, My Account, and Orders overview pages

### 👤 **Account & Support**
- **Auth Screens** – Login and Register pages styled for real projects
- **Help Pages** – FAQ, Shipping, Returns, and Contact pages

### ⚙️ **Front‑End Logic**
- **Banner Control** – Dismissible top banner (remembered with `localStorage`)
- **Cart Counter** – Shared cart badge that persists across pages
- **Wishlist Toggle** – Simple wishlist heart toggle on cards
- **Countdown Timer** – Live countdown for Flash Deals sections

---

## 🛠️ Technical Implementation

### **Core Technologies**

| Technology | Purpose | Why It Fits E‑Commerce |
|-----------|---------|------------------------|
| **HTML5** | Semantic layout | SEO‑friendly category and product sections |
| **CSS3** | Styling & layout | Complex grids, responsive cards, utility classes |
| **JavaScript ES6+** | Interactivity | Cart state, banner, countdown, wishlist |
| **LocalStorage API** | Client state | Persist cart count and banner visibility |
| **SVG / Emoji** | Iconography | Lightweight, scalable icons for UI elements |

### **Key JavaScript Modules**

- **`assets/js/ecommerce.js`** – ShopHub‑specific interactions:
  - Cart counter (with `localStorage`)
  - Dismissible sale banner
  - Wishlist heart toggle
  - Flash deal countdown (`.countdown`)
- **`assets/js/auth.js`** – Form validation and mock authentication flows for login/register pages.
- **`assets/js/include.js`** – Shared component loader (borrowed and adapted from TravelGo) for header/footer, if you opt to use components instead of inline markup.
- **`assets/js/main.js`** – Generic enhancements (scroll effects, lazy loading, etc.) that can be reused across projects if desired.

---

## 📁 Project Structure

```text
e-commerce/
│
├── index.html                     # Home / main storefront
│
├── pages/                         # All secondary pages
│   ├── categories.html            # Category overview
│   ├── products.html              # All products listing
│   ├── deals.html                 # Deals / lightning offers
│   ├── new-arrivals.html          # New products
│   ├── category-electronics.html  # Electronics landing
│   ├── category-fashion.html      # Fashion landing
│   ├── category-home.html         # Home & living landing
│   ├── category-beauty.html       # Beauty products landing
│   ├── category-sports.html       # Sports & fitness landing
│   ├── category-books.html        # Books landing
│   ├── cart.html                  # Cart summary
│   ├── checkout.html              # Checkout mock flow
│   ├── wishlist.html              # Wishlist items
│   ├── account.html               # My account overview
│   ├── orders.html                # Orders / tracking
│   ├── login.html                 # Login
│   ├── register.html              # Register
│   ├── faq.html                   # Help / FAQ
│   ├── contact.html               # Contact support
│   ├── shipping.html              # Shipping info
│   └── returns.html               # Returns & refunds
│
├── components/                    # Reusable layout pieces
│   ├── header.html                # Optional shared header
│   └── footer.html                # Optional shared footer
│
├── assets/
│   ├── css/
│   │   └── main.css               # Main stylesheet (layouts, cards, utilities)
│   │
│   ├── js/
│   │   ├── ecommerce.js           # ShopHub‑specific interactions
│   │   ├── auth.js                # Auth & validation logic
│   │   └── include.js             # Component loader (header/footer)
│   │
│   └── images/
│       ├── shophub-logo.svg       # Logo
│       └── ...                    # Product / UI artwork
│
└── README.md                      # This documentation
```

**Current Project Size (Approx):**
- **20 HTML pages** covering core e‑commerce flows
- **600+ lines** of CSS in `main.css`
- **600+ lines** of JavaScript across `ecommerce.js`, `auth.js`, `include.js`, `main.js`

---

## 🚀 Getting Started

### Prerequisites

```bash
# Any modern web browser
# Local web server (VS Code Live Server recommended)
# Text editor (VS Code, Sublime Text, etc.)
```

### Run Locally

1. **Open the folder**
   - `e-commerce/` is the project root.

2. **Start a local server**
   - Recommended: VS Code “Live Server” → open `index.html` with it.
   - Or use Python:
     ```bash
     python -m http.server 8000
     ```
   - Or Node:
     ```bash
     npx serve
     ```

3. **Visit in browser**
   ```text
   http://localhost:8000/e-commerce/index.html
   ```

4. **Explore the flows**
   - Browse categories from the main navigation.
   - Add items to cart from product cards to see the cart badge update.
   - Navigate to Cart, Checkout, Wishlist, Account, Orders, FAQ, Shipping, and Returns pages.

---

## 🌈 Design System (Summary)

- **Navigation:** sticky header with prominent search bar and quick links.
- **Cards:** reusable product card and category card patterns.
- **Utilities:** spacing, colors, typography designed for readability and conversion.

You can further extend this project with real data, product filters, or backend integration while keeping the same structure.

Tested and verified on:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Perfect |
| Firefox | 115+ | ✅ Perfect |
| Safari | 16+ | ✅ Perfect |
| Edge | 120+ | ✅ Perfect |
| Mobile Safari | iOS 15+ | ✅ Perfect |
| Chrome Mobile | Android 12+ | ✅ Perfect |

---

## 📈 Future Enhancements

**Planned for Version 2.0:**
- [ ] Backend integration (Node.js/Express)
- [ ] Database (MongoDB for bookings)
- [ ] Real payment gateway (Razorpay/Stripe)
- [ ] User dashboard (bookings, profile)
- [ ] Admin panel (manage packages)
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA)

---

## 👨‍💻 Developer

**Rohit**

- 🎓 College: [Your College Name]
- 📧 Email: [your.email@example.com]
- 💼 LinkedIn: [linkedin.com/in/yourprofile]
- 🐱 GitHub: [github.com/yourusername]
- 🌐 Portfolio: [your-portfolio.com]

---

## 🙏 Acknowledgments

- **Faculty Guide:** [Professor Name] - For guidance and support
- **Inspiration:** Modern travel websites (Airbnb, Booking.com)
- **Fonts:** Google Fonts (Playfair Display, Poppins)
- **Icons:** Custom SVG designs
- **Images:** Unsplash, Pexels (stock photos)
- **Learning Resources:** MDN Web Docs, CSS-Tricks, JavaScript.info

---

## 📞 Contact & Support

For questions about this project:

- 📧 **Email:** [your.email@example.com]
- 💬 **GitHub Issues:** [Create an issue](https://github.com/yourusername/travelgo-website/issues)
- 💼 **LinkedIn:** [Connect with me](https://linkedin.com/in/yourprofile)

---

## 📄 Documentation

Complete project documentation:

- **[README.md](README.md)** - This file (project overview)
- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed setup instructions
- **[QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)** - Troubleshooting common issues
- **[LOGO_GUIDE.md](LOGO_GUIDE.md)** - Logo usage guidelines

---

## ⭐ Show Your Support

If you found this project helpful or impressive, please give it a ⭐️ on GitHub!

---

<div align="center">

### 🎓 Created as a College Project | 💼 Portfolio Piece | 🚀 Professional Quality

**Made with ❤️ and lots of ☕ by Rohit**

© 2026 TravelGo | Academic Project

**[⬆ Back to Top](#-travelgo---modern-travel-agency-website)**

</div>
