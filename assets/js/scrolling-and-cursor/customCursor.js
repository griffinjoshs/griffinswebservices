// customCursor.js

// primary color cursor
document.addEventListener("DOMContentLoaded", function () {
  const cursor = document.querySelector(".cursor");

  document.addEventListener("mousemove", (e) => {
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    cursor.style.left = e.pageX + scrollX + "px";
    cursor.style.top = e.pageY + scrollY + "px";
  });
});

// large primary color orb cursor
document.addEventListener("DOMContentLoaded", function () {
  const cursor = document.querySelector(".cursor");

  function dynamicCursorHover(selector, hoverStyles) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
      element.addEventListener("mouseover", function () {
        Object.assign(cursor.style, hoverStyles);
      });

      element.addEventListener("mouseout", function () {
        // Instead of applying reset styles, clear the styles set on hover
        // This will allow the cursor to revert to its default styles defined in CSS
        Object.keys(hoverStyles).forEach((key) => {
          cursor.style[key] = ""; // Clear each style property
        });
      });
    });
  }

  // Define styles for hover
  const hoverStyles = {
    width: "240px",
    height: "240px",
    borderRadius: "var(--rounded-border-radius);",
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "var(--primaryShadow)",
    filter: "var(--primary-shadow)",
    zIndex: "10",
    pointerEvents: "none",
  };

  dynamicCursorHover("h1 .hero-section-content", hoverStyles);

  // Update the .cursor position on mouse move
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.pageX + "px";
    cursor.style.top = e.pageY + "px";
  });
});
