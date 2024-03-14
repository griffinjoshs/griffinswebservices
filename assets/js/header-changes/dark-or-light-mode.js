// dark-or-light-mode.js
function toggleTheme(isChecked) {
  const themeClass = isChecked ? 'light' : 'dark';
  document.body.classList.toggle('light', isChecked);
  document.body.classList.toggle('dark', !isChecked);

  // Save the theme preference as a cookie
  setCookie('themePreference', themeClass, 365);

  // Adjust icons based on the theme
  document.getElementById('icon-sun').style.display = isChecked ? 'inline' : 'none';
  document.getElementById('icon-moon').style.display = isChecked ? 'none' : 'inline';
}

// Load theme preference from cookie on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = getCookie('themePreference');
  const isChecked = savedTheme === 'light';
  document.getElementById('toggle-checkbox').checked = isChecked;
  toggleTheme(isChecked);
});
