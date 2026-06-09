<template>
  <header class="bg-white border-b shadow-sm">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
        <img
  src="/images/atlaslogo.png"
  alt="Atlas Report Logo"
  class="h-50 w-50 object-contain"
/>
          <span class="text-xl font-bold text-gray-900">
            Atlas Report
          </span>
        </NuxtLink>

        <!-- Navigation -->
        <nav>
          <ul class="flex items-center gap-8">
            <li>
              <NuxtLink
                to="/"
                class="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Home
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/about"
                class="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                About
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/contact"
                class="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Contact
              </NuxtLink>
            </li>
          </ul>
        </nav>

      </div>
    </div>
  </header>
</template>