function createDynamicCursor(
  targetElementSelector,
  styles = {},
  desktop = true,
  mobile = true,
  overInputsAndButtons = false
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
    newCursor.style.display = "none"; // Initialize with display: none;

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
      // Extend this to include the specific accordion elements or use event delegation
      if (!overInputsAndButtons) {
        // Include more selectors as needed, for instance, targeting the entire header or accordion specifically
        document.querySelectorAll("header *, button, input, textarea, select").forEach(element => {
          element.addEventListener("mouseover", () => updateCursorVisibility(false)); // Hide cursor
          element.addEventListener("mouseout", () => updateCursorVisibility(true)); // Show cursor based on previous logic
        });
      }

      document.addEventListener("mouseout", (e) => {
        const shouldShow = !e.target.matches(
          "button, input, textarea, select, .specific-accordion-class"
        );
        if (shouldShow) updateCursorVisibility(true);
      });
    }

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
  ".hero-section-content",
  {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    background: "var(--orb-gradient)",
    zIndex: "99",
  },
  true,
  false,
  false
); // Show on desktop only
