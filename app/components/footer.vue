<template>
  <footer class="site-footer">
    <div class="footer-copy">© 2026 Atlas Report. All rights reserved.</div>
    <div class="social-icons">
      <a href="#" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
      <a href="#" aria-label="X"><i class="fab fa-x-twitter"></i></a>
      <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: #e9ecef;
  border-top: 1px solid #dddddd;
  padding: 20px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
.footer-copy {
  color: #666666;
  font-size: 0.9rem;
}
.social-icons {
  display: flex;
  gap: 15px;
}
.social-icons a {
  color: #222222;
  text-decoration: none;
  font-size: 1.2rem;
}
.social-icons a:hover {
  color: #cc0000;
}
@media (max-width: 768px) {
  .site-footer {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
}
</style>