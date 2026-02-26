/**
 * ShopHub - E‑commerce Interactions
 * Lightweight cart, banner, wishlist and UX helpers
 */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    CART_COUNT: 'shophub_cart_count',
    BANNER_HIDDEN: 'shophub_banner_hidden',
  };

  const getCartCount = () => {
    try {
      const value = localStorage.getItem(STORAGE_KEYS.CART_COUNT);
      return value ? parseInt(value, 10) || 0 : 0;
    } catch {
      return 0;
    }
  };

  const setCartCount = (count) => {
    const safeCount = Math.max(0, count | 0);
    const badgeEls = document.querySelectorAll('.cart-count');
    badgeEls.forEach((el) => {
      el.textContent = safeCount.toString();
    });
    try {
      localStorage.setItem(STORAGE_KEYS.CART_COUNT, String(safeCount));
    } catch {
      // ignore storage errors
    }
  };

  const incrementCart = (amount = 1) => {
    const next = getCartCount() + amount;
    setCartCount(next);
  };

  const initCartButtons = () => {
    const buttons = document.querySelectorAll('.btn-add-cart');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const productName =
          btn.getAttribute('data-product') || btn.textContent?.trim() || 'Item';
        incrementCart(1);
        showToast(`${productName} added to cart`);
      });
    });
  };

  const showToast = (message) => {
    let container = document.querySelector('.shophub-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'shophub-toast-container';
      container.style.cssText =
        'position:fixed;right:1.5rem;bottom:1.5rem;z-index:1200;display:flex;flex-direction:column;gap:0.75rem;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'shophub-toast';
    toast.textContent = message;
    toast.style.cssText =
      'background:rgba(17,24,39,0.95);color:#fff;padding:0.75rem 1.25rem;border-radius:999px;font-size:0.9rem;box-shadow:0 10px 30px rgba(0,0,0,0.3);transform:translateY(10px);opacity:0;transition:opacity .2s ease,transform .2s ease;';

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 200);
    }, 1800);
  };

  const initTopBanner = () => {
    const banner = document.querySelector('.top-banner');
    const closeBtn = document.querySelector('.top-banner .close-banner');
    if (!banner || !closeBtn) return;

    try {
      if (localStorage.getItem(STORAGE_KEYS.BANNER_HIDDEN) === '1') {
        banner.style.display = 'none';
        return;
      }
    } catch {
      // ignore storage read errors
    }

    closeBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      try {
        localStorage.setItem(STORAGE_KEYS.BANNER_HIDDEN, '1');
      } catch {
        // ignore storage errors
      }
    });
  };

  const initWishlistButtons = () => {
    const buttons = document.querySelectorAll('.wishlist-btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isActive = btn.classList.toggle('active');
        btn.textContent = isActive ? '♥' : '♡';
      });
    });
  };

  const initCountdowns = () => {
    const countdownEls = document.querySelectorAll('.countdown');
    if (!countdownEls.length) return;

    countdownEls.forEach((el) => {
      let remaining = 2 * 60 * 60 + 45 * 60 + 30; // 02:45:30 default

      const format = (seconds) => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
      };

      el.textContent = format(remaining);

      const interval = setInterval(() => {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(interval);
          el.textContent = 'Ended';
          return;
        }
        el.textContent = format(remaining);
      }, 1000);
    });
  };

  const init = () => {
    setCartCount(getCartCount());
    initTopBanner();
    initCartButtons();
    initWishlistButtons();
    initCountdowns();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

