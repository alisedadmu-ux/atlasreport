<template>
  <div class="legal-page">
    <div class="site-container">
      <div class="legal-card">
        <NuxtLink to="/" class="legal-logo" aria-label="Atlas Report — Home">
          <img src="/images/atlasreport.png" alt="Atlas Report" class="legal-logo-img" />
        </NuxtLink>
        <p class="eyebrow">Legal</p>
        <h1 class="legal-title">Privacy Policy</h1>
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
  { title: '1. Introduction', content: 'Atlas Report ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.' },
  { title: '2. Information We Collect', content: 'We may collect personal information that you voluntarily provide when you create an account, update your profile, post comments or community content, or contact us through our contact form.', items: [
    'Email address, username, and display name',
    'Profile bio and other optional profile details',
    'Community posts, comments, and likes',
    'IP address and browser type (automatically collected)',
    'Device information and operating system',
    'Pages visited and time spent on those pages'
  ]},
  { title: '3. How We Use Your Information', content: 'We use the collected information for the following purposes:', items: [
    'To provide and maintain our news aggregation service',
    'To manage your account and authenticate your identity',
    'To personalize your experience and deliver relevant content',
    'To enable community features such as comments and posts',
    'To communicate with you regarding service updates or inquiries',
    'To improve our website based on usage analytics'
  ]},
  { title: '4. Data Sharing and Disclosure', content: 'We do not sell your personal information. We may share your data only in the following circumstances:', items: [
    '<strong>Service Providers:</strong> We use Supabase for authentication, database, and storage services.',
    '<strong>Legal Obligations:</strong> If required by law or in response to valid legal requests by public authorities.',
    '<strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred.'
  ]},
  { title: '5. Data Security', content: 'We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.' },
  { title: '6. Your Rights', content: 'Depending on your location, you may have the following rights:', items: [
    '<strong>Access:</strong> Request a copy of the personal data we hold about you.',
    '<strong>Correction:</strong> Request that we correct any inaccurate or incomplete data.',
    '<strong>Deletion:</strong> Request deletion of your personal data.',
    '<strong>Objection:</strong> Object to the processing of your personal data.',
    '<strong>Data Portability:</strong> Request a copy of your data in a structured format.'
  ]},
  { title: '7. Cookies and Tracking', content: 'We use essential cookies for authentication and service functionality. We may also use analytics cookies to understand how our site is used. You can control cookie preferences through your browser settings.' },
  { title: '8. Third-Party Links', content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.' },
  { title: '9. Children\'s Privacy', content: 'Our service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children.' },
  { title: '10. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.' },
  { title: '11. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us.' }
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
