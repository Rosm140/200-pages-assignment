/**
 * Page Counter System - FIXED VERSION
 * Shows real page counts with manual configuration
 */

// ⚙️ MANUAL PAGE COUNT - UPDATE THIS AS YOU ADD PAGES
const manualPageCounts = {
    'travel-agency-website': 10,     // ✅ TravelGo - COMPLETED
    'e-commerce': 0,
    'restaurant': 0,
    'portfolio': 0,
    'real-estate': 0,
    'education': 0,
    'fitness': 0,
    'blog': 0,
    'healthcare': 0,
    'events': 0,
    'photography': 0,
    'music': 0,
    'fashion': 0,
    'gaming': 0,
    'corporate': 0
};

// Website Configuration
const websiteConfig = [
    { id: 1, name: "TravelGo", folder: "travel-agency-website", icon: "✈️", description: "Modern travel agency with booking system", techStack: ["HTML5", "CSS3", "JavaScript", "Responsive"], features: ["User authentication system", "Travel packages catalog", "Booking forms & gallery", "Blog & FAQ sections"], expectedPages: 10 },
    { id: 2, name: "ShopHub", folder: "e-commerce", icon: "🛒", description: "Full-featured e-commerce platform", techStack: ["HTML5", "CSS3", "JavaScript", "Cart System"], features: ["Product catalog & filters", "Shopping cart functionality", "User accounts & wishlist", "Checkout & payment UI"], expectedPages: 20 },
    { id: 3, name: "FoodiePlace", folder: "restaurant", icon: "🍽️", description: "Restaurant with online ordering", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Digital menu & categories", "Online ordering system", "Table reservations", "Chef specials & gallery"], expectedPages: 12 },
    { id: 4, name: "DevFolio", folder: "portfolio", icon: "💼", description: "Professional developer portfolio", techStack: ["HTML5", "CSS3", "JavaScript", "Animations"], features: ["Project showcase", "Skills & experience", "Contact form", "Blog & testimonials"], expectedPages: 8 },
    { id: 5, name: "HomeQuest", folder: "real-estate", icon: "🏠", description: "Real estate property listings", techStack: ["HTML5", "CSS3", "JavaScript", "Search"], features: ["Property listings & filters", "Advanced search", "Agent profiles", "Virtual tours"], expectedPages: 18 },
    { id: 6, name: "EduLearn", folder: "education", icon: "🎓", description: "Online learning platform", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Course catalog", "Student dashboard", "Video lessons", "Quizzes & certificates"], expectedPages: 22 },
    { id: 7, name: "FitZone", folder: "fitness", icon: "💪", description: "Gym & fitness center", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Class schedules", "Trainer profiles", "Membership plans", "BMI calculator"], expectedPages: 14 },
    { id: 8, name: "TechBlog", folder: "blog", icon: "📰", description: "Technology news & articles", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Article listings", "Categories & tags", "Author profiles", "Comments system UI"], expectedPages: 25 },
    { id: 9, name: "MediCare", folder: "healthcare", icon: "🏥", description: "Hospital & healthcare services", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Doctor profiles", "Appointment booking", "Services & departments", "Health tips blog"], expectedPages: 16 },
    { id: 10, name: "EventPro", folder: "events", icon: "🎉", description: "Event planning & management", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Event listings", "Ticket booking", "Venue showcase", "Gallery & reviews"], expectedPages: 15 },
    { id: 11, name: "LensArt", folder: "photography", icon: "📸", description: "Photography portfolio", techStack: ["HTML5", "CSS3", "JavaScript", "Gallery"], features: ["Photo galleries", "Service packages", "Booking system", "Client testimonials"], expectedPages: 10 },
    { id: 12, name: "SoundWave", folder: "music", icon: "🎵", description: "Music streaming platform", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Music player UI", "Playlists & albums", "Artist profiles", "Search & discovery"], expectedPages: 18 },
    { id: 13, name: "StyleHub", folder: "fashion", icon: "👗", description: "Fashion e-commerce", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Product catalog", "Size guides", "Lookbook & trends", "Shopping cart"], expectedPages: 17 },
    { id: 14, name: "GameVerse", folder: "gaming", icon: "🎮", description: "Gaming community platform", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Game library", "User profiles", "Leaderboards", "Community forums"], expectedPages: 19 },
    { id: 15, name: "BizCorp", folder: "corporate", icon: "🏢", description: "Corporate business website", techStack: ["HTML5", "CSS3", "JavaScript"], features: ["Company profile", "Services showcase", "Team & careers", "Client portfolio"], expectedPages: 11 }
];

async function scanAllWebsites() {
    const results = [];
    let totalPages = 0;
    let completedWebsites = 0;
    
    for (const website of websiteConfig) {
        const pageCount = manualPageCounts[website.folder] || 0;
        const progress = Math.round((pageCount / website.expectedPages) * 100);
        let status = pageCount >= website.expectedPages ? 'completed' : pageCount > 0 ? 'in-progress' : 'planned';
        
        if (status === 'completed') completedWebsites++;
        
        results.push({
            ...website,
            actualPages: pageCount,
            isLive: pageCount > 0,
            progress: progress,
            status: status
        });
        
        totalPages += pageCount;
    }
    
    return { websites: results, totalPages, completedWebsites, totalWebsites: websiteConfig.length, targetPages: 215 };
}

function updateUI(scanResults) {
    const totalPagesEl = document.getElementById('totalPages');
    if (totalPagesEl) totalPagesEl.textContent = scanResults.totalPages;
    
    const completedCountEl = document.getElementById('completedCount');
    if (completedCountEl) completedCountEl.textContent = `${scanResults.completedWebsites}/${scanResults.totalWebsites}`;
    
    const lastScanEl = document.getElementById('lastScan');
    if (lastScanEl) lastScanEl.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const progressBar = document.getElementById('overallProgress');
    if (progressBar) {
        const progress = Math.round((scanResults.totalPages / scanResults.targetPages) * 100);
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        progressBar.textContent = `${progress}%`;
    }
}

function generateWebsiteCard(website) {
    const isCompleted = website.status === 'completed';
    const inProgress = website.status === 'in-progress';
    
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
                      inProgress ? '<span class="meta-badge status-progress">🔨 In Progress</span>' : 
                      '<span class="meta-badge">📅 Planned</span>'}
                </div>
                ${website.isLive ? `
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${website.progress}%; background: ${isCompleted ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #d97706)'};">
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
                ${website.isLive ? 
                    `<a href="${website.folder}/index.html" class="website-link ${isCompleted ? 'live-link' : 'progress-link'}">
                        ${isCompleted ? '🚀 View Live Website' : '👁️ Preview'} →
                    </a>` :
                    `<a href="#" class="website-link disabled" onclick="return false;">Coming Soon...</a>`
                }
            </div>
        </div>
    `;
}

function renderWebsites(scanResults) {
    const grid = document.getElementById('websitesGrid');
    if (grid) grid.innerHTML = scanResults.websites.map(w => generateWebsiteCard(w)).join('');
}

async function initPageCounter() {
    console.log('🚀 Initializing page counter...');
    const scanResults = await scanAllWebsites();
    updateUI(scanResults);
    renderWebsites(scanResults);
    console.log(`✅ Total: ${scanResults.totalPages} pages | ${scanResults.completedWebsites}/${scanResults.totalWebsites} completed`);
}

function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '🔄 Scanning...';
            await initPageCounter();
            refreshBtn.disabled = false;
            refreshBtn.textContent = '🔄 Refresh Counts';
            const feedback = document.createElement('div');
            feedback.className = 'refresh-feedback';
            feedback.textContent = '✅ Counts updated!';
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 3000);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initPageCounter();
        setupRefreshButton();
    });
} else {
    initPageCounter();
    setupRefreshButton();
}

window.PageCounter = { scan: scanAllWebsites, config: websiteConfig, refresh: initPageCounter };