// customCursor.js
function createDynamicCursor(
  targetElementSelector,
  styles = {},
  desktop = true,
  mobile = true,
  overInputsAndButtons = false,
  returnPosition = { enabled: true, x: "50%", y: "50%" } // Enable by default for centering
) {
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
    document.body.appendChild(newCursor);

    // Set initial position and styles
    Object.keys(styles).forEach((property) => {
      newCursor.style[property] = styles[property];
    });

    // Function to set cursor to its return position or center
    const setCursorToReturnPosition = () => {
      const posX = returnPosition.x.endsWith("%")
        ? (parseFloat(returnPosition.x) / 100) * window.innerWidth + "px"
        : returnPosition.x;
      const posY = returnPosition.y.endsWith("%")
        ? (parseFloat(returnPosition.y) / 100) * window.innerHeight + "px"
        : returnPosition.y;

      newCursor.style.left = posX;
      newCursor.style.top = posY;
      newCursor.style.transform = "translate(-50%, -50%)"; // Ensure centering
    };

    // Initial positioning
    setCursorToReturnPosition();

    const updateCursorVisibility = (isVisible) => {
      const screenWidth = window.innerWidth;
      const shouldDisplayBasedOnScreenSize =
        (screenWidth > 768 && desktop) || (screenWidth <= 768 && mobile);

      newCursor.style.display =
        isVisible && shouldDisplayBasedOnScreenSize ? "block" : "none";
      if (!isVisible && returnPosition.enabled) {
        setCursorToReturnPosition();
      }
    };

    targetElement.addEventListener("mousemove", (e) => {
      newCursor.style.left = `${e.clientX}px`;
      newCursor.style.top = `${e.clientY}px`;
      newCursor.style.transform = ""; // Remove the centering transform on move
      updateCursorVisibility(true);
    });

    targetElement.addEventListener("mouseleave", () =>
      updateCursorVisibility(false)
    );
    window.addEventListener("resize", () => {
      updateCursorVisibility(true); // Ensure visibility update on resize
      setCursorToReturnPosition(); // Re-center on resize
    });

    if (!overInputsAndButtons) {
      document
        .querySelectorAll("header *, button, input, textarea, select")
        .forEach((element) => {
          element.addEventListener("mouseover", () =>
            updateCursorVisibility(false)
          );
          element.addEventListener("mouseout", () =>
            updateCursorVisibility(true)
          );
        });
    }

    document.addEventListener("mouseout", (e) => {
      const shouldShow = !e.target.matches(
        "button, input, textarea, select, .specific-accordion-class"
      );
      if (shouldShow) updateCursorVisibility(true);
    });

    return newCursor;
  });
}

// Usage instructions for "body" and ".hero-section-content h1" remain as provided in your examples.

// Example usage
createDynamicCursor(
  "body",
  {
    width: "20px",
    height: "20px",
    borderRadius: "50px",
    background: "var(--background-color)",
    zIndex: "99999",
  },
  true,
  false,
  false
); // Show on desktop only

createDynamicCursor(
  ".hero-section-content h1",
  {
    width: "calc(150px + 10vw)",
    height: "calc(150px + 10vw)",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, var(--primary-color) 50%, rgba(0,0,0,0) 70%)",
    zIndex: "99",
  },
  true,
  true,
  false,
  { enabled: true, x: "50%", y: "40%" } // Enable returning to the center
);
