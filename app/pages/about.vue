<template>
  <div class="content-area">
    <div class="about-container">
      <div class="about-image-box">
        <img src="https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&w=1000&q=80" alt="Newsroom Processing Unit">
      </div>
      <div class="about-content">
        <h2>Our Story</h2>
        <h1>Who We Are</h1>
        <div class="about-text">
          <p><strong>Atlas Report</strong> serves as an independent journalistic foundation providing deep-dive analytics, global corporate monitoring, and immediate investigative dispatches. Mirroring the mythological strength of Atlas, we safely anchor the weight of modern breaking realities for millions of critical thinkers globally.</p>
          <p>Established to combat superficial reporting matrices, our cross-border teams deliver data-tested reporting that directly influences strategic insights, regulatory stances, and public interest frameworks. We maintain high standards of neutrality, verify each point with precision, and operate independent of localized institutional influences.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-area {
  padding: 60px 5%;
  max-width: 1200px;
  margin: 0 auto;
}
.about-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 50px;
  align-items: start;
}
.about-image-box {
  background-color: #e9ecef;
  border: 1px solid #dddddd;
  border-radius: 6px;
  height: 450px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}
.about-image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.about-content h2 {
  font-size: 1.2rem;
  color: #cc0000;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 10px;
}
.about-content h1 {
  font-size: 2.5rem;
  color: #0f2c59;
  margin-bottom: 20px;
  line-height: 1.2;
}
.about-text p {
  margin-bottom: 20px;
  color: #444444;
  font-size: 1.05rem;
}
@media (max-width: 768px) {
  .about-container {
    grid-template-columns: 1fr;
  }
  .about-image-box {
    height: 300px;
  }
}
</style>