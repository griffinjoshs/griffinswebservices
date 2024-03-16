// customCursor.js
function createDynamicCursor(
  targetElementSelector,
  styles = {},
  desktop = true,
  mobile = true, // Can now be true, false, or "semiTrue"
  overInputsAndButtons = false,
  returnPosition = { enabled: true, x: "50%", y: "50%" }
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

    Object.keys(styles).forEach((property) => {
      newCursor.style[property] = styles[property];
    });

    const setCursorToReturnPosition = () => {
      const posX = returnPosition.x.endsWith("%")
        ? (parseFloat(returnPosition.x) / 100) * window.innerWidth + "px"
        : returnPosition.x;
      const posY = returnPosition.y.endsWith("%")
        ? (parseFloat(returnPosition.y) / 100) * window.innerHeight + "px"
        : returnPosition.y;

      newCursor.style.left = posX;
      newCursor.style.top = posY;
      newCursor.style.transform = "translate(-50%, -50%)";
    };

    setCursorToReturnPosition();

    const updateCursorVisibility = (isVisible) => {
      const screenWidth = window.innerWidth;
      let shouldDisplay = false;

      if (screenWidth > 768) {
        shouldDisplay = desktop;
      } else {
        shouldDisplay = mobile === true || mobile === "semiTrue";
      }

      newCursor.style.display = isVisible && shouldDisplay ? "block" : "none";
      if (!isVisible && returnPosition.enabled) {
        setCursorToReturnPosition();
      }
    };

    // Only allow movement if not in semiTrue mode or if the screenWidth is greater than 768
    const allowMovement = () => {
      const screenWidth = window.innerWidth;
      return !(mobile === "semiTrue" && screenWidth <= 768);
    };

    targetElement.addEventListener("mousemove", (e) => {
      if (allowMovement()) {
        newCursor.style.left = `${e.clientX}px`;
        newCursor.style.top = `${e.clientY}px`;
        newCursor.style.transform = "";
      }
      updateCursorVisibility(true);
    });

    targetElement.addEventListener("mouseleave", () =>
      updateCursorVisibility(false)
    );
    window.addEventListener("resize", () => {
      updateCursorVisibility(true);
      setCursorToReturnPosition();
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
  "semiTrue",
  false,
  { enabled: true, x: "50%", y: "40%" } // Enable returning to the center
);
