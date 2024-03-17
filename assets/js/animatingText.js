// animatingText.js
function prepareAndAnimateText(
  selector,
  initialColor,
  finalColor,
  speed,
  desktop = true, // Reordered and set default values
  mobile = true, // Reordered and set default values
  callback
) {
  const elements = document.querySelectorAll(selector);
  const screenWidth = window.innerWidth;

  // Updated conditional logic based on the new parameter order
  if ((mobile && screenWidth <= 768) || (desktop && screenWidth > 768)) {
    elements.forEach((element) => {
      if (!element.dataset.prepared) {
        wrapTextInSpans(element, initialColor);
        element.dataset.prepared = true;
      }
    });

    elements.forEach((element) => {
      const spans = element.querySelectorAll("span.letter");
      let i = 0;
      function typeWriter() {
        if (i < spans.length) {
          spans[i].style.color = finalColor;
          i++;
          setTimeout(typeWriter, speed);
        } else if (callback && typeof callback === "function") {
          callback();
        }
      }
      typeWriter();
    });
  }
}

function wrapTextInSpans(element, initialColor) {
  const children = element.childNodes;
  children.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent;
      const wrappedText = [...text]
        .map((char) => {
          if (char.trim() === "") return char; // Ignore whitespace
          return `<span class="letter" style="color: ${initialColor};">${char}</span>`;
        })
        .join("");
      const wrapper = document.createElement("span");
      wrapper.innerHTML = wrappedText;
      element.replaceChild(wrapper, child);
    } else if (
      child.nodeType === Node.ELEMENT_NODE &&
      !child.classList.contains("letter")
    ) {
      // If the child is not a span with class .letter, wrap its content in spans
      wrapTextInSpans(child, initialColor); // Recursively wrap text in spans for nested elements
    }
  });
}

// Example: Animation on desktop only
prepareAndAnimateText(
  ".hero-section-content h1",
  "transparent",
  "var(--primary-color)",
  100,
  true, // desktop
  true, // mobile
  () => {
    prepareAndAnimateText(
      ".hero-section-content h1",
      "transparent",
      "var(--maintext-color)",
      100,
      true, // desktop
      true, // mobile
      () => {
        // console.log("Animation completed on desktop!");
      }
    );
  }
);

// Example: Animation on both mobile and desktop
prepareAndAnimateText(
  ".hero-section-content p",
  "transparent",
  "var(--maintext-color)",
  40,
  true, // desktop
  true, // mobile
  () => {
    // console.log("Animation completed on both mobile and desktop!");
  }
);
