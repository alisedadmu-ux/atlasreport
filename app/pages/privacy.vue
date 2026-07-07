<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">
    <main class="max-w-3xl mx-auto px-6 py-16">
      <div class="p-8 md:p-12" :style="{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }">
        <div class="mb-8">
          <span class="text-xs font-bold tracking-widest text-red-700 uppercase">Legal</span>
          <h1 class="font-serif text-3xl md:text-4xl font-bold mt-2" :style="{ color: 'var(--color-text)' }">Privacy Policy</h1>
          <p class="text-sm mt-2" :style="{ color: 'var(--color-text-muted)' }">Last updated: July 6, 2026</p>
        </div>

        <div class="space-y-6 text-sm leading-relaxed" :style="{ color: 'var(--color-text-secondary)' }">
          <section>
            <h2 class="text-lg font-bold mb-2" :style="{ color: 'var(--color-text)' }">1. Introduction</h2>
            <p>
              Atlas Report ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">2. Information We Collect</h2>
            <h3 class="font-semibold text-gray-800 mt-3">2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide when you:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>Create an account (email address, username)</li>
              <li>Update your profile (display name, bio, avatar)</li>
              <li>Post comments or community content</li>
              <li>Contact us through our contact form</li>
            </ul>
            <h3 class="font-semibold text-gray-800 mt-3">2.2 Automatically Collected Information</h3>
            <p>When you visit our site, we may automatically collect:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and time spent on those pages</li>
              <li>Referring URL or website</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li>To provide and maintain our news aggregation service</li>
              <li>To manage your account and authenticate your identity</li>
              <li>To personalize your experience and deliver relevant content</li>
              <li>To enable community features such as comments and posts</li>
              <li>To communicate with you regarding service updates or inquiries</li>
              <li>To improve our website based on usage analytics</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">4. Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your data only in the following circumstances:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Service Providers:</strong> We use Supabase for authentication and database services. Your data is processed in accordance with their privacy practices.</li>
              <li><strong>Legal Obligations:</strong> If required by law or in response to valid legal requests by public authorities.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred.</li>
            </ul>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul class="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request that we correct any inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data, subject to certain exceptions.</li>
              <li><strong>Objection:</strong> Object to the processing of your personal data for certain purposes.</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
            </ul>
            <p class="mt-2">To exercise any of these rights, please contact us at <strong>alisedadmu@example.com</strong>.</p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">7. Cookies and Tracking</h2>
            <p>
              We use essential cookies for authentication and service functionality. We may also use analytics cookies to understand how our site is used. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">9. Children's Privacy</h2>
            <p>
              Our service is not intended for individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete it.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 class="text-lg font-bold text-gray-900 mb-2">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:<br>
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