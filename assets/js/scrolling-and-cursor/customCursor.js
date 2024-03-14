function createDynamicCursor(targetElementSelector, styles = {}) {
  document.addEventListener("DOMContentLoaded", () => {
    const targetElement = document.querySelector(targetElementSelector);

    if (!targetElement) {
      console.warn(
        `No element found with the selector: ${targetElementSelector}`
      );
      return;
    }

    const newCursor = document.createElement("div");
    newCursor.classList.add("cursor-base");

    // Apply custom styles from the styles object
    Object.keys(styles).forEach((property) => {
      newCursor.style[property] = styles[property];
    });

    document.body.appendChild(newCursor);

    targetElement.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;
      newCursor.style.left = `${clientX}px`;
      newCursor.style.top = `${clientY}px`;
      newCursor.style.display = "block";
    });

    targetElement.addEventListener("mouseleave", () => {
      newCursor.style.display = "none";
    });

    return newCursor;
  });
}

createDynamicCursor("body", {
  width: "20px",
  height: "20px",
  borderRadius: "50px",
  background: "var(--background-color)",
  zIndex: "99999",
});

createDynamicCursor(".hero-section-content", {
  width: "250px",
  height: "250px",
  borderRadius: "50%",
  background: "var(--primary-color)",
  zIndex: "99",
});
