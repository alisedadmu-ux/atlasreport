<template>
  <div class="app-layout">
    <Header />
    
    <main class="main-content">
      <NuxtPage />
    </main>
    
    <Footer />
  </div>
</template>

<style>
/* Global Styles across all pages */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}
.main-content {
  flex: 1;
  width: 100%;
}
</style>