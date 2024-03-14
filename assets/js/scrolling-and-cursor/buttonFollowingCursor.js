// function attachButtonToScroller(buttonSelector, scrollerSelector) {
//     const buttons = document.querySelectorAll(buttonSelector);
//     const scroller = document.querySelector(scrollerSelector);
  
//     scroller.addEventListener('mouseenter', function () {
//       const scrollerPosition = scroller.getBoundingClientRect();
//       buttons.forEach(button => {
//         const newPositionX = scrollerPosition.left - button.getBoundingClientRect().left; 
//         button.style.transform = `translateX(${newPositionX}px)`;
//       });
//     });
  
//     scroller.addEventListener('mouseleave', function () {
//       buttons.forEach(button => {
//         button.style.transform = 'translateX(0)';
//       });
//     });
//   }
  
//   document.addEventListener('DOMContentLoaded', function () {
//     attachButtonToScroller('button', '.cursor');
//   });
  