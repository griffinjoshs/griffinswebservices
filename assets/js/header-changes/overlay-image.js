// overlay-image.js
document.addEventListener("DOMContentLoaded", function () {
    const overlayToggleCheckbox = document.getElementById("toggle-overlay-checkbox");
    const heroSection = document.querySelector(".hero-wrap");
  
    // Load overlay preference from cookie
    const overlayPreference = getCookie("overlayPreference") === "true";
    overlayToggleCheckbox.checked = overlayPreference;
    heroSection.classList.toggle("overlay", overlayPreference);
  
    overlayToggleCheckbox.addEventListener("change", function () {
      heroSection.classList.toggle("overlay", this.checked);
      // Save the overlay preference as a cookie
      setCookie("overlayPreference", this.checked, 365);
    });
  });
  