<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="max-w-3xl mx-auto px-6 py-16">
      <div class="p-8 md:p-12" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <div class="mb-8">
          <span class="text-xs font-bold tracking-widest text-red-700 uppercase">Legal</span>
          <h1 class="font-serif text-3xl md:text-4xl font-bold mt-2" :style="{ color: 'var(--color-text)' }">Terms of Service</h1>
          <p class="text-sm mt-2" :style="{ color: 'var(--color-text-muted)' }">Last updated: July 6, 2026</p>
        </div>

        <div class="space-y-6 text-sm leading-relaxed" :style="{ color: 'var(--color-text-secondary)' }">
          <section>
            <h2 class="text-lg font-bold mb-2" :style="{ color: 'var(--color-text)' }">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Atlas Report ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not access or use the Service. These terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">2. Description of Service</h2>
            <p>
              Atlas Report is a global intelligence feed and news aggregation platform that curates and displays news articles from various RSS sources. The Service also provides community features including user profiles, comments, and discussion posts.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">3. User Accounts</h2>
            <h3 class="font-semibold text-gray-800 mt-3">3.1 Account Registration</h3>
            <p>
              To access certain features, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information as necessary.
            </p>
            <h3 class="font-semibold text-gray-800 mt-3">3.2 Account Responsibility</h3>
            <p>
              You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
            <h3 class="font-semibold text-gray-800 mt-3">3.3 Account Termination</h3>
            <p>
              We reserve the right to suspend or terminate your account at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">4. User Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>Post, upload, or transmit any content that is unlawful, defamatory, harassing, abusive, obscene, or otherwise objectionable</li>
              <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with any person or entity</li>
              <li>Engage in spamming, phishing, or any form of unauthorized solicitation</li>
              <li>Attempt to gain unauthorized access to any part of the Service, other accounts, or computer systems</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Upload or transmit viruses, malware, or any other malicious code</li>
              <li>Violate any applicable local, national, or international law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">5. User Content</h2>
            <h3 class="font-semibold text-gray-800 mt-3">5.1 Ownership</h3>
            <p>
              You retain all ownership rights to content you post, submit, or display on or through the Service ("User Content").
            </p>
            <h3 class="font-semibold text-gray-800 mt-3">5.2 License to Us</h3>
            <p>
              By posting User Content, you grant us a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, publish, and display such content in connection with operating and providing the Service.
            </p>
            <h3 class="font-semibold text-gray-800 mt-3">5.3 Content Moderation</h3>
            <p>
              We reserve the right, but are not obligated, to monitor, edit, or remove any User Content that we determine in our sole discretion violates these Terms or is otherwise objectionable.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
            <p>
              The Service, including its design, layout, graphics, and original content (excluding User Content and third-party news articles), is owned by Atlas Report and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written consent.
            </p>
            <p class="mt-2">
              News articles displayed on the Service are sourced from third-party RSS feeds and are the property of their respective owners. We provide these articles for informational purposes only.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">7. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services, including:
            </p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Supabase:</strong> Used for authentication, database, and storage services</li>
              <li><strong>RSS Feeds:</strong> Used for news aggregation from various sources</li>
            </ul>
            <p class="mt-2">
              We are not responsible for the content, privacy practices, or terms of these third-party services. Your use of these services is subject to their respective terms.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">8. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE OPERATION OR AVAILABILITY OF THE SERVICE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p class="mt-2">
              We do not warrant that the Service will be uninterrupted, error-free, secure, or free from viruses or other harmful components. News content is aggregated from third-party sources and we do not guarantee its accuracy, completeness, or timeliness.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">9. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL ATLAS REPORT, ITS DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Atlas Report and its affiliates, officers, agents, and employees from any claims, liabilities, damages, losses, or expenses arising out of your use of the Service, your User Content, or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. Material changes will be effective upon posting the updated Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of the applicable jurisdiction.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">13. Contact Information</h2>
            <p>
              For any questions about these Terms, please contact us at:<br>
              Email: <strong>alisedadmu@example.com</strong>
            </p>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
</script>