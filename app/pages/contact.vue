<template>
  <div class="content-area">
    <div class="contact-container">
      <div class="contact-form-side">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="form-name">Name</label>
            <input type="text" id="form-name" required>
          </div>
          <div class="form-group">
            <label for="form-email">Email</label>
            <input type="email" id="form-email" required>
          </div>
          <div class="form-group">
            <label for="form-message">Message</label>
            <textarea id="form-message" rows="6" required></textarea>
          </div>
          <button type="submit" class="btn-submit">Submit</button>
        </form>
      </div>

      <div class="contact-info-side">
        <div class="info-item">
          <div class="info-icon">&#9993;</div>
          <div class="info-details">
            <h4>Email Address</h4>
            <p>desk@atlasreport.com</p>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">&#128222;</div>
          <div class="info-details">
            <h4>Phone Number</h4>
            <p>+1 (555) 839-2041</p>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">&#128205;</div>
          <div class="info-details">
            <h4>Physical Address</h4>
            <p>750 Editorial Row, Sector 4, New York, NY 10001</p>
          </div>
        </div>

        <div class="map-box">
          Map
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleSubmit = () => {
  alert('Submission processing executed.')
}
</script>

<style scoped>
.content-area {
  padding: 60px 5%;
  max-width: 1200px;
  margin: 0 auto;
}
.contact-container {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 50px;
}
.form-group {
  margin-bottom: 25px;
}
.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222222;
  text-transform: uppercase;
  font-size: 0.9rem;
}
.form-group input, .form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #222222;
  border-radius: 2px;
  font-size: 1rem;
  outline: none;
}
.btn-submit {
  background-color: #dddddd;
  color: #222222;
  padding: 10px 35px;
  text-decoration: none;
  font-weight: bold;
  border: 1px solid #222222;
  border-radius: 2px;
  text-transform: uppercase;
  cursor: pointer;
}
.btn-submit:hover {
  background-color: #cccccc;
}
.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
}
.info-icon {
  font-size: 1.6rem;
  margin-right: 15px;
  color: #222222;
  width: 30px;
  text-align: center;
}
.info-details h4 {
  color: #222222;
  font-size: 1.1rem;
  margin-bottom: 4px;
  text-transform: uppercase;
  font-weight: bold;
}
.info-details p {
  color: #666666;
}
.map-box {
  border: 1px solid #222222;
  height: 250px;
  background-color: #e3e3e3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 20px;
}
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
}
</style>