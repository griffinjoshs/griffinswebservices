// changePrimaryColor.js

const originalPrimaryColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--primary-color");

function updateThemeColors(newPrimaryColor, isReset = false) {
  // Update the primary color variable and related styles
  const secondaryColor = isReset
    ? null
    : lightenOrDarkenColor(newPrimaryColor, 20); // Conditionally update if not reset
  const tertiaryColor = isReset
    ? null
    : lightenOrDarkenColor(newPrimaryColor, -20);

  const propertiesToUpdate = {
    "--primary-color": newPrimaryColor,
    "--secondary-color": secondaryColor,
    "--tertiary-color": tertiaryColor,
    "--orb-gradient": isReset
      ? null
      : `radial-gradient(closest-side at center, ${newPrimaryColor} 0%, ...)`,
    "--primaryShadow": isReset
      ? null
      : `0 0 10px ${newPrimaryColor}, 0 0 15px ${newPrimaryColor}, 0 0 20px ${newPrimaryColor}`,
  };

  Object.keys(propertiesToUpdate).forEach((key) => {
    document.documentElement.style.setProperty(key, propertiesToUpdate[key]);
  });

  if (!isReset) {
    setCookie("userColorPreference", newPrimaryColor, 1);
  } else {
    // Remove cookie if resetting to original primary color
    setCookie("userColorPreference", "", -1);
  }

  updateRadioSelection(newPrimaryColor, isReset);
  closeColorPopup(); // Close the color popup after updating the theme colors
  forceRepaint();
}

function closeColorPopup() {
  const colorPopup = document.getElementById("top-bar-color-popup");
  const colorChangeCheckbox = document.getElementById("color-change-checkbox");
  if (colorPopup.classList.contains("hide") === false) {
    colorPopup.classList.add("hide");
  }
  // Uncheck the checkbox to reflect the popup is closed
  colorChangeCheckbox.checked = false;
}

function triggerChangeEvent(element) {
  const event = new Event("change", {
    bubbles: true,
    cancelable: true,
  });
  if (!element._isChanging) {
    // Check if the element is currently undergoing a change
    element._isChanging = true; // Mark the element as undergoing a change
    element.dispatchEvent(event);
    delete element._isChanging; // Remove the change marker after the event is dispatched
  }
}

// Additional utility, cookie functions and hexToRgb as previously defined.
function lightenOrDarkenColor(color, percent) {
  let num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x00ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? R : 255) * 0x10000 +
      (G < 255 ? G : 255) * 0x100 +
      (B < 255 ? B : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function updateRadioSelection(selectedColor, isReset) {
  const radios = document.querySelectorAll(".color-checkbox");
  radios.forEach((radio) => {
    if (isReset && radio.getAttribute("data-color") === originalPrimaryColor) {
      radio.checked = true;
      triggerChangeEvent(radio);
    } else if (radio.getAttribute("data-color") === selectedColor) {
      radio.checked = true;
      triggerChangeEvent(radio); // Ensure any associated actions are triggered.
    }
  });
}

function createColorOption(color, isChecked) {
  const radioId = `color-radio-${color}`;
  const radioButton = document.createElement("input");
  radioButton.type = "radio";
  radioButton.id = radioId;
  radioButton.name = "color-choice"; // All radio buttons share the same name.
  radioButton.className = "color-checkbox";
  radioButton.setAttribute("data-color", color);
  radioButton.checked = isChecked;
  radioButton.hidden = true; // Keep the input hidden as you're using a label for display.

  const label = document.createElement("label");
  label.htmlFor = radioId;
  label.className = "color-button";
  label.style.backgroundColor = color;
  label.style.border = "2px solid var(--maintext-color)";
  // Adjust whether the icon is shown based on isChecked.
  label.innerHTML = `<i class="fas fa-times ${
    isChecked ? "" : "hide"
  }" style="font-size: 15px;"></i>`;

  // Add event listener for the radio button change
  radioButton.addEventListener("change", function () {
    updateThemeColors(color);
    closeColorPopup(); // Close the popup on color selection
  });

  return [radioButton, label];
}

// Event Listeners and Initializers
document.addEventListener("DOMContentLoaded", function () {
  const savedColor = getCookie("userColorPreference") || originalPrimaryColor;
  const colorList = [
    "#FF0000", // Basic Red
    "#8f00ff", // Violet
    "#0000FF", // Basic Blue
    "#FFA500", // Basic Orange
    "#32CD32", // Lime Green
    "#40E0D0", // Basic Turquoise
    "#ff0090", // Neon Pink
    "#39FF14", // Neon Green
    "#CCFF00", // Neon Yellow
    "#FF3F34", // Neon Orange
    "#00C9FF", // Neon Blue
    "#FF073A", // Neon Red
    "#9400D3", // Neon Purple
    "#00F9FF", // Neon Cyan
    "#FF00F6", // Neon Magenta
    "#BFFF00", // Neon Lime
    "#278476", // i-75 teal
  ];

  if (!colorList.includes(originalPrimaryColor)) {
    colorList.unshift(originalPrimaryColor); // Ensure original color is always an option
  }
  initializeColorOptions(colorList, savedColor, originalPrimaryColor);
  updateThemeColors(savedColor);

  // Setup for color change checkbox and popup
  setupColorChangePopup();

  // Add event listener for the reset button click
  document
    .getElementById("reset-color-button")
    .addEventListener("click", function () {
      updateThemeColors(originalPrimaryColor, true);
      closeColorPopup();
    });
});

function setupColorChangePopup() {
  const colorChangeCheckbox = document.getElementById("color-change-checkbox");
  const colorPopup = document.getElementById("top-bar-color-popup");

  colorChangeCheckbox.addEventListener("change", function () {
    if (this.checked) {
      colorPopup.classList.remove("hide");
      colorPopup.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      colorPopup.classList.add("hide");
    }
  });
}

function initializeColorOptions(colorList, defaultColor, originalPrimaryColor) {
  const container = document.getElementById("color-button-container");
  container.innerHTML = ""; // Clear existing options

  // First, create and append all color options
  colorList.forEach((color) => {
    const [radioButton, label] = createColorOption(
      color,
      color === defaultColor
    );
    container.appendChild(radioButton);
    container.appendChild(label);
  });
}

// theme mode background
function toggleTheme(isChecked) {
  const themeClass = isChecked ? "light" : "dark";
  const removeClass = isChecked ? "dark" : "light";
  const iconToShow = isChecked ? "icon-sun" : "icon-moon";
  const iconToHide = isChecked ? "icon-moon" : "icon-sun";

  // Toggle theme classes on the body
  document.body.classList.add(themeClass);
  document.body.classList.remove(removeClass);

  // Toggle icons
  document.getElementById(iconToShow).style.display = "inline";
  document.getElementById(iconToHide).style.display = "none";
}

// Event listener for the checkbox
document
  .getElementById("toggle-checkbox")
  .addEventListener("change", function () {
    toggleTheme(this.checked);
  });

function forceRepaint() {
  const body = document.body;
  body.style.display = "none";
  body.offsetHeight; // No need to store this anywhere, the reflow will happen
  body.style.display = "";
}
