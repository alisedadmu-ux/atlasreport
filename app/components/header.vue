<template>
  <header class="site-header">
    <div class="logo-container">
      <NuxtLink to="/">
        <img src="/images/atlaslogo.png" alt="Atlas Report Logo" class="brand-logo" />
      </NuxtLink>
    </div>
    <nav class="navigation">
      <ul>
        <li><NuxtLink to="/" active-class="active">Home</NuxtLink></li>
        <li><NuxtLink to="/about" active-class="active">About</NuxtLink></li>
        <li><NuxtLink to="/contact" active-class="active">Contact</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: 3px solid #0f2c59;
  padding: 10px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.brand-logo {
  height: 120px;
  width: auto;
  display: block;
}
.navigation ul {
  display: flex;
  list-style: none;
  gap: 25px;
}
.navigation a {
  text-decoration: none;
  color: #0f2c59;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  transition: color 0.2s;
}
.navigation a:hover, .navigation a.active {
  color: #cc0000;
}
@media (max-width: 768px) {
  .site-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>