/**
 * Automated Page Counter System
 * Scans project folders and displays real-time page counts
 */

// Configuration: Define your websites and their folders
const websiteConfig = [
    {
        id: 1,
        name: "TravelGo",
        folder: "travel-agency-website",
        icon: "✈️",
        description: "Modern travel agency with booking system",
        techStack: ["HTML5", "CSS3", "JavaScript", "Responsive"],
        features: [
            "User authentication system",
            "Travel packages catalog",
            "Booking forms & gallery",
            "Blog & FAQ sections"
        ],
        expectedPages: 10,
        status: "completed"
    },
    {
        id: 2,
        name: "ShopHub",
        folder: "e-commerce",
        icon: "🛒",
        description: "Full-featured e-commerce platform",
        techStack: ["HTML5", "CSS3", "JavaScript", "Cart System"],
        features: [
            "Product catalog & filters",
            "Shopping cart functionality",
            "User accounts & wishlist",
            "Checkout & payment UI"
        ],
        expectedPages: 20,
        status: "in-progress"
    },
    {
        id: 3,
        name: "FoodiePlace",
        folder: "restaurant",
        icon: "🍽️",
        description: "Restaurant with online ordering",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Digital menu & categories",
            "Online ordering system",
            "Table reservations",
            "Chef specials & gallery"
        ],
        expectedPages: 12,
        status: "planned"
    },
    {
        id: 4,
        name: "DevFolio",
        folder: "portfolio",
        icon: "💼",
        description: "Professional developer portfolio",
        techStack: ["HTML5", "CSS3", "JavaScript", "Animations"],
        features: [
            "Project showcase",
            "Skills & experience",
            "Contact form",
            "Blog & testimonials"
        ],
        expectedPages: 8,
        status: "planned"
    },
    {
        id: 5,
        name: "HomeQuest",
        folder: "real-estate",
        icon: "🏠",
        description: "Real estate property listings",
        techStack: ["HTML5", "CSS3", "JavaScript", "Search"],
        features: [
            "Property listings & filters",
            "Advanced search",
            "Agent profiles",
            "Virtual tours"
        ],
        expectedPages: 18,
        status: "planned"
    },
    {
        id: 6,
        name: "EduLearn",
        folder: "education",
        icon: "🎓",
        description: "Online learning platform",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Course catalog",
            "Student dashboard",
            "Video lessons",
            "Quizzes & certificates"
        ],
        expectedPages: 22,
        status: "planned"
    },
    {
        id: 7,
        name: "FitZone",
        folder: "fitness",
        icon: "💪",
        description: "Gym & fitness center",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Class schedules",
            "Trainer profiles",
            "Membership plans",
            "BMI calculator"
        ],
        expectedPages: 14,
        status: "planned"
    },
    {
        id: 8,
        name: "TechBlog",
        folder: "blog",
        icon: "📰",
        description: "Technology news & articles",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Article listings",
            "Categories & tags",
            "Author profiles",
            "Comments system UI"
        ],
        expectedPages: 25,
        status: "planned"
    },
    {
        id: 9,
        name: "MediCare",
        folder: "healthcare",
        icon: "🏥",
        description: "Hospital & healthcare services",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Doctor profiles",
            "Appointment booking",
            "Services & departments",
            "Health tips blog"
        ],
        expectedPages: 16,
        status: "planned"
    },
    {
        id: 10,
        name: "EventPro",
        folder: "events",
        icon: "🎉",
        description: "Event planning & management",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Event listings",
            "Ticket booking",
            "Venue showcase",
            "Gallery & reviews"
        ],
        expectedPages: 15,
        status: "planned"
    },
    {
        id: 11,
        name: "LensArt",
        folder: "photography",
        icon: "📸",
        description: "Photography portfolio",
        techStack: ["HTML5", "CSS3", "JavaScript", "Gallery"],
        features: [
            "Photo galleries",
            "Service packages",
            "Booking system",
            "Client testimonials"
        ],
        expectedPages: 10,
        status: "planned"
    },
    {
        id: 12,
        name: "SoundWave",
        folder: "music",
        icon: "🎵",
        description: "Music streaming platform",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Music player UI",
            "Playlists & albums",
            "Artist profiles",
            "Search & discovery"
        ],
        expectedPages: 18,
        status: "planned"
    },
    {
        id: 13,
        name: "StyleHub",
        folder: "fashion",
        icon: "👗",
        description: "Fashion e-commerce",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Product catalog",
            "Size guides",
            "Lookbook & trends",
            "Shopping cart"
        ],
        expectedPages: 17,
        status: "planned"
    },
    {
        id: 14,
        name: "GameVerse",
        folder: "gaming",
        icon: "🎮",
        description: "Gaming community platform",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Game library",
            "User profiles",
            "Leaderboards",
            "Community forums"
        ],
        expectedPages: 19,
        status: "planned"
    },
    {
        id: 15,
        name: "BizCorp",
        folder: "corporate",
        icon: "🏢",
        description: "Corporate business website",
        techStack: ["HTML5", "CSS3", "JavaScript"],
        features: [
            "Company profile",
            "Services showcase",
            "Team & careers",
            "Client portfolio"
        ],
        expectedPages: 11,
        status: "planned"
    }
];

/**
 * Count HTML files in a folder (simulated - client-side can't access filesystem)
 * In production, this would need a backend API
 */
async function countPagesInFolder(folderPath) {
    try {
        // Try to fetch index.html to see if folder exists
        const response = await fetch(`${folderPath}/index.html`, { method: 'HEAD' });
        
        if (response.ok) {
            // Folder exists, return manual count for now
            // In real implementation, this would call a backend API
            return await getManualPageCount(folderPath);
        }
        return 0;
    } catch (error) {
        return 0;
    }
}

/**
 * Manual page counting (fallback method)
 * Attempts to load common page names
 */
async function getManualPageCount(folderPath) {
    const commonPages = [
        'index.html',
        'about.html',
        'contact.html',
        'services.html',
        'products.html',
        'gallery.html',
        'blog.html',
        'faq.html',
        'login.html',
        'signup.html',
        'terms.html',
        'privacy.html'
    ];
    
    const pagesFolderPages = [
        'pages/about.html',
        'pages/packages.html',
        'pages/destinations.html',
        'pages/blog.html',
        'pages/gallery.html',
        'pages/faq.html',
        'pages/contact.html',
        'pages/login.html',
        'pages/signup.html'
    ];
    
    let count = 0;
    const allPages = [...commonPages, ...pagesFolderPages];
    
    for (const page of allPages) {
        try {
            const response = await fetch(`${folderPath}/${page}`, { method: 'HEAD' });
            if (response.ok) {
                count++;
            }
        } catch (error) {
            // Page doesn't exist, continue
        }
    }
    
    return count;
}

/**
 * Scan all websites and update counts
 */
async function scanAllWebsites() {
    console.log('🔍 Scanning websites for page counts...');
    
    const results = [];
    let totalPages = 0;
    let completedWebsites = 0;
    
    for (const website of websiteConfig) {
        const pageCount = await countPagesInFolder(website.folder);
        
        const result = {
            ...website,
            actualPages: pageCount,
            isLive: pageCount > 0,
            progress: Math.round((pageCount / website.expectedPages) * 100)
        };
        
        if (pageCount >= website.expectedPages) {
            result.status = 'completed';
            completedWebsites++;
        } else if (pageCount > 0) {
            result.status = 'in-progress';
        }
        
        totalPages += pageCount;
        results.push(result);
        
        console.log(`✓ ${website.name}: ${pageCount} pages found`);
    }
    
    return {
        websites: results,
        totalPages,
        completedWebsites,
        totalWebsites: websiteConfig.length
    };
}

/**
 * Update the UI with scan results
 */
function updateUI(scanResults) {
    // Update stats
    document.getElementById('totalPages').textContent = scanResults.totalPages;
    document.getElementById('completedCount').textContent = 
        `${scanResults.completedWebsites}/${scanResults.totalWebsites}`;
    
    // Update last scan time
    const lastScanElement = document.getElementById('lastScan');
    if (lastScanElement) {
        const now = new Date();
        lastScanElement.textContent = now.toLocaleTimeString();
    }
    
    // Update progress bar if exists
    const progressBar = document.getElementById('overallProgress');
    if (progressBar) {
        const progress = (scanResults.totalPages / 215) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }
    
    console.log('✅ UI updated with latest counts');
}

/**
 * Generate HTML for a website card
 */
function generateWebsiteCard(website) {
    const isLive = website.actualPages > 0;
    const isCompleted = website.status === 'completed';
    
    return `
        <div class="website-card ${isCompleted ? 'completed' : ''}" data-website-id="${website.id}">
            <div class="website-header ${isCompleted ? 'completed-header' : ''}">
                <span class="website-number">${String(website.id).padStart(2, '0')}</span>
                <span class="website-icon">${website.icon}</span>
                <h3 class="website-title">${website.name}</h3>
                <p class="website-description">${website.description}</p>
            </div>
            <div class="website-body">
                <div class="website-meta">
                    <span class="meta-badge pages">📄 ${website.actualPages}/${website.expectedPages} Pages</span>
                    ${isCompleted ? '<span class="meta-badge status-live">✓ LIVE</span>' : 
                      isLive ? '<span class="meta-badge">🔨 In Progress</span>' : 
                      '<span class="meta-badge">📅 Planned</span>'}
                </div>
                ${isLive ? `
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${website.progress}%">
                            ${website.progress}%
                        </div>
                    </div>
                ` : ''}
                <div class="tech-stack">
                    ${website.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <ul class="website-features">
                    ${website.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                ${isLive ? 
                    `<a href="${website.folder}/index.html" class="website-link ${isCompleted ? 'live-link' : ''}">
                        ${isCompleted ? '🚀 View Live Website' : '👁️ Preview'} →
                    </a>` :
                    `<a href="#" class="website-link disabled" onclick="return false;">Coming Soon...</a>`
                }
            </div>
        </div>
    `;
}

/**
 * Render all website cards
 */
function renderWebsites(scanResults) {
    const grid = document.getElementById('websitesGrid');
    if (!grid) return;
    
    grid.innerHTML = scanResults.websites
        .map(website => generateWebsiteCard(website))
        .join('');
}

/**
 * Initialize the page counter system
 */
async function initPageCounter() {
    console.log('🚀 Initializing automated page counter...');
    
    // Show loading state
    const statsElement = document.getElementById('totalPages');
    if (statsElement) {
        statsElement.innerHTML = '<span class="loading">...</span>';
    }
    
    // Scan all websites
    const scanResults = await scanAllWebsites();
    
    // Update UI
    updateUI(scanResults);
    renderWebsites(scanResults);
    
    // Log summary
    console.log('📊 Scan Summary:');
    console.log(`   Total Pages: ${scanResults.totalPages}/215`);
    console.log(`   Completed: ${scanResults.completedWebsites}/${scanResults.totalWebsites}`);
    console.log(`   In Progress: ${scanResults.websites.filter(w => w.status === 'in-progress').length}`);
    console.log('✅ Page counter initialized successfully!');
}

/**
 * Auto-refresh every 30 seconds
 */
function startAutoRefresh(intervalMinutes = 0.5) {
    const intervalMs = intervalMinutes * 60 * 1000;
    
    setInterval(async () => {
        console.log('🔄 Auto-refreshing page counts...');
        const scanResults = await scanAllWebsites();
        updateUI(scanResults);
        renderWebsites(scanResults);
    }, intervalMs);
    
    console.log(`⏰ Auto-refresh enabled (every ${intervalMinutes} minutes)`);
}

/**
 * Manual refresh button handler
 */
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '🔄 Scanning...';
            
            const scanResults = await scanAllWebsites();
            updateUI(scanResults);
            renderWebsites(scanResults);
            
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 Refresh Counts';
            
            // Show success feedback
            const feedback = document.createElement('div');
            feedback.className = 'refresh-feedback';
            feedback.textContent = '✅ Counts updated!';
            refreshBtn.parentElement.appendChild(feedback);
            
            setTimeout(() => feedback.remove(), 3000);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPageCounter();
        setupRefreshButton();
        startAutoRefresh(0.5); // Refresh every 30 seconds
    });
} else {
    initPageCounter();
    setupRefreshButton();
    startAutoRefresh(0.5);
}

// Export for external use
window.PageCounter = {
    scan: scanAllWebsites,
    config: websiteConfig,
    refresh: initPageCounter
};
