// this will set the colors to be able to work with bootsrap elements
const primaryColor = "--primaryColor";

function modifyColors(color) {
    const getColor = getComputedStyle(document.documentElement)
      .getPropertyValue(color)
      .trim();
    const elements = document.querySelectorAll("*");

    elements.forEach((el) => {
      el.classList.forEach((className) => {
        if (className.endsWith("-primaryColor")) {
          if (className.startsWith("btn-outline-")) {
            el.style.borderColor = getColor;
            el.style.color = getColor;
            el.onmouseenter = () => {
              el.style.backgroundColor = getColor;
              el.style.color = "white";
            };
            el.onmouseleave = () => {
              el.style.backgroundColor = "transparent";
              el.style.color = getColor;
            };
          } else if (className.startsWith("bg-")) {
            el.style.backgroundColor = getColor;
          } else if (className.startsWith("text-")) {
            el.style.color = getColor;
          }
        }
      });
    });
  }

  window.onload = {

  }
  modifyColors(primaryColor)

  
// size
window.addEventListener('resize', setLogoPositionVariable);

function setLogoPositionVariable() {
  const logo = document.getElementById('logo');
  const logoEndPosition = logo.offsetLeft + logo.offsetWidth; // The end position of the logo

  // If the window width is less than 992px
  if (window.innerWidth < 992) {
    document.documentElement.style.setProperty('--logo-position', `1rem`); // 1rem on small screens
  } else {
    document.documentElement.style.setProperty('--logo-position', `${logoEndPosition}px`); // logo's right end position on large screens
  }
}

setLogoPositionVariable(); // Run it once on page load

