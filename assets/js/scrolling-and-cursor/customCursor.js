// customCursor.js
function createDynamicCursor(
  targetElementSelector,
  styles = {},
  desktop = true,
  mobile = true,
  overInputsAndButtons = false,
  returnPosition = { enabled: false, x: "50%", y: "50%" } // New parameter with default value
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
    newCursor.style.display = "block"; // Initialize with display: none;

    Object.keys(styles).forEach((property) => {
      newCursor.style[property] = styles[property];
    });

    document.body.appendChild(newCursor);

    const updateCursorVisibility = (isVisible) => {
      const screenWidth = window.innerWidth;
      const shouldDisplayBasedOnScreenSize =
        (screenWidth > 768 && desktop) || (screenWidth <= 768 && mobile);

      newCursor.style.display =
        isVisible && shouldDisplayBasedOnScreenSize ? "block" : "none";

      // Additional logic for returning the cursor to a specific position
      if (!isVisible && returnPosition.enabled) {
        // Convert percentages to pixels if necessary
        const posX = returnPosition.x.endsWith("%")
          ? (parseFloat(returnPosition.x) / 100) * window.innerWidth
          : returnPosition.x;
        const posY = returnPosition.y.endsWith("%")
          ? (parseFloat(returnPosition.y) / 100) * window.innerHeight
          : returnPosition.y;

        newCursor.style.left = `${posX}px`;
        newCursor.style.top = `${posY}px`;
      }
    };

    targetElement.addEventListener("mousemove", (e) => {
      newCursor.style.left = `${e.clientX}px`;
      newCursor.style.top = `${e.clientY}px`;
      updateCursorVisibility(true);
    });

    targetElement.addEventListener("mouseleave", () =>
      updateCursorVisibility(false)
    );

    window.addEventListener("resize", () => updateCursorVisibility(false));

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
    width: "350px",
    height: "350px",
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
