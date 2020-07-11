'use strict';

(function() {
  let $perent = document.querySelector(`.ad-form__photo-container`);
  let $element = $perent.querySelectorAll(`.ad-form__photo`);
  
  for(let task of $element) {
    task.draggable = true;
  }
  
  $perent.addEventListener(`dragstart`, (evt) => evt.target.classList.add(`selected`));
  $perent.addEventListener(`dragend`, (evt) => evt.target.classList.remove(`selected`));
  $perent.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();
    
    let $selected = $perent.querySelector(`.selected`);
    let target = evt.target;
    let isMoveable = $selected !== target && target.classList.contains(`ad-form__photo`);
    let next = ($selected.nextElementSibling === target)? target.nextElementSibling : target;
      
    if(!isMoveable) {
      return;
    }
    
    if(
      next && 
      $selected === next.previousElementSibling ||
      $selected === next
    ) {
      return;
    }
      
    $perent.insertBefore($selected, next);
  });
})();