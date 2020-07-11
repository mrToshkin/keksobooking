'use strict';

(function() {
  let $form = document.querySelector('.ad-form');
  let $rooms = $form.querySelector('#room_number');
  let $guests = $form.querySelector('#capacity');

  $form.addEventListener('submit', evt => {
    let resetForm = () => $form.reset();
    window.backend.save(new FormData($form), resetForm)
    evt.preventDefault();
  });

  $guests.addEventListener('input', evt => {
    compareInputs(evt.target, $rooms); //guests, rooms
  });
  $rooms.addEventListener('input', evt => {
    compareInputs($guests, evt.target); //guests, rooms
  });

  function compareInputs(A, B) {
    A.setCustomValidity('');
    B.setCustomValidity('');

    outer:
    for (let i = 0; i < A.children.length; i++) {    // i - A  | guests
      for (let j = 0; j < B.children.length; j++) {  // j - B  | rooms
        if (A.children[i].selected && B.children[j].selected && i > j) {
          A.setCustomValidity('Количество мест должно быть равно или меньше количеству комнат');
          break outer;
        } else {
          A.setCustomValidity('');
        }
      }
    }
  }
})();