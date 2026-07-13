<template>
  <div class="legal-page">
    <div class="site-container">
      <div class="legal-card">
        <NuxtLink to="/" class="legal-logo" aria-label="Atlas Report — Home">
          <img src="/images/atlasreport.png" alt="Atlas Report" class="legal-logo-img" />
        </NuxtLink>
        <p class="eyebrow">Legal</p>
        <h1 class="legal-title">Terms of Service</h1>
        <p class="legal-last-updated">Last updated: July 6, 2026</p>

        <div class="legal-body">
          <section v-for="section in sections" :key="section.title" class="legal-section">
            <h2 class="legal-section-title">{{ section.title }}</h2>
            <p class="legal-section-text" v-html="section.content"></p>
            <ul v-if="section.items" class="legal-list">
              <li v-for="item in section.items" :key="item" v-html="item" class="legal-list-item"></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const sections = [
  { title: '1. Acceptance of Terms', content: 'By accessing or using Atlas Report ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not access or use the Service.' },
  { title: '2. Description of Service', content: 'Atlas Report is a global intelligence feed and news aggregation platform that curates and displays news articles from various RSS sources. The Service also provides community features including user profiles, comments, and discussion posts.' },
  { title: '3. User Accounts', content: 'To access certain features, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary.', items: [
    '<strong>Account Registration:</strong> You must provide accurate information during registration.',
    '<strong>Account Responsibility:</strong> You are solely responsible for maintaining the confidentiality of your account credentials.',
    '<strong>Account Termination:</strong> We reserve the right to suspend or terminate your account at any time for conduct that violates these Terms.'
  ]},
  { title: '4. User Conduct', content: 'You agree not to use the Service to post unlawful content, impersonate others, engage in spamming, gain unauthorized access, interfere with the Service, or violate applicable laws.', items: [
    'Post, upload, or transmit content that is unlawful, defamatory, harassing, or otherwise objectionable',
    'Impersonate any person or entity or falsely state your affiliation',
    'Engage in spamming, phishing, or unauthorized solicitation',
    'Attempt to gain unauthorized access to any part of the Service or computer systems',
    'Upload or transmit viruses, malware, or any other malicious code'
  ]},
  { title: '5. User Content', content: 'You retain all ownership rights to content you post. By posting User Content, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, publish, and display such content in connection with operating and providing the Service.' },
  { title: '6. Intellectual Property', content: 'The Service, including its design, layout, graphics, and original content, is owned by Atlas Report and is protected by copyright, trademark, and other intellectual property laws. News articles displayed on the Service are sourced from third-party RSS feeds and are the property of their respective owners.' },
  { title: '7. Third-Party Services', content: 'The Service integrates with third-party services, including Supabase for authentication, database, and storage services, and RSS feeds for news aggregation. We are not responsible for the content, privacy practices, or terms of these third-party services.', items: [
    '<strong>Supabase:</strong> Used for authentication, database, and storage services',
    '<strong>RSS Feeds:</strong> Used for news aggregation from various sources'
  ]},
  { title: '8. Disclaimer of Warranties', content: 'THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE OPERATION OR AVAILABILITY OF THE SERVICE.' },
  { title: '9. Limitation of Liability', content: 'IN NO EVENT SHALL ATLAS REPORT, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.' },
  { title: '10. Changes to Terms', content: 'We reserve the right to modify or replace these Terms at any time. Material changes will be effective upon posting the updated Terms on this page.' },
  { title: '11. Governing Law', content: 'These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.' },
  { title: '12. Contact Information', content: 'For any questions about these Terms, please contact us.' }
]
</script>

<style scoped>
.legal-page { padding: 2rem 0; }

.legal-card {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid var(--color-border);
  background: var(--color-card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xs);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.legal-logo { display: inline-flex; width: fit-content; }
.legal-logo-img {
  width: 120px;
  height: auto;
  object-fit: contain;
  opacity: 0.9;
  transition: opacity 0.2s ease;
}
.legal-logo:hover .legal-logo-img { opacity: 1; }

.legal-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  margin: 0.3rem 0 0.5rem;
}

.legal-last-updated { font-size: 0.8125rem; color: var(--color-text-muted); }

.legal-body {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.legal-section { display: flex; flex-direction: column; gap: 0.65rem; }

.legal-section-title {
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text);
}

.legal-section-text {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.legal-list {
  list-style: disc;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.legal-list-item {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-text-secondary);
}

@media (max-width: 640px) {
  .legal-card { padding: 1.5rem 1.25rem; }
}
</style>
