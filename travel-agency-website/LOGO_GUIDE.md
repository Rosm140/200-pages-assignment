# 🎨 TravelGo Logo Package

## 📦 Logo Variations Included

You have **4 logo versions** designed for different use cases:

### 1. **logo.svg** - Main Logo (Default)
- **Size:** 200x60px
- **Use for:** Website header, main branding
- **Background:** Light backgrounds
- **Features:** Full logo with icon + text + tagline
- **Colors:** Orange-to-gold gradient on "Travel", blue "Go"

### 2. **logo-icon.svg** - Icon Only
- **Size:** 50x50px
- **Use for:** Favicon, app icons, social media profile pictures
- **Background:** Any (has transparent background)
- **Features:** Just the compass/airplane icon
- **Perfect for:** Small spaces where text isn't needed

### 3. **logo-light.svg** - Light Version
- **Size:** 200x60px
- **Use for:** Footer, dark backgrounds, hero sections
- **Background:** Dark backgrounds (#1A1A2E or similar)
- **Features:** White/light colored with gold accents
- **Best for:** Maximum visibility on dark surfaces

### 4. **logo-compact.svg** - Compact Version
- **Size:** 160x40px
- **Use for:** Mobile header, email signatures, small spaces
- **Background:** Light backgrounds
- **Features:** Simplified icon + text (no tagline)
- **Perfect for:** Limited space applications

---

## 🎯 Logo Design Elements

### **Icon Design:**
- **Compass Circle:** Represents exploration and navigation
- **Airplane:** Symbolizes travel and adventure
- **Compass Points:** Show all directions/destinations
- **Decorative Dots:** Add visual interest and balance

### **Color Palette:**
- **Primary Gradient:** #FF6B35 (Orange) → #F7B801 (Gold)
- **Secondary:** #004E89 (Deep Blue)
- **Accent:** #F7B801 (Gold)

### **Typography:**
- **Font:** Playfair Display (serif) - Elegant and travel-appropriate
- **Weights:** Bold (800) for impact
- **Tagline:** Poppins - Modern and readable

---

## 💻 Implementation Guide

### **In Your HTML:**

#### Standard Header (Light Background):
```html
<a href="index.html" class="brand">
  <img src="assets/images/logo.svg" alt="TravelGo" width="180" height="54" />
</a>
```

#### Footer (Dark Background):
```html
<img src="assets/images/logo-light.svg" alt="TravelGo" width="180" height="54" />
```

#### Mobile Header:
```html
<a href="index.html" class="brand">
  <img src="assets/images/logo-compact.svg" alt="TravelGo" width="140" height="35" />
</a>
```

#### Favicon:
```html
<link rel="icon" type="image/svg+xml" href="assets/images/logo-icon.svg" />
<!-- Fallback for older browsers -->
<link rel="icon" type="image/png" href="assets/images/favicon-32x32.png" />
```

---

## 📁 File Placement

Place logo files in your project:

```
your-website/
└── assets/
    └── images/
        ├── logo.svg           ← Main logo
        ├── logo-icon.svg      ← Favicon/icon
        ├── logo-light.svg     ← Footer logo
        └── logo-compact.svg   ← Mobile/compact
```

---

## 🎨 Usage Examples

### **1. Main Header (Desktop)**
```html
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html">
      <img src="assets/images/logo.svg" 
           alt="TravelGo - Your Modern Travel Partner" 
           width="180" 
           height="54" />
    </a>
  </div>
</header>
```

### **2. Footer (Dark Background)**
```html
<footer class="site-footer">
  <div class="container">
    <img src="assets/images/logo-light.svg" 
         alt="TravelGo" 
         width="150" 
         height="45" 
         style="margin-bottom: 1rem;" />
  </div>
</footer>
```

### **3. Favicon (Multiple Sizes)**
```html
<head>
  <!-- SVG favicon (modern browsers) -->
  <link rel="icon" type="image/svg+xml" href="assets/images/logo-icon.svg" />
  
  <!-- PNG fallback -->
  <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon-16x16.png" />
  
  <!-- Apple Touch Icon -->
  <link rel="apple-touch-icon" sizes="180x180" href="assets/images/apple-touch-icon.png" />
</head>
```

### **4. Responsive Logo (CSS)**
```css
.brand img {
  height: 54px;
  width: auto;
  transition: transform 0.3s ease;
}

.brand:hover img {
  transform: scale(1.05);
}

/* Mobile */
@media (max-width: 768px) {
  .brand img {
    height: 40px;
  }
}
```

---

## 🎯 Best Practices

### **DO:**
✅ Use the appropriate version for the background color
✅ Maintain aspect ratio when scaling
✅ Give the logo breathing room (padding/margin)
✅ Use alt text for accessibility
✅ Specify width and height attributes

### **DON'T:**
❌ Don't stretch or distort the logo
❌ Don't change the colors
❌ Don't add effects (shadows, filters) without testing
❌ Don't use JPEG (use SVG or PNG with transparency)
❌ Don't place on busy/distracting backgrounds

---

## 🔄 Responsive Behavior

```css
/* Desktop: Full logo */
.logo-full { display: block; }
.logo-compact { display: none; }

/* Mobile: Compact logo */
@media (max-width: 768px) {
  .logo-full { display: none; }
  .logo-compact { display: block; }
}
```

---

## 📐 Size Guidelines

### **Minimum Sizes:**
- Full logo: 120px width minimum
- Compact logo: 100px width minimum
- Icon only: 24px minimum (for UI elements)

### **Recommended Sizes:**
- **Desktop header:** 180-200px width
- **Mobile header:** 120-140px width
- **Footer:** 120-150px width
- **Favicon:** 32x32px or 16x16px

---

## 🎨 Color Variations

If you need to customize colors, edit the SVG `<linearGradient>` section:

```svg
<linearGradient id="logoGradient">
  <stop offset="0%" style="stop-color:#YOUR_COLOR" />
  <stop offset="100%" style="stop-color:#YOUR_COLOR" />
</linearGradient>
```

---

## 🖼️ Creating PNG Versions

To create PNG versions from SVG (for favicon):

### **Option 1: Online Converter**
1. Go to cloudconvert.com or similar
2. Upload logo-icon.svg
3. Convert to PNG at these sizes:
   - 16x16px (favicon-16x16.png)
   - 32x32px (favicon-32x32.png)
   - 180x180px (apple-touch-icon.png)
   - 192x192px (android-chrome-192x192.png)
   - 512x512px (android-chrome-512x512.png)

### **Option 2: Using Figma/Adobe Illustrator**
1. Import SVG
2. Export as PNG at required sizes
3. Ensure transparent background

### **Option 3: Command Line (ImageMagick)**
```bash
convert -background none logo-icon.svg -resize 32x32 favicon-32x32.png
convert -background none logo-icon.svg -resize 180x180 apple-touch-icon.png
```

---

## 🔍 SEO & Metadata

Include logo in structured data:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "TravelGo",
  "logo": "https://yourdomain.com/assets/images/logo.svg",
  "url": "https://yourdomain.com"
}
</script>
```

And in Open Graph tags:

```html
<meta property="og:image" content="https://yourdomain.com/assets/images/logo.svg" />
<meta property="og:image:width" content="200" />
<meta property="og:image:height" content="60" />
```

---

## 📱 Social Media Usage

### **Profile Pictures:**
Use: `logo-icon.svg` (or convert to PNG)
- Facebook: 180x180px
- Twitter: 400x400px
- Instagram: 320x320px
- LinkedIn: 300x300px

### **Cover Photos:**
Create custom banners using logo elements:
- Facebook: 820x312px
- Twitter: 1500x500px
- LinkedIn: 1584x396px

---

## ✨ Animation Ideas (Optional)

Add subtle animations in CSS:

```css
/* Hover effect */
.brand img {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand:hover img {
  transform: scale(1.05) rotate(-2deg);
}

/* Loading animation */
@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.brand img {
  animation: logoFadeIn 0.6s ease-out;
}
```

---

## 🎉 You're All Set!

Your TravelGo logo package includes:
- ✅ 4 versatile logo variations
- ✅ SVG format (scalable, crisp at any size)
- ✅ Transparent backgrounds
- ✅ Professional gradient design
- ✅ Travel-themed iconography
- ✅ Responsive-ready

Place the logo files in `assets/images/` and start using them in your website! 🚀

---

**Need customization?** The SVG files are easy to edit in any vector editor (Figma, Adobe Illustrator, Inkscape).

**Questions?** All logos use web-safe fonts and modern CSS gradients for maximum compatibility.
