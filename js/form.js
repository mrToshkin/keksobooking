'use strict';

let rooms = document.querySelector('#room_number');
let guests = document.querySelector('#capacity');

guests.addEventListener('input', function(evt) {
  let target = evt.target;
  compareInputs(target, rooms); //guests, rooms
});
rooms.addEventListener('input', function(evt) {
  let target = evt.target;
  compareInputs(guests, target); //guests, rooms
});

function compareInputs(A, B) {
  A.setCustomValidity('');
  B.setCustomValidity('');

  outer:
  for (let i = 0; i < A.children.length; i++) {    // i - A  | guests
    for (let j = 0; j < B.children.length; j++) { // j - B | rooms
      if (A.children[i].selected && B.children[j].selected && i > j) {
        A.setCustomValidity('Количество мест должно быть равно или меньше количеству комнат');
        break outer;
      } else {
        A.setCustomValidity('');
      }
    }
  }
}
