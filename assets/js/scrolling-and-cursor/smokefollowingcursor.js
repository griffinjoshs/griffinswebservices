// smokefollowingcursor.js
document.addEventListener("DOMContentLoaded", function () {
  // Define lastMousePosition at the start of your script
  let lastMousePosition = { x: 0, y: 0 };

  const cursor = document.querySelector(".cursor");
  const canvas = document.getElementById("smokeCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let isScrolling = false;
  window.addEventListener("scroll", () => {
    isScrolling = true;
    setTimeout(() => {
      isScrolling = false;
    }, 100); // Reset scrolling flag after a short delay
  });

  let particles = [];
  let mouse = { x: null, y: null, speedX: 0, speedY: 0 };
  let isMouseMoving = false;

  window.addEventListener("mousemove", (e) => {
    clearTimeout(window.mouseMoveTimeout);
    isMouseMoving = true;
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    // Adjust for scroll offsets
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    cursor.style.left = mouse.x + scrollX + "px";
    cursor.style.top = mouse.y + scrollY + "px";

    // Set a timeout to reset the flag after a short period of inactivity
    window.mouseMoveTimeout = setTimeout(() => {
      isMouseMoving = false;
    }, 100);

    // Calculate mouse speed based on previous position
    if (lastMousePosition.x !== null && lastMousePosition.y !== null) {
      // Calculate the difference between the current and last mouse positions
      let deltaX = e.pageX - lastMousePosition.x;
      let deltaY = e.pageY - lastMousePosition.y;

      // Use deltaX and deltaY to set speedX and speedY for particle generation
      mouse.speedX = deltaX;
      mouse.speedY = deltaY;
    }

    // Update the lastMousePosition for the next event
    lastMousePosition.x = e.pageX;
    lastMousePosition.y = e.pageY;

    // Set a timeout to reset isMouseMoving flag
    clearTimeout(window.mouseMoveTimeout);
    isMouseMoving = true;
    window.mouseMoveTimeout = setTimeout(() => {
      isMouseMoving = false;
    }, 100); // Adjust timeout as needed
  });

  let clicking = false;
  let clickParticlesInterval;
  let clickDuration = 0;

  function burstParticles() {
    const burstAmount = Math.min(Math.floor(clickDuration / 100), 10); // Increase particles based on click duration
    for (let i = 0; i < 2 + burstAmount; i++) {
      particles.push(
        new Particle(
          mouse.x,
          mouse.y,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        )
      );
    }
  }

  window.addEventListener("mousedown", (e) => {
    clicking = true;
    clickDuration = 0; // Reset the duration for each new click

    // Start the particle generation
    clickParticlesInterval = setInterval(() => {
      burstParticles();
      clickDuration += 100; // Increase the duration every 100ms
    }, 100); // Generate particles every 100ms
  });

  window.addEventListener("mouseup", (e) => {
    clicking = false;
    clearInterval(clickParticlesInterval); // Stop generating particles on mouse up
  });

  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  class Particle {
    constructor(x, y, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 20 + 10; // Adjusted for subtler effect
      this.speedX = speedX * 0.5; // Slower speed for gentleness
      this.speedY = speedY * 0.5;
      let primaryColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary-color")
          .trim() || "#ff0000";
      this.color = this.adjustOpacity(primaryColor, 0.05); // More transparent
    }

    adjustOpacity(color, opacity) {
      if (color[0] === "#") {
        let r = parseInt(color.slice(1, 3), 16),
          g = parseInt(color.slice(3, 5), 16),
          b = parseInt(color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
      } else {
        return color; // Placeholder for non-hex colors
      }
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      // Inside the update method of Particle
      if (this.size > 0.1) this.size -= 0.05; // Slower shrink rate
    }

    draw() {
      ctx.beginPath();
      // Generate a 'smoky' shape by drawing several overlapping arcs
      const angleStep = (Math.PI * 2) / 10; // Divide the circle into 10 parts
      for (let i = 0; i < Math.PI * 2; i += angleStep) {
        const radiusOffset = Math.random() * 5 - 2.5; // Randomize radius size slightly for each segment
        const radius = this.size + radiusOffset;
        const x = this.x + Math.cos(i) * radius;
        const y = this.y + Math.sin(i) * radius;

        // First point moves to start, subsequent points draw lines
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function handleParticles() {
    // Generate new particles only if there's movement or scrolling
    if (isMouseMoving || isScrolling) {
      for (let i = 0; i < 2; i++) {
        // Adjust the number based on desired density
        particles.push(
          new Particle(mouse.x, mouse.y, mouse.speedX, mouse.speedY)
        );
      }
    }

    // Always update and draw existing particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].size <= 0.3) {
        particles.splice(i, 1);
        i--;
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles(); // This now takes care of both adding new and updating existing particles
    requestAnimationFrame(animate);
  }

  animate(); // Start the animation loop
});

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
    width: "200px",
    height: "200px",
    borderRadius: "var(--rounded-border-radius);",
    textAlign: "center",
    textDecoration: "none",
    boxShadow: "var(--primaryShadow)",
    filter: "var(--primary-shadow)",
    zIndex: "10",
    pointerEvents: "none",
  };

  // Usage example for <h1> tags
  dynamicCursorHover("h1.animatedText", hoverStyles);

  // Update the .cursor position on mouse move
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.pageX + "px";
    cursor.style.top = e.pageY + "px";
  });
});
