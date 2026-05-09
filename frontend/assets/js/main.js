// frontend/assets/js/main.js
// HomeQuest – Global Utilities & Core Interactions

const API_BASE = '/api';

/* ===== PAGE LOADER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('hidden');
  }, 600);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  // Scroll-to-top
  const scrollTop = document.getElementById('scroll-top');
  if (scrollTop) scrollTop.classList.toggle('visible', window.scrollY > 400);
});

/* ===== SCROLL TO TOP ===== */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== MOBILE MENU ===== */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'white';
    navLinks.style.padding = '16px';
    navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  });
}

/* ===== TOAST NOTIFICATIONS ===== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

function createToastContainer() {
  const c = document.createElement('div');
  c.id = 'toast-container';
  document.body.appendChild(c);
  return c;
}

/* ===== ANIMATED COUNTERS ===== */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1800;
  const startTime = performance.now();
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Intersection observer for counters
const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ===== AUTH HELPERS ===== */
const Auth = {
  token: () => localStorage.getItem('hq_token'),
  user: () => JSON.parse(localStorage.getItem('hq_user') || 'null'),
  isLoggedIn: () => !!localStorage.getItem('hq_token'),
  isAdmin: () => { const u = Auth.user(); return u && u.role === 'admin'; },
  headers: () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${Auth.token()}` }),
  save: (token, user) => { localStorage.setItem('hq_token', token); localStorage.setItem('hq_user', JSON.stringify(user)); },
  clear: () => { localStorage.removeItem('hq_token'); localStorage.removeItem('hq_user'); }
};

/* ===== API FETCH HELPER ===== */
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: Auth.headers(),
      ...options
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'API Error');
    return data;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
}

/* ===== FORMAT PRICE ===== */
function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString()}`;
}

/* ===== FORMAT DATE ===== */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ===== PROPERTY CARD TEMPLATE ===== */
function renderPropertyCard(p) {
  const wishlist = JSON.parse(localStorage.getItem('hq_wishlist') || '[]');
  const inWishlist = wishlist.includes(p._id);
  return `
    <div class="property-card" data-id="${p._id}">
      <div class="property-card-img">
        <img src="${p.images && p.images[0] ? p.images[0] : 'assets/images/placeholder.jpg'}" alt="${p.title}" loading="lazy">
        <span class="property-badge badge-${p.listingType === 'Rent' ? 'rent' : 'buy'}">${p.listingType}</span>
        ${p.isFeatured ? '<span class="property-badge badge-featured" style="top:14px;left:80px">Featured</span>' : ''}
        ${p.isNew ? '<span class="property-badge badge-new" style="top:14px;left:${p.isFeatured?\"150px\":\"80px\"}">New</span>' : ''}
        <span class="property-wishlist ${inWishlist ? 'active' : ''}" onclick="toggleWishlist('${p._id}', this)">
          ${inWishlist ? '❤️' : '🤍'}
        </span>
      </div>
      <div class="property-card-body">
        <div class="property-price">${formatPrice(p.price)}<span>${p.listingType === 'Rent' ? '/month' : ''}</span></div>
        <div class="property-title">${p.title}</div>
        <div class="property-location"><i class="fas fa-map-marker-alt"></i>${p.address?.locality || ''}, ${p.address?.city || ''}</div>
        <div class="property-features">
          ${p.bedrooms ? `<span class="property-feature"><i class="fas fa-bed"></i>${p.bedrooms} Beds</span>` : ''}
          ${p.bathrooms ? `<span class="property-feature"><i class="fas fa-bath"></i>${p.bathrooms} Baths</span>` : ''}
          <span class="property-feature"><i class="fas fa-vector-square"></i>${p.area} sqft</span>
        </div>
      </div>
      <div style="padding: 0 20px 20px">
        <a href="pages/property-details.html?id=${p._id}" class="btn btn-outline" style="width:100%;text-align:center">View Details</a>
      </div>
    </div>
  `;
}

/* ===== WISHLIST TOGGLE ===== */
async function toggleWishlist(propertyId, el) {
  if (!Auth.isLoggedIn()) { showToast('Please login to save properties', 'info'); return; }
  const wishlist = JSON.parse(localStorage.getItem('hq_wishlist') || '[]');
  const inList = wishlist.includes(propertyId);
  try {
    if (inList) {
      await apiFetch(`/wishlist/${propertyId}`, { method: 'DELETE' });
      const updated = wishlist.filter(id => id !== propertyId);
      localStorage.setItem('hq_wishlist', JSON.stringify(updated));
      el.innerHTML = '🤍'; el.classList.remove('active');
      showToast('Removed from wishlist');
    } else {
      await apiFetch(`/wishlist/${propertyId}`, { method: 'POST' });
      wishlist.push(propertyId);
      localStorage.setItem('hq_wishlist', JSON.stringify(wishlist));
      el.innerHTML = '❤️'; el.classList.add('active');
      showToast('Added to wishlist ❤️');
    }
  } catch (err) { showToast(err.message, 'error'); }
}

/* ===== SEARCH TABS ===== */
const searchTabs = document.querySelectorAll('.search-tab');
searchTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    searchTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ===== UPDATE NAV AUTH STATE ===== */
function updateNavAuth() {
  const loginBtn = document.getElementById('nav-login-btn');
  const userMenu = document.getElementById('nav-user-menu');
  if (!loginBtn) return;
  if (Auth.isLoggedIn()) {
    loginBtn.style.display = 'none';
    if (userMenu) { userMenu.style.display = 'flex'; userMenu.querySelector('.user-name').textContent = Auth.user()?.name || 'User'; }
  }
}
updateNavAuth();

/* ===== INIT AOS ===== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
});
