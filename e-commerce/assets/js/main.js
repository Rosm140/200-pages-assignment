/**
 * TravelGo - Enhanced Main JavaScript
 * Modern interactions, smooth animations, and enhanced UX
 */

(function() {
  'use strict';

  // ====================================
  // MOBILE NAVIGATION TOGGLE
  // ====================================
  
  const initMobileNav = () => {
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');
    const body = document.body;
    
    if (!navToggle || !siteNav) return;
    
    const toggleNav = () => {
      const isOpen = siteNav.classList.contains('open');
      
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    };
    
    const openNav = () => {
      siteNav.classList.add('open');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      body.style.overflow = 'hidden';
      
      // Focus first nav link
      setTimeout(() => {
        const firstLink = siteNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }, 100);
    };
    
    const closeNav = () => {
      siteNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      navToggle.focus();
    };
    
    // Event listeners
    navToggle.addEventListener('click', toggleNav);
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('open')) {
        closeNav();
      }
    });
    
    // Close when clicking nav links
    const navLinks = siteNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) closeNav();
      });
    });
    
    // Close on resize if open
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && siteNav.classList.contains('open')) {
        closeNav();
      }
    });
  };

  // ====================================
  // HEADER SCROLL EFFECTS
  // ====================================
  
  const initHeaderScroll = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add shadow on scroll
      if (currentScroll > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  };

  // ====================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ====================================
  
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // ====================================
  // SCROLL REVEAL ANIMATIONS
  // ====================================
  
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.card, .feature, .testimonial');
    
    if (!revealElements.length) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      
      revealObserver.observe(el);
    });
    
    // Add revealed class styles
    const style = document.createElement('style');
    style.textContent = `
      .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  };

  // ====================================
  // FORM HANDLING
  // ====================================
  
  const initFormHandling = () => {
    const contactForm = document.getElementById('quick-contact');
    if (!contactForm) return;
    
    const formMessage = document.getElementById('form-message');
    
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Basic validation
      if (!data.name || !data.email || !data.destination) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }
      
      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Success
        showFormMessage('Thank you! We\'ll get back to you within 24 hours.', 'success');
        this.reset();
        
      } catch (error) {
        // Error
        showFormMessage('Oops! Something went wrong. Please try again.', 'error');
      } finally {
        // Restore button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
    
    function showFormMessage(message, type) {
      if (!formMessage) return;
      
      formMessage.textContent = message;
      formMessage.className = `form-message ${type}`;
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }, 5000);
    }
  };

  // ====================================
  // IMAGE LAZY LOADING FALLBACK
  // ====================================
  
  const initLazyLoading = () => {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      return;
    }
    
    // Fallback for older browsers
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  };

  // ====================================
  // CARD HOVER EFFECTS (ENHANCED)
  // ====================================
  
  const initCardEffects = () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  };

  // ====================================
  // DYNAMIC YEAR IN FOOTER
  // ====================================
  
  const initDynamicYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  // ====================================
  // ACCESSIBILITY ENHANCEMENTS
  // ====================================
  
  const initAccessibility = () => {
    // Keyboard navigation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const link = card.querySelector('.card-link');
      if (link) {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      }
    });
    
    // Focus visible styles
    const focusableElements = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.querySelectorAll(focusableElements).forEach(el => {
      el.addEventListener('focus', function() {
        this.classList.add('has-focus');
      });
      
      el.addEventListener('blur', function() {
        this.classList.remove('has-focus');
      });
    });
  };

  // ====================================
  // PERFORMANCE: DEBOUNCE UTILITY
  // ====================================
  
  const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // ====================================
  // PARALLAX EFFECT (SUBTLE)
  // ====================================
  
  const initParallax = () => {
    const heroMedia = document.querySelector('.hero-media img');
    if (!heroMedia) return;
    
    const handleParallax = debounce(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      
      if (scrolled < window.innerHeight) {
        heroMedia.style.transform = `translateY(${rate}px)`;
      }
    }, 10);
    
    window.addEventListener('scroll', handleParallax);
  };

  // ====================================
  // TESTIMONIAL CAROUSEL (OPTIONAL)
  // ====================================
  
  const initTestimonialRotation = () => {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length <= 2) return; // Only if more than 2
    
    let currentIndex = 0;
    const rotationInterval = 5000; // 5 seconds
    
    const rotateTestimonials = () => {
      testimonials.forEach((testimonial, index) => {
        testimonial.style.display = index < 2 ? 'block' : 'none';
      });
    };
    
    // Initial display
    rotateTestimonials();
    
    // Auto-rotate (optional - can be removed if not desired)
    // setInterval(() => {
    //   currentIndex = (currentIndex + 1) % (testimonials.length - 1);
    //   rotateTestimonials();
    // }, rotationInterval);
  };

  // ====================================
  // INITIALIZE ALL FEATURES
  // ====================================

  const init = () => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  };
  
  const initAll = () => {
    initMobileNav();
    initHeaderScroll();
    initSmoothScroll();
    initScrollReveal();
    initFormHandling();
    initLazyLoading();
    initCardEffects();
    initDynamicYear();
    initAccessibility();
    initParallax();
    initTestimonialRotation();
    
    console.log('✨ TravelGo initialized successfully!');
  };
  
  // Start initialization
  init();

})();

// ====================================
// UTILITY: Console Welcome Message
// ====================================

console.log(
  '%c🌍 Welcome to TravelGo! %c\nBuilt with love by Rohit 🚀',
  'color: #FF6B35; font-size: 20px; font-weight: bold;',
  'color: #004E89; font-size: 14px;'
);
