<template>
  <div class="news-portal-container">
    
    <div class="breaking-ticker">
      <span class="ticker-badge">FLASH</span>
      <p class="ticker-text">Live global updates rolling out across premium intelligence sectors...</p>
    </div>

    <header class="portal-header">
      <div class="header-brand-zone">
        <p class="header-date">{{ currentFormattedDate }}</p>
        <h1 class="portal-logo">ATLAS REPORT</h1>
        <p class="header-edition">GLOBAL INTELLIGENCE FEED</p>
      </div>

      <nav class="portal-nav">
        <div class="primary-nav-links">
          <button 
            :class="{ active: activeTab === 'feed' }"
            @click="activeTab = 'feed'; selectedArticle = null"
          >
            📰 Intelligence Feed
          </button>

          <button 
            v-if="selectedArticle" 
            :class="{ active: activeTab === 'article' }"
            @click="activeTab = 'article'"
          >
            📄 Reading Desk
          </button>
        </div>

        <div class="utility-nav-links">
          <NuxtLink to="/about" class="util-link">About</NuxtLink>
          <NuxtLink to="/contact" class="util-link">Contact</NuxtLink>
        </div>
      </nav>
    </header>

    <main v-if="activeTab === 'feed'" class="portal-layout">
      
      <div class="category-filter-bar">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          :class="{ selected: currentCategory === cat.id }"
          @click="currentCategory = cat.id"
        >
          {{ cat.emoji }} {{ cat.name }}
        </button>
      </div>

      <div class="news-editorial-grid">
        
        <section v-if="filteredArticles[0]" class="hero-column" @click="viewFullArticle(filteredArticles[0])">
          <div class="hero-badge">TOP STORY</div>
          <div class="hero-image-wrapper">
            <img :src="filteredArticles[0].image" alt="Hero Banner" class="hero-img" />
          </div>
          <h2 class="hero-title">{{ filteredArticles[0].title }}</h2>
          <p class="hero-snippet">{{ filteredArticles[0].description }}</p>
          <span class="hero-meta">Reported by {{ filteredArticles[0].author }} — CLICK TO READ</span>
        </section>

        <section class="secondary-column">
          <div 
            v-for="(article, index) in filteredArticles.slice(1, 4)" 
            :key="index" 
            class="secondary-story-card"
            @click="viewFullArticle(article)"
          >
            <div class="secondary-img-wrapper">
              <img :src="article.image" alt="Story thumbnail" />
            </div>
            <div class="secondary-card-text">
              <h3 class="secondary-title">{{ article.title }}</h3>
              <p class="secondary-snippet">{{ truncateText(article.description, 95) }}</p>
            </div>
          </div>
        </section>

        <section class="bulletin-column">
          <h4 class="bulletin-heading">Latest Briefs</h4>
          <div class="bulletin-list">
            <div 
              v-for="(article, index) in filteredArticles.slice(4, 9)" 
              :key="index" 
              class="bulletin-item"
              @click="viewFullArticle(article)"
            >
              <span class="bulletin-index">#{{ index + 5 }}</span>
              <div class="bulletin-content">
                <h5 class="bulletin-title">{{ article.title }}</h5>
                <span class="bulletin-source">{{ article.author }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <main v-if="activeTab === 'article' && selectedArticle" class="portal-layout separate-article-view">
      <div class="article-viewer-frame">
        
        <button class="back-dashboard-btn" @click="activeTab = 'feed'">
          ◀ Return to Main Intelligence Feed
        </button>

        <header class="article-view-header">
          <div class="article-view-meta">
            <span class="meta-badge-source">{{ selectedArticle.author }}</span>
            <span class="meta-date-stamp">{{ selectedArticle.published }}</span>
          </div>
          <h1 class="article-view-title">{{ selectedArticle.title }}</h1>
        </header>

        <div class="article-hero-wrapper">
          <img :src="selectedArticle.image" alt="Full Report Feature Banner" class="article-view-img" />
        </div>

        <div class="article-view-body">
          <p class="editorial-lead-para">{{ selectedArticle.description }}</p>
          
          <div class="editorial-deep-analysis">
            <h3>📊 Internal Analytical Context Briefing</h3>
            <p v-for="(para, idx) in extendedParagraphs" :key="idx">
              {{ para }}
            </p>
          </div>
        </div>

        <footer class="article-view-footer">
          <p class="verification-notice">🛡️ Verified Source Entry • Distributed via Atlas Report Desk</p>
          <button class="footer-back-btn" @click="activeTab = 'feed'">
            Return to Dashboard
          </button>
        </footer>

      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: false
})

// Navigation tabs tracker
const activeTab = ref('feed') // Can be 'feed' or 'article'
const currentCategory = ref('general')
const selectedArticle = ref(null)

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const currentFormattedDate = computed(() => {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

const staticDatabase = [
  // --- GENERAL / WORLD ---
  {
    category: 'general',
    title: 'Global Summit Outlines Structural Architecture for Clean Energy Distribution Across Transit Corridors',
    description: 'International delegations assembled in Geneva to finalize the global standard framework targeting logistics grids, sustainable supply corridors, and clean manufacturing ecosystems.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
    author: 'Reuters Desk',
    published: 'June 16, 2026'
  },
  {
    category: 'general',
    title: 'Deep Maritime Exploration Teams Uncover Submerged Geothermal Vents Near Atlantic Ridge',
    description: 'Oceanographic researchers mapping deep abyssal zones confirm the location of previously undocumented active thermal networks hosting unique ecosystems.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800',
    author: 'Associated Press',
    published: 'June 16, 2026'
  },
  {
    category: 'general',
    title: 'Metropolitan Infrastructure Projects Test High-Capacity Smart Grids to Minimize Power Fluctuations',
    description: 'Urban planning committees deploy predictive power flow networks to dynamically balance grid load across massive residential districts.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
    author: 'Global Bureau',
    published: 'June 15, 2026'
  },
  {
    category: 'general',
    title: 'Global Shipping Consortia Implement Rerouting Protocols to Optimize Transit Schedules',
    description: 'International freight companies shift tracking coordinates across major oceanic channels to minimize fuel burn and coordinate container drops.',
    image: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=800',
    author: 'Maritime Press',
    published: 'June 15, 2026'
  },
  {
    category: 'general',
    title: 'Agricultural Engineering Networks Release Comprehensive Soil Viability Mapping Database',
    description: 'Agronomists compile large-scale datasets detailing micro-nutrient properties across continuous cultivation belts to assist precision farming operations.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800',
    author: 'Nature Desk',
    published: 'June 14, 2026'
  },

  // --- TECHNOLOGY ---
  {
    category: 'technology',
    title: 'Quantum Compute Clusters Demonstrate Quantum Superiority in Structural Engine Matrix Computations',
    description: 'Hardware developers achieve computational stability across custom silicon arrays, safely rendering sub-atomic simulation algorithms in record speed.',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800',
    author: 'Tech Intelligence',
    published: 'June 16, 2026'
  },
  {
    category: 'technology',
    title: 'Open-Source Database Maintainers Roll Out Cryptographic Architecture Patch to Prevent Grid Leaks',
    description: 'Security leads release localized updates securing multi-tenant ledger setups against distributed dictionary probing attempts.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800',
    author: 'Cyber Review',
    published: 'June 16, 2026'
  },
  {
    category: 'technology',
    title: 'Solid-State Battery Architectures Match Lithium Ion Energy Density Benchmarks During Long Tests',
    description: 'Lab teams showcase non-volatile solid electrolyte storage frames capable of maintaining charge across 5,000 continuous hardware cycles.',
    image: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?q=80&w=800',
    author: 'Hardware Feed',
    published: 'June 15, 2026'
  },
  {
    category: 'technology',
    title: 'Edge Router Framework Updates Achieve Single-Digit Latency in Localized Smart-Home Ecosystems',
    description: 'Wireless protocols successfully sync multi-device sensors using integrated localized radio chips without hitting standard cloud pipelines.',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800',
    author: 'Network World',
    published: 'June 14, 2026'
  },

  // --- SPORTS ---
  {
    category: 'sports',
    title: 'International Racing Circuits Redesign High-Velocity Curves Following Advanced Computational Modeling',
    description: 'Aerodynamic engineers adjust mechanical asphalt compositions and barrier angles to balance vehicle safety with high-speed competitive friction.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800',
    author: 'Circuit Desk',
    published: 'June 16, 2026'
  },
  {
    category: 'sports',
    title: 'Global Football Analytics Agency Tracks Real-Time Spatial Tracking Patterns in Championship Matchups',
    description: 'Wearable sensor metrics gather precise telemetry data measuring mechanical velocity and acceleration curves of prime championship athletes.',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800',
    author: 'Athletic Metrics',
    published: 'June 15, 2026'
  },

  // --- SCIENCE ---
  {
    category: 'science',
    title: 'Orbital Observatories Transmit Deep-Field Core Visuals Detailing Stellar Nurseries Near Perseus Arm',
    description: 'Spectroscopic instrumentation parses heavy infrared layers to locate early protostar gas configurations moving within high-density cosmic waves.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800',
    author: 'Astro Review',
    published: 'June 16, 2026'
  },
  {
    category: 'science',
    title: 'Synthetic Biologists Successfully Construct Enzymes Capable of Breaking Down Rigid Industrial Composites',
    description: 'Laboratory groups isolate a stable protein alignment that isolates and metabolizes high-density polymer compounds in room temperature environments.',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9d39d6618?q=80&w=800',
    author: 'Science Daily',
    published: 'June 16, 2026'
  },

  // --- BUSINESS ---
  {
    category: 'business',
    title: 'Logistics Software Mergers Re-Index Standard Cargo Delivery Values Across Northern Channels',
    description: 'Enterprise integration platforms combine operations, standardizing automated maritime manifest validation across major deepwater shipping ports.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
    author: 'Financial Press',
    published: 'June 16, 2026'
  },

  // --- HEALTH ---
  {
    category: 'health',
    title: 'High-Resolution Protein Structure Mapping Pinpoints Vulnerable Entry Mechanisms in Viral Coats',
    description: 'Microscopic scanning arrays help research networks trace the spatial geometry of outer membrane tags to plan tailored preventive blocking techniques.',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800',
    author: 'Medical Network',
    published: 'June 16, 2026'
  }
]

const extendedParagraphs = [
  "This unfolding story highlights a key shift in current international trends, signaling rapid changes across both local industries and global markets. Analysts note that tactical adjustments being deployed today will likely dictate resource distribution over the next fiscal decade.",
  "Historically, comparable occurrences faced heavy systemic bottlenecks; however, modern technological infrastructure and fluid asset communication networks are allowing updates to propagate across consumer brackets seamlessly.",
  "Industry headers are urging caution among retail adapters, noting that volatile consumer responses can sometimes distort primary analytical projections. Operational frameworks must remain completely agile to insulate against collateral macro-market dips.",
  "As full field disclosures continue to develop over the upcoming hours, field teams remain highly focused on regulatory reviews. Follow-up investigations are scheduled to verify standard long-term resilience frameworks across active nodes."
]

const filteredArticles = computed(() => {
  return staticDatabase.filter(art => art.category === currentCategory.value)
})

const viewFullArticle = (article) => {
  selectedArticle.value = article
  activeTab.value = 'article' // Smooth switch to separate tab view
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const truncateText = (text, maxLen) => {
  if (!text) return ''
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.news-portal-container {
  background-color: #fcfbf7;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #111111;
}

/* BREAKING TICKER */
.breaking-ticker {
  background-color: #a30000;
  color: white;
  padding: 0.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  font-weight: 700;
}
.ticker-badge {
  background: white;
  color: #a30000;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

/* EDITORIAL HEADERS */
.portal-header {
  border-bottom: 3px double #111111;
  margin: 0 2rem;
}
.header-brand-zone {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid #e5e5e5;
}
.portal-logo {
  font-family: 'Cinzel', serif;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0.5rem 0;
}
.header-date, .header-edition {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #555555;
}

/* NAVIGATION TABS */
.portal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}
.primary-nav-links {
  display: flex;
  gap: 1.5rem;
}
.primary-nav-links button {
  background: none;
  border: none;
  font-family: inherit;
  font-weight: 700;
  font-size: 1rem;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem 0;
}
.primary-nav-links button:hover, .primary-nav-links button.active {
  color: #a30000;
  border-bottom: 2px solid #a30000;
}
.util-link {
  text-decoration: none;
  color: #666666;
  font-size: 0.9rem;
  margin-left: 1.25rem;
  font-weight: 600;
}

/* INNER CATEGORY SUB-BAR */
.category-filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 1rem;
}
.category-filter-bar button {
  background: #f4f1ea;
  border: 1px solid #e5e5e5;
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 4px;
}
.category-filter-bar button.selected {
  background: #111111;
  color: white;
  border-color: #111111;
}

/* EDITORIAL GRID SYSTEM */
.portal-layout { padding: 2rem; }
.news-editorial-grid {
  display: grid;
  grid-template-columns: 2fr 1.25fr 1fr;
  gap: 2.5rem;
}

/* COLUMN 1: HERO TOP STORY */
.hero-column {
  cursor: pointer;
  border-right: 1px solid #e5e5e5;
  padding-right: 2.5rem;
}
.hero-badge {
  background-color: #111111;
  color: white;
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.hero-image-wrapper { width: 100%; height: 380px; overflow: hidden; }
.hero-img {
  width: 100%; height: 100%; object-fit: cover; margin-bottom: 1.25rem;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem; font-weight: 700; line-height: 1.2; margin: 1rem 0;
}
.hero-snippet { font-size: 1.05rem; line-height: 1.6; color: #333333; margin-bottom: 1rem; }
.hero-meta { font-size: 0.8rem; font-weight: 700; color: #a30000; text-transform: uppercase; }

/* COLUMN 2: SECONDARY POSTS */
.secondary-column {
  border-right: 1px solid #e5e5e5;
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.secondary-story-card {
  cursor: pointer; display: flex; flex-direction: column; gap: 1rem;
  padding-bottom: 1.75rem; border-bottom: 1px solid #eeeeee;
}
.secondary-img-wrapper { width: 100%; height: 160px; overflow: hidden; }
.secondary-story-card img { width: 100%; height: 100%; object-fit: cover; }
.secondary-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; line-height: 1.3; }
.secondary-snippet { font-size: 0.9rem; color: #555555; margin-top: 0.25rem; }

/* COLUMN 3: SIDE TICKER BULLETIN LIST */
.bulletin-column { padding-left: 0.5rem; }
.bulletin-heading {
  font-family: 'Cinzel', serif; border-bottom: 2px solid #111111;
  padding-bottom: 0.5rem; margin-bottom: 1.25rem; font-size: 1.1rem;
}
.bulletin-list { display: flex; flex-direction: column; gap: 1.25rem; }
.bulletin-item {
  display: flex; gap: 1rem; cursor: pointer; padding-bottom: 1rem; border-bottom: 1px dashed #dddddd;
}
.bulletin-index { font-size: 1.25rem; font-weight: 800; color: #a30000; }
.bulletin-title { font-size: 0.95rem; font-weight: 700; line-height: 1.4; }
.bulletin-source { font-size: 0.75rem; color: #777777; font-weight: 600; display: block; margin-top: 0.25rem; }

/* NATIVE SEPARATE ARTICLE VIEW (STAYS ON SITE) */
.separate-article-view {
  display: flex; justify-content: center; background: #fcfbf7; padding: 3rem 2rem;
}
.article-viewer-frame { width: 100%; max-width: 800px; background: #ffffff; border: 1px solid #e5e5e5; padding: 4rem; }
.back-dashboard-btn {
  background: #111111; color: white; border: none; padding: 0.6rem 1.2rem;
  font-family: inherit; font-weight: 700; font-size: 0.85rem; cursor: pointer; margin-bottom: 2.5rem;
}
.back-dashboard-btn:hover { background: #a30000; }
.article-view-header { border-bottom: 1px solid #e5e5e5; padding-bottom: 1.5rem; margin-bottom: 2rem; }
.article-view-meta { display: flex; gap: 1.5rem; font-size: 0.85rem; font-weight: 700; margin-bottom: 0.75rem; }
.meta-badge-source { color: #a30000; text-transform: uppercase; }
.meta-date-stamp { color: #666666; }
.article-view-title { font-family: 'Playfair Display', serif; font-size: 2.6rem; font-weight: 700; line-height: 1.2; color: #111111; }
.article-hero-wrapper { width: 100%; height: 420px; overflow: hidden; margin-bottom: 2.5rem; }
.article-view-img { width: 100%; height: 100%; object-fit: cover; }
.article-view-body { font-size: 1.1rem; line-height: 1.8; color: #222222; }
.editorial-lead-para { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-style: italic; line-height: 1.5; color: #333333; margin-bottom: 2rem; border-left: 4px solid #a30000; padding-left: 1.5rem; }
.editorial-deep-analysis { background: #fdfcf9; border: 1px solid #e5e5e5; padding: 2rem; border-top: 3px solid #111111; margin-top: 3rem; }
.editorial-deep-analysis h3 { font-family: 'Cinzel', serif; font-size: 1.1rem; margin-bottom: 1.25rem; }
.editorial-deep-analysis p { font-size: 1rem; margin-bottom: 1rem; color: #444444; }
.article-view-footer { margin-top: 4rem; border-top: 1px solid #e5e5e5; padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; }
.verification-notice { font-size: 0.8rem; font-weight: 700; color: #888888; }
.footer-back-btn { background: none; border: 1px solid #111111; color: #111111; padding: 0.6rem 1.2rem; font-family: inherit; font-weight: 700; cursor: pointer; }
.footer-back-btn:hover { background: #f4f1ea; }
</style>