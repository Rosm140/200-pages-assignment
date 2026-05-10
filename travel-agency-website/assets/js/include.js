/**
 * TravelGo - Enhanced Component Loader (FIXED)
 * Automatically detects correct paths for header/footer loading
 */

(function() {
  'use strict';

  // ====================================
  // AUTO-DETECT CORRECT PATH
  // ====================================

  const detectComponentPath = () => {
    const currentPath = window.location.pathname;
    const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
    
    // If we're in root directory (index.html)
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
      return './components/';
    }
    
    // If we're in a subdirectory (pages folder)
    if (currentDir.includes('/pages')) {
      return '../components/';
    }
    
    // Default fallback
    return '../components/';
  };

  // ====================================
  // CONFIGURATION
  // ====================================

  const config = {
    componentsPath: detectComponentPath(),
    timeout: 5000,
    retryAttempts: 2,
    showLoadingState: true,
    components: {
      header: 'header.html',
      footer: 'footer.html'
    }
  };

  console.log('🔍 Detected component path:', config.componentsPath);

  // ====================================
  // LOADING STATE UTILITIES
  // ====================================

  const createLoadingPlaceholder = (height = '80px') => {
    const placeholder = document.createElement('div');
    placeholder.className = 'component-loading';
    placeholder.style.cssText = `
      height: ${height};
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
      margin: 0.5rem 0;
    `;
    
    return placeholder;
  };

  const createErrorPlaceholder = (message, file) => {
    const placeholder = document.createElement('div');
    placeholder.className = 'component-error';
    placeholder.style.cssText = `
      padding: 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #dc2626;
      text-align: center;
      font-size: 0.9rem;
      margin: 0.5rem 0;
    `;
    placeholder.innerHTML = `
      <strong>⚠️ Error Loading Component</strong>
      <p style="margin: 0.5rem 0 0 0; opacity: 0.8;">${message}</p>
      <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">File: ${file}</p>
      <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem;">Path: ${config.componentsPath}</p>
    `;
    
    return placeholder;
  };

  // ====================================
  // FETCH WITH TIMEOUT
  // ====================================

  const fetchWithTimeout = (url, timeout = 5000) => {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeout)
      )
    ]);
  };

  // ====================================
  // COMPONENT LOADER WITH RETRY
  // ====================================

  const loadComponentWithRetry = async (url, attempts = 1) => {
    try {
      console.log(`📥 Attempting to load: ${url} (attempt ${attempts})`);
      
      const response = await fetchWithTimeout(url, config.timeout);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response received');
      }
      
      console.log(`✅ Successfully loaded: ${url}`);
      return text;
      
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempts} failed for ${url}:`, error.message);
      
      if (attempts < config.retryAttempts) {
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempts) * 500;
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return loadComponentWithRetry(url, attempts + 1);
      }
      
      throw error;
    }
  };

  // ====================================
  // MAIN COMPONENT LOADER
  // ====================================

  const loadComponent = async (selector, file, options = {}) => {
    const element = document.querySelector(selector);
    
    if (!element) {
      console.warn(`❌ Element not found: ${selector}`);
      return false;
    }

    const {
      showLoading = config.showLoadingState,
      loadingHeight = selector === '#header' ? '80px' : '200px',
      fallback = null
    } = options;

    // Show loading state
    if (showLoading) {
      const loadingPlaceholder = createLoadingPlaceholder(loadingHeight);
      element.appendChild(loadingPlaceholder);
    }

    try {
      // Try multiple path variations
      const pathsToTry = [
        `${config.componentsPath}${file}`,
        `./components/${file}`,
        `../components/${file}`,
        `./${file}`,
        `../${file}`
      ];

      let html = null;
      let successUrl = null;

      for (const url of pathsToTry) {
        try {
          console.log(`🔍 Trying path: ${url}`);
          html = await loadComponentWithRetry(url, 1);
          successUrl = url;
          break;
        } catch (err) {
          console.log(`❌ Failed: ${url}`);
          continue;
        }
      }

      if (!html) {
        throw new Error(`Could not load ${file} from any path`);
      }
      
      // Insert HTML
      element.innerHTML = html;
      
      // Dispatch custom event
      element.dispatchEvent(new CustomEvent('componentLoaded', {
        detail: { selector, file, success: true, url: successUrl }
      }));
      
      console.log(`✅ Component loaded successfully: ${file}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Failed to load component ${file}:`, error);
      
      // Show error or fallback
      if (fallback) {
        element.innerHTML = fallback;
      } else {
        const errorPlaceholder = createErrorPlaceholder(error.message, file);
        element.innerHTML = '';
        element.appendChild(errorPlaceholder);
      }
      
      // Dispatch error event
      element.dispatchEvent(new CustomEvent('componentError', {
        detail: { selector, file, error: error.message }
      }));
      
      return false;
    }
  };

  // ====================================
  // LOAD MULTIPLE COMPONENTS
  // ====================================

  const loadComponents = async (components) => {
    const loadPromises = Object.entries(components).map(([selector, file]) => {
      return loadComponent(selector, file);
    });
    
    try {
      const results = await Promise.allSettled(loadPromises);
      const succeeded = results.filter(r => r.status === 'fulfilled' && r.value).length;
      const failed = results.length - succeeded;
      
      console.log(`📦 Components loaded: ${succeeded}/${results.length} (${failed} failed)`);
      
      return results;
    } catch (error) {
      console.error('Error loading components:', error);
      return [];
    }
  };

  // ====================================
  // INITIALIZE SCRIPTS AFTER LOAD
  // ====================================

  const initializeComponentScripts = () => {
    console.log('🔧 Initializing component scripts...');
    
    // Re-initialize navigation after header loads
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav');
    
    if (navToggle && siteNav) {
      // Navigation toggle is handled in main.js
      // Just trigger a custom event to let main.js know components are loaded
      document.dispatchEvent(new CustomEvent('componentsReady'));
    }

    // Initialize any footer scripts
    const footerYear = document.getElementById('footer-year');
    if (footerYear) {
      footerYear.textContent = new Date().getFullYear();
    }

    // Initialize newsletter form if exists
    const newsletterForm = document.querySelector('.site-footer form');
    if (newsletterForm && !newsletterForm.dataset.initialized) {
      newsletterForm.dataset.initialized = 'true';
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        alert(`Thanks for subscribing! We'll send travel inspiration to ${email}`);
        this.reset();
      });
    }

    console.log('✅ Component scripts initialized');
  };

  // ====================================
  // ERROR RECOVERY
  // ====================================

  const setupErrorRecovery = () => {
    // Listen for component errors
    document.addEventListener('componentError', (e) => {
      const { selector, file } = e.detail;
      
      // Add retry button
      const element = document.querySelector(selector);
      if (element) {
        const retryBtn = document.createElement('button');
        retryBtn.textContent = '🔄 Retry Loading';
        retryBtn.className = 'btn btn-sm btn-outline';
        retryBtn.style.cssText = 'margin-top: 0.5rem;';
        
        retryBtn.addEventListener('click', async () => {
          retryBtn.textContent = '⏳ Loading...';
          retryBtn.disabled = true;
          
          const success = await loadComponent(selector, file);
          
          if (success) {
            initializeComponentScripts();
          } else {
            retryBtn.textContent = '🔄 Retry Loading';
            retryBtn.disabled = false;
          }
        });
        
        element.querySelector('.component-error')?.appendChild(retryBtn);
      }
    });
  };

  // ====================================
  // MAIN INITIALIZATION
  // ====================================

  const init = async () => {
    console.log('🚀 TravelGo Component Loader starting...');
    console.log('📍 Current path:', window.location.pathname);
    console.log('📂 Component path:', config.componentsPath);

    // Setup error recovery
    setupErrorRecovery();

    // Load main components
    const componentsToLoad = {
      '#header': config.components.header,
      '#footer': config.components.footer
    };

    // Load all components
    await loadComponents(componentsToLoad);

    // Initialize scripts after components are loaded
    setTimeout(() => {
      initializeComponentScripts();
    }, 100);

    console.log('✅ Component loader initialized');
  };

  // ====================================
  // AUTO-INITIALIZE ON DOM READY
  // ====================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ====================================
  // EXPORT PUBLIC API
  // ====================================

  window.ComponentLoader = {
    loadComponent,
    loadComponents,
    config,
    reload: init
  };

})();

// ====================================
// ADD SHIMMER ANIMATION
// ====================================

const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .component-loading {
    margin: 1rem 0;
  }

  .component-error {
    margin: 1rem;
  }

  .component-error button {
    transition: all 0.3s ease;
  }

  .component-error button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;
document.head.appendChild(style);