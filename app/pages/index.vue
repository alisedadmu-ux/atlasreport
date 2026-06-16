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
            v-for="cat in visibleCategories" 
            :key="cat.id" 
            :class="{ active: currentCategory === cat.id }"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </button>
          
          <div class="dropdown" :class="{ open: showDropdown }">
            <button class="dropdown-trigger" @click="showDropdown = !showDropdown">
              More Sectors ▾
            </button>
            <div class="dropdown-menu">
              <button 
                v-for="cat in dropdownCategories" 
                :key="cat.id" 
                :class="{ active: currentCategory === cat.id }"
                @click="selectCategory(cat.id); showDropdown = false"
              >
                {{ cat.emoji }} {{ cat.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="utility-nav-links">
          <NuxtLink to="/about" class="util-link">About</NuxtLink>
          <NuxtLink to="/contact" class="util-link">Contact</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="portal-layout">
      
      <div class="news-editorial-grid">
        
        <section v-if="filteredArticles[0]" class="hero-column" @click="openArticle(filteredArticles[0])">
          <div class="hero-badge">TOP STORY</div>
          <div class="hero-image-wrapper">
            <img 
              :src="filteredArticles[0].image" 
              alt="Hero Banner" 
              class="hero-img"
            />
          </div>
          <h2 class="hero-title">{{ filteredArticles[0].title }}</h2>
          <p class="hero-snippet">{{ filteredArticles[0].description }}</p>
          <span class="hero-meta">Reported by {{ filteredArticles[0].author }}</span>
        </section>

        <section class="secondary-column">
          <div 
            v-for="(article, index) in filteredArticles.slice(1, 4)" 
            :key="index" 
            class="secondary-story-card"
            @click="openArticle(article)"
          >
            <div class="secondary-img-wrapper">
              <img 
                :src="article.image" 
                alt="Story thumbnail"
              />
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
              @click="openArticle(article)"
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

    <div v-if="selectedArticle" class="modal-overlay" @click.self="closeArticle">
      <div class="modal-window">
        <button class="close-btn" @click="closeArticle">✕</button>
        
        <header class="modal-header">
          <div class="modal-meta">
            <span class="modal-source">{{ selectedArticle.author }}</span>
            <span class="modal-date">{{ selectedArticle.published }}</span>
          </div>
          <h2>{{ selectedArticle.title }}</h2>
        </header>

        <img 
          :src="selectedArticle.image" 
          alt="Full Banner" 
          class="modal-hero-img"
        />

        <div class="modal-content-body">
          <p class="lead-text">{{ selectedArticle.description }}</p>
          
          <div class="deep-info-block">
            <h4>📊 Editorial Context & In-Depth Analysis</h4>
            <p v-for="paragraph in extendedParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>
        
        <footer class="modal-footer">
          <button class="source-link-btn" @click="closeArticle">
            Return to Dashboard 
          </button>
        </footer>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: false
})

const categories = [
  { id: 'general', name: 'World', emoji: '🌍' },
  { id: 'technology', name: 'Tech', emoji: '💻' },
  { id: 'sports', name: 'Sports', emoji: '⚽' },
  { id: 'science', name: 'Science', emoji: '🔬' },
  { id: 'business', name: 'Business', emoji: '📈' },
  { id: 'health', name: 'Health', emoji: '🏥' }
]

const currentCategory = ref('general')
const selectedArticle = ref(null)
const showDropdown = ref(false)

const visibleCategories = computed(() => categories.slice(0, 4))
const dropdownCategories = computed(() => categories.slice(4))

const currentFormattedDate = computed(() => {
  return new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()
})

// Static database of news articles perfectly mapped to matching categories
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
  {
    category: 'sports',
    title: 'Training Architecture Combines Virtual Reality Environments with Biomechanical Stress Analysis',
    description: 'Elite gymnastics programs deploy sensor arrays inside immersive simulators to study ankle rotation impacts and land consistency frames.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800',
    author: 'Sports Science',
    published: 'June 14, 2026'
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
  {
    category: 'science',
    title: 'Climatology Core Samples Reveal Century-Long Precipitation Shift Maps Across Arid Basins',
    description: 'Geological survey teams complete drilling pipelines across remote mineral beds to trace long-range moisture cycles spanning ancestral timelines.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    author: 'Geo Journal',
    published: 'June 15, 2026'
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
  {
    category: 'business',
    title: 'Global Treasury Indexes Stabilize Following Adjusted Inter-Bank Asset Security Allocations',
    description: 'Central clearing houses coordinate liquidity pools to minimize risk spikes across multinational wholesale credit transaction lanes.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800',
    author: 'Wall Street Bureau',
    published: 'June 15, 2026'
  },

  // --- HEALTH ---
  {
    category: 'health',
    title: 'High-Resolution Protein Structure Mapping Pinpoints Vulnerable Entry Mechanisms in Viral Coats',
    description: 'Microscopic scanning arrays help research networks trace the spatial geometry of outer membrane tags to plan tailored preventive blocking techniques.',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?q=80&w=800',
    author: 'Medical Network',
    published: 'June 16, 2026'
  },
  {
    category: 'health',
    title: 'Distributed Telehealth Networks Implement Encrypted Protocols to Protect Rural Diagnostic Data',
    description: 'Healthcare infrastructure upgrades deploy zero-knowledge network nodes ensuring immediate processing of patient records across outlying clinical stations.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800',
    author: 'Lancet Feed',
    published: 'June 15, 2026'
  }
]

// Computed property that instantly filters stories when a category button is clicked
const filteredArticles = computed(() => {
  return staticDatabase.filter(art => art.category === currentCategory.value)
})

const extendedParagraphs = [
  "This unfolding story highlights a key shift in current international trends, signaling rapid changes across both local industries and global markets. Analysts note that tactical adjustments being deployed today will likely dictate resource distribution over the next fiscal decade.",
  "Historically, comparable occurrences faced heavy systemic bottlenecks; however, modern technological infrastructure and fluid asset communication networks are allowing updates to propagate across consumer brackets seamlessly.",
  "Industry headers are urging caution among retail adapters, noting that volatile consumer responses can sometimes distort primary analytical projections. Operational frameworks must remain completely agile to insulate against collateral macro-market dips.",
  "As full field disclosures continue to develop over the upcoming hours, field teams remain highly focused on regulatory reviews. Follow-up investigations are scheduled to verify standard long-term resilience frameworks across active nodes."
]

const selectCategory = (categoryId) => {
  currentCategory.value = categoryId
}

const openArticle = (article) => { selectedArticle.value = article }
const closeArticle = () => { selectedArticle.value = null }

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

/* NAVIGATION */
.portal-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}
.primary-nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.primary-nav-links button {
  background: none;
  border: none;
  font-family: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  color: #333333;
  cursor: pointer;
  padding: 0.25rem 0;
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

/* DROPDOWN MENU SECTORS */
.dropdown { position: relative; display: inline-block; }
.dropdown-trigger { font-weight: 700; color: #a30000 !important; background: none; border: none; cursor: pointer; font-family: inherit; font-size: 0.95rem; }
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%; left: 0;
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border: 1px solid #e5e5e5;
  z-index: 10;
  width: 200px;
  border-radius: 6px;
}
.dropdown.open .dropdown-menu { display: block; }
.dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem !important;
  border: none !important;
}
.dropdown-menu button:hover { background-color: #f7f7f7; }

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
  width: 100%;
  height: 100%;
  object-fit: cover;
  margin-bottom: 1.25rem;
}
.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.hero-snippet {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #333333;
  margin-bottom: 1rem;
}
.hero-meta { font-size: 0.8rem; font-weight: 700; color: #666666; }

/* COLUMN 2: SECONDARY POSTS */
.secondary-column {
  border-right: 1px solid #e5e5e5;
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}
.secondary-story-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid #eeeeee;
}
.secondary-img-wrapper { width: 100%; height: 160px; overflow: hidden; }
.secondary-story-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.secondary-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  line-height: 1.3;
}
.secondary-snippet { font-size: 0.9rem; color: #555555; margin-top: 0.25rem; }

/* COLUMN 3: SIDE TICKER BULLETIN LIST */
.bulletin-column { padding-left: 0.5rem; }
.bulletin-heading {
  font-family: 'Cinzel', serif;
  border-bottom: 2px solid #111111;
  padding-bottom: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 1.1rem;
}
.bulletin-list { display: flex; flex-direction: column; gap: 1.25rem; }
.bulletin-item {
  display: flex;
  gap: 1rem;
  cursor: pointer;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #dddddd;
}
.bulletin-index {
  font-size: 1.25rem;
  font-weight: 800;
  color: #a30000;
}
.bulletin-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
}
.bulletin-source { font-size: 0.75rem; color: #777777; font-weight: 600; display: block; margin-top: 0.25rem; }

/* MODAL FULL DISPLAY OVERLAYS */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);
  z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem;
}
.modal-window {
  background-color: #fcfbf7; width: 100%; max-width: 750px;
  max-height: 85vh; border-radius: 0; overflow-y: auto;
  position: relative; padding: 3rem; border: 4px solid #111111;
}
.close-btn {
  position: absolute; top: 1rem; right: 1rem; background: #111111;
  border: none; color: white; width: 32px; height: 32px; cursor: pointer;
}
.modal-header h2 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-top: 0.5rem; }
.modal-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: #666666; font-weight: 700; }
.modal-source { color: #a30000; }
.modal-hero-img { width: 100%; height: 300px; object-fit: cover; margin: 1.5rem 0; }
.modal-content-body { font-size: 1.05rem; line-height: 1.7; color: #222222; }
.lead-text { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-style: italic; margin-bottom: 1.5rem; }
.deep-info-block { background: #f4f1ea; padding: 1.5rem; border-top: 2px solid #a30000; margin-top: 2rem; }
.deep-info-block h4 { font-family: 'Cinzel', serif; margin-bottom: 0.75rem; }
.deep-info-block p { font-size: 0.95rem; margin-bottom: 0.75rem; color: #444444; }
.modal-footer { margin-top: 2.5rem; text-align: right; border-top: 1px solid #e5e5e5; padding-top: 1.5rem; }
.source-link-btn { background: #111111; color: white; padding: 0.75rem 1.2rem; border: none; font-weight: 700; font-size: 0.9rem; cursor: pointer; }
</style>