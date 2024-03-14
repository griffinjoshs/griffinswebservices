function prepareAndAnimateText(
  selector,
  initialColor,
  finalColor,
  speed,
  runOnMobile,
  runOnDesktop,
  callback
) {
  const elements = document.querySelectorAll(selector);
  const screenWidth = window.innerWidth;

  if (
    (runOnMobile && screenWidth <= 768) ||
    (runOnDesktop && screenWidth > 768)
  ) {
    elements.forEach((element) => {
      if (!element.dataset.prepared) {
        // Wrap the text content of the element in spans with initial transparent color
        wrapTextInSpans(element, initialColor);
        element.dataset.prepared = true;
      }
    });

    // Animate text
    elements.forEach((element) => {
      const spans = element.querySelectorAll("span.letter");
      let i = 0;
      function typeWriter() {
        if (i < spans.length) {
          spans[i].style.color = finalColor; // Change color of each letter to final color
          i++;
          setTimeout(typeWriter, speed); // Adjust typing speed here
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

// Usage example - starts the first animation on desktop only
prepareAndAnimateText(
  ".hero-section-content h1",
  "transparent",
  "var(--primary-color)",
  100,
  true,
  true,
  () => {
    console.log("First animation completed on desktop!");
    // Usage example - starts the second animation on mobile only
    prepareAndAnimateText(
      ".hero-section-content h1",
      "transparent",
      "var(--maintext-color)",
      150,
      true,
      true,
      () => {
        console.log("Second animation completed on mobile!");
        prepareAndAnimateText(
          ".emphasizeh1",
          "transparent",
          "var(--primary-color)",
          100,
          true,
          false,
          () => {
            console.log("third animation completed on desktop!");
          }
        );
      }
    );
  }
);

// Usage example - starts the third animation on both mobile and desktop
prepareAndAnimateText(
  ".hero-section-content p",
  "transparent",
  "var(--maintext-color)",
  40,
  true,
  true,
  () => {
    console.log("First animation completed on both mobile and desktop!");
  }
);

// Additional animations or callback actions can be added here

// // Usage example - starts the first animation
// prepareAndAnimateText("h1.animatedText", "transparent", "var(--primary-color)", 100, () => {
//   console.log("First animation completed!");
//   // Optionally, start a second animation with a different color or effect
//   prepareAndAnimateText("h1.animatedText", "transparent", "var(--maintext-color)", 150, () => {
//     console.log("Second animation completed!");
//     // Third animation targeting content within span with class emphasizeh1
//   });
// });

// prepareAndAnimateText("p.animatedText", "transparent", "var(--maintext-color)", 50, () => {
//   // Additional animations or callback actions can be added here
// });
