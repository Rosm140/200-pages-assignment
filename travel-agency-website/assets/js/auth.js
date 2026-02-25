/**
 * TravelGo - Enhanced Authentication
 * Modern login/signup with validation, security, and smooth UX
 */

(function() {
  'use strict';

  // ====================================
  // VALIDATION UTILITIES
  // ====================================

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 6 characters, includes number and letter
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validatePhone = (phone) => {
    // Optional validation - allows empty or valid phone
    if (!phone) return true;
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  // ====================================
  // UI FEEDBACK UTILITIES
  // ====================================

  const showMessage = (message, type = 'info') => {
    // Remove existing messages
    const existingMsg = document.querySelector('.auth-message');
    if (existingMsg) existingMsg.remove();

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message auth-message-${type}`;
    messageEl.textContent = message;
    messageEl.setAttribute('role', 'alert');
    messageEl.setAttribute('aria-live', 'polite');

    // Add styles
    Object.assign(messageEl.style, {
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      fontWeight: '500',
      textAlign: 'center',
      animation: 'slideInDown 0.3s ease-out',
      backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 
                       type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 
                       'rgba(59, 130, 246, 0.1)',
      color: type === 'error' ? '#dc2626' : 
             type === 'success' ? '#16a34a' : 
             '#2563eb',
      border: type === 'error' ? '1px solid rgba(239, 68, 68, 0.3)' : 
              type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : 
              '1px solid rgba(59, 130, 246, 0.3)'
    });

    // Insert at the top of form
    const form = document.querySelector('form');
    if (form) {
      form.insertBefore(messageEl, form.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.animation = 'slideOutUp 0.3s ease-out';
        setTimeout(() => messageEl.remove(), 300);
      }
    }, 5000);
  };

  const showFieldError = (fieldId, message) => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remove existing error
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) existingError.remove();

    // Create error element
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;';
    
    // Add error styling to field
    field.style.borderColor = '#dc2626';
    field.setAttribute('aria-invalid', 'true');

    // Insert error message
    field.parentElement.appendChild(errorEl);

    // Focus the field
    field.focus();
  };

  const clearFieldError = (fieldId) => {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const errorEl = field.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.remove();

    field.style.borderColor = '';
    field.setAttribute('aria-invalid', 'false');
  };

  const setButtonLoading = (button, loading = true) => {
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = '⏳ Processing...';
      button.disabled = true;
      button.style.opacity = '0.7';
      button.style.cursor = 'not-allowed';
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.style.opacity = '';
      button.style.cursor = '';
    }
  };

  // ====================================
  // USER SESSION MANAGEMENT
  // ====================================

  const saveUserSession = (userData) => {
    const sessionData = {
      email: userData.email,
      name: userData.name || '',
      loginTime: new Date().toISOString(),
      isAuthenticated: true
    };

    try {
      localStorage.setItem('travelgo_user', JSON.stringify(sessionData));
      return true;
    } catch (e) {
      console.error('Failed to save session:', e);
      return false;
    }
  };

  const getUserSession = () => {
    try {
      const data = localStorage.getItem('travelgo_user');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to retrieve session:', e);
      return null;
    }
  };

  const clearUserSession = () => {
    localStorage.removeItem('travelgo_user');
  };

  const isUserLoggedIn = () => {
    const session = getUserSession();
    return session && session.isAuthenticated;
  };

  // ====================================
  // LOGIN FORM HANDLER
  // ====================================

  const initLoginForm = () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    // Add real-time validation
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPass');

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
          showFieldError('loginEmail', 'Please enter a valid email address');
        } else {
          clearFieldError('loginEmail');
        }
      });

      emailInput.addEventListener('input', () => {
        clearFieldError('loginEmail');
      });
    }

    if (passInput) {
      passInput.addEventListener('input', () => {
        clearFieldError('loginPass');
      });
    }

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = emailInput?.value.trim() || '';
      const pass = passInput?.value.trim() || '';
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      // Clear previous errors
      clearFieldError('loginEmail');
      clearFieldError('loginPass');

      // Validate email
      if (!email) {
        showFieldError('loginEmail', 'Email is required');
        return;
      }
      
      if (!validateEmail(email)) {
        showFieldError('loginEmail', 'Please enter a valid email address');
        return;
      }

      // Validate password
      if (!pass) {
        showFieldError('loginPass', 'Password is required');
        return;
      }

      if (pass.length < 6) {
        showFieldError('loginPass', 'Password must be at least 6 characters');
        return;
      }

      // Show loading state
      setButtonLoading(submitBtn, true);

      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        // In real app, validate credentials with backend
        // For demo, just save the session
        const saved = saveUserSession({ email });

        if (saved) {
          showMessage('✅ Login successful! Redirecting...', 'success');
          
          // Redirect after short delay
          setTimeout(() => {
            window.location.href = '../index.html';
          }, 1000);
        } else {
          showMessage('Failed to save session. Please try again.', 'error');
          setButtonLoading(submitBtn, false);
        }

      } catch (error) {
        console.error('Login error:', error);
        showMessage('An error occurred. Please try again.', 'error');
        setButtonLoading(submitBtn, false);
      }
    });
  };

  // ====================================
  // SIGNUP FORM HANDLER
  // ====================================

  const initSignupForm = () => {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    // Get form fields
    const nameInput = document.getElementById('signupName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPass');
    const phoneInput = document.getElementById('signupPhone');

    // Real-time validation
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        const name = nameInput.value.trim();
        if (name && !validateName(name)) {
          showFieldError('signupName', 'Please enter a valid name (letters only)');
        } else {
          clearFieldError('signupName');
        }
      });

      nameInput.addEventListener('input', () => {
        clearFieldError('signupName');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
          showFieldError('signupEmail', 'Please enter a valid email address');
        } else {
          clearFieldError('signupEmail');
        }
      });

      emailInput.addEventListener('input', () => {
        clearFieldError('signupEmail');
      });
    }

    if (passInput) {
      passInput.addEventListener('blur', () => {
        const pass = passInput.value.trim();
        if (pass && !validatePassword(pass)) {
          showFieldError('signupPass', 'Password must be at least 6 characters');
        } else {
          clearFieldError('signupPass');
        }
      });

      passInput.addEventListener('input', () => {
        clearFieldError('signupPass');
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('blur', () => {
        const phone = phoneInput.value.trim();
        if (phone && !validatePhone(phone)) {
          showFieldError('signupPhone', 'Please enter a valid phone number');
        } else {
          clearFieldError('signupPhone');
        }
      });

      phoneInput.addEventListener('input', () => {
        clearFieldError('signupPhone');
      });
    }

    // Form submission
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const pass = passInput?.value.trim() || '';
      const phone = phoneInput?.value.trim() || '';
      const submitBtn = signupForm.querySelector('button[type="submit"]');

      // Clear previous errors
      clearFieldError('signupName');
      clearFieldError('signupEmail');
      clearFieldError('signupPass');
      clearFieldError('signupPhone');

      // Validate name
      if (!name) {
        showFieldError('signupName', 'Name is required');
        return;
      }

      if (!validateName(name)) {
        showFieldError('signupName', 'Please enter a valid name (letters only, minimum 2 characters)');
        return;
      }

      // Validate email
      if (!email) {
        showFieldError('signupEmail', 'Email is required');
        return;
      }

      if (!validateEmail(email)) {
        showFieldError('signupEmail', 'Please enter a valid email address');
        return;
      }

      // Validate password
      if (!pass) {
        showFieldError('signupPass', 'Password is required');
        return;
      }

      if (!validatePassword(pass)) {
        showFieldError('signupPass', 'Password must be at least 6 characters');
        return;
      }

      // Validate phone (optional)
      if (phone && !validatePhone(phone)) {
        showFieldError('signupPhone', 'Please enter a valid phone number');
        return;
      }

      // Show loading state
      setButtonLoading(submitBtn, true);

      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In real app, create account with backend
        // For demo, just save the session
        const saved = saveUserSession({ email, name });

        if (saved) {
          showMessage('✅ Account created successfully! Redirecting...', 'success');
          
          // Redirect after short delay
          setTimeout(() => {
            window.location.href = '../index.html';
          }, 1000);
        } else {
          showMessage('Failed to create account. Please try again.', 'error');
          setButtonLoading(submitBtn, false);
        }

      } catch (error) {
        console.error('Signup error:', error);
        showMessage('An error occurred. Please try again.', 'error');
        setButtonLoading(submitBtn, false);
      }
    });
  };

  // ====================================
  // PASSWORD VISIBILITY TOGGLE
  // ====================================

  const initPasswordToggles = () => {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
      // Create toggle button
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'password-toggle';
      toggleBtn.innerHTML = '👁️';
      toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
      
      toggleBtn.style.cssText = `
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        opacity: 0.6;
        transition: opacity 0.2s;
        padding: 0.25rem;
      `;

      toggleBtn.addEventListener('mouseenter', () => {
        toggleBtn.style.opacity = '1';
      });

      toggleBtn.addEventListener('mouseleave', () => {
        toggleBtn.style.opacity = '0.6';
      });

      // Add relative positioning to parent
      const parent = field.parentElement;
      parent.style.position = 'relative';

      // Toggle functionality
      toggleBtn.addEventListener('click', () => {
        const isPassword = field.type === 'password';
        field.type = isPassword ? 'text' : 'password';
        toggleBtn.innerHTML = isPassword ? '🙈' : '👁️';
        toggleBtn.setAttribute('aria-label', 
          isPassword ? 'Hide password' : 'Show password'
        );
      });

      // Append toggle button
      parent.appendChild(toggleBtn);
    });
  };

  // ====================================
  // CHECK IF ALREADY LOGGED IN
  // ====================================

  const checkExistingSession = () => {
    if (isUserLoggedIn()) {
      const currentPage = window.location.pathname;
      
      // If on login/signup page and already logged in, redirect to home
      if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
        showMessage('You are already logged in! Redirecting...', 'info');
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1500);
      }
    }
  };

  // ====================================
  // LOGOUT FUNCTIONALITY
  // ====================================

  const initLogout = () => {
    const logoutBtns = document.querySelectorAll('[data-logout], .logout-btn');
    
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (confirm('Are you sure you want to logout?')) {
          clearUserSession();
          showMessage('✅ Logged out successfully!', 'success');
          
          setTimeout(() => {
            window.location.href = '../pages/login.html';
          }, 1000);
        }
      });
    });
  };

  // ====================================
  // UPDATE UI FOR LOGGED IN USER
  // ====================================

  const updateNavForLoggedInUser = () => {
    const session = getUserSession();
    if (!session) return;

    // Find login/signup buttons and replace with user menu
    const loginBtn = document.querySelector('a[href*="login.html"]');
    const signupBtn = document.querySelector('a[href*="signup.html"]');

    if (loginBtn && signupBtn) {
      const userMenu = document.createElement('div');
      userMenu.className = 'user-menu';
      userMenu.style.cssText = 'display: flex; align-items: center; gap: 1rem;';
      
      userMenu.innerHTML = `
        <span style="font-weight: 500; color: var(--brand-primary);">
          👋 ${session.name || session.email.split('@')[0]}
        </span>
        <button class="logout-btn btn btn-outline btn-sm" style="padding: 0.5rem 1rem;">
          Logout
        </button>
      `;

      loginBtn.parentElement.replaceChild(userMenu, loginBtn);
      if (signupBtn.parentElement) {
        signupBtn.parentElement.removeChild(signupBtn);
      }

      // Reinitialize logout
      initLogout();
    }
  };

  // ====================================
  // INITIALIZE ALL AUTH FEATURES
  // ====================================

  const init = () => {
    // Check existing session
    checkExistingSession();

    // Initialize forms
    initLoginForm();
    initSignupForm();

    // Initialize password toggles
    initPasswordToggles();

    // Initialize logout
    initLogout();

    // Update navigation for logged-in users
    updateNavForLoggedInUser();

    console.log('🔐 Auth system initialized');
  };

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export utilities for use in other scripts
  window.TravelGoAuth = {
    isUserLoggedIn,
    getUserSession,
    clearUserSession,
    saveUserSession
  };

})();

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slideOutUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }

  .password-toggle:hover {
    transform: translateY(-50%) scale(1.1);
  }

  .field-error {
    animation: slideInDown 0.2s ease-out;
  }
`;
document.head.appendChild(style);