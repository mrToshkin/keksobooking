'use strict';

(function() {
  const ENTER_KEYCODE = 13
  const PIN_MAIN_HEIGHT = 80;
  const PIN_MAIN_WIDTH = 64;

  let mapElement = document.querySelector('.map');
  let pinsPerent = mapElement.querySelector('.map__pins');
  let pinMain = mapElement.querySelector('.map__pin--main');
  let form = document.querySelector('.ad-form');
  let fieldsets = document.querySelectorAll('fieldset');
  let pins;
  let isDrag = false;

  disableFieldsets();
  setFormAddress();
  pinMain.addEventListener('keyup', onPinMainKeyup);
  pinMain.addEventListener('mousedown', onPinMainMouseDown);

  // решение 1 с центрированием pinMain на курсоре
  function onPinMainMouseDown(evt) {
    evt.preventDefault();
    isDrag = true;
    document.addEventListener('mousemove', onPinMainMouseMove);
    document.addEventListener('mouseup', onPinMainMouseUp);
    activateMap();
  }
  function onPinMainMouseMove(moveEvt) {
    moveEvt.preventDefault();
    if (isDrag) {
      move(moveEvt);
    }
  }
  function onPinMainMouseUp(upEvt) {
    upEvt.preventDefault();
    isDrag = false;
    document.removeEventListener('mousemove', onPinMainMouseMove);
    document.removeEventListener('mouseup', onPinMainMouseUp);
    setFormAddress();
  }
  
  function move(evt) {
    let mainElement = document.querySelector('main');
    let mapOverlay = document.querySelector('.map__overlay');
    let limits = {
      top: mapOverlay.offsetTop + 130,
      right: mainElement.offsetLeft + mapOverlay.offsetWidth,
      bottom: 630,
      left: mainElement.offsetLeft
    };

    let newLocation = {
      x: limits.left,
      y: limits.top
    };

    if (evt.pageX > limits.right) {
      newLocation.x = limits.right - mainElement.offsetLeft;
    } else if (evt.pageX <= limits.left) {
      newLocation.x = limits.left - mainElement.offsetLeft;
    } else if (evt.pageX > limits.left) { 
      newLocation.x = evt.pageX - mainElement.offsetLeft;
    }

    if (evt.pageY > limits.bottom) {
      newLocation.y = limits.bottom;
    } else if (evt.pageY > limits.top) {
      newLocation.y = evt.pageY;
    }

    relocate(newLocation);
    setFormAddress();
    console.log(newLocation);
  }
  function relocate(newLocation) {
    pinMain.style.left = (newLocation.x - (PIN_MAIN_WIDTH / 2)) + 'px';
    pinMain.style.top = (newLocation.y - PIN_MAIN_HEIGHT) + 'px';
  }

/* // Решение 2 без центрирования pinMain на курсоре
  function onPinMainMouseDown(evt) {
    evt.preventDefault();

    let dragged = false;
    let startCoords = {
      x: evt.pageX,
      y: evt.pageY
    };

    document.addEventListener('mousemove', onPinMainMouseMove);
    document.addEventListener('mouseup', onPinMainMouseUp);
    activateMap();

    function onPinMainMouseMove(moveEvt) {
      let mainElement = document.querySelector('main');
      let mapOverlay = document.querySelector('.map__overlay');

      moveEvt.preventDefault();

      dragged = true;

      let limits = {
        top: mapOverlay.offsetTop + 130,
        right: mainElement.offsetLeft + mapOverlay.offsetWidth - PIN_MAIN_WIDTH,
        bottom: 630,
        left: mainElement.offsetLeft
      };

      let shift = {
        x: startCoords.x - moveEvt.pageX,
        y: startCoords.y - moveEvt.pageY
      };

      startCoords = {
        x: moveEvt.pageX,
        y: moveEvt.pageY
      };

      if (moveEvt.pageX > limits.right + PIN_MAIN_WIDTH) {
        pinMain.style.left = (limits.right - mainElement.offsetLeft + (PIN_MAIN_WIDTH / 2)) + 'px';
      } else if (moveEvt.pageX < limits.left) {
        pinMain.style.left = (limits.left - mainElement.offsetLeft - (PIN_MAIN_WIDTH / 2)) + 'px';
      } else if (moveEvt.pageX > limits.left) { 
        pinMain.style.left = (pinMain.offsetLeft - shift.x) + 'px';
      }

      if (moveEvt.pageY > limits.bottom + PIN_MAIN_HEIGHT) {
        pinMain.style.top = (limits.bottom) + 'px';
      } else if (moveEvt.pageY < limits.top) {
        pinMain.style.top = (limits.bottom) + 'px';
      } else if (moveEvt.pageY > limits.top) {
        pinMain.style.top = (pinMain.offsetTop - shift.y) + 'px';
      }

      setFormAddress();
    }

    function onPinMainMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onPinMainMouseMove);
      document.removeEventListener('mouseup', onPinMainMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (evt) {
          evt.preventDefault();
          pinMain.removeEventListener('click', onClickPreventDefault)
        };
        pinMain.addEventListener('click', onClickPreventDefault);
      }

      setFormAddress();
    }
  } */

  function activateMap() {
    if (!pins) {
      insertPins();
      pins = mapElement.querySelectorAll('.map__pin');
      onPinClick();
    }
    if (mapElement.classList.contains('map--faded')) {
      setFormAddress();
      enableFieldsets();
      mapElement.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
    }
  }

  function insertPins() {
    let fragmentPin = document.createDocumentFragment();
  
    for (let i = 0; i < window.data.length; i++) {
      fragmentPin.appendChild(window.pin.createPin(window.data[i]));
    }
    pinsPerent.appendChild(fragmentPin);
  }
  function onPinMainKeyup(evt) {
    if (evt.keyCode == ENTER_KEYCODE) {
      activateMap();
      pinMain.removeEventListener('keyup', onPinMainKeyup);
    }
  } 
  function onPinClick() {
    let fragmentCard = document.createDocumentFragment();
  
    for (let i = 1; i < pins.length; i++) {
      pins[i].addEventListener('click', function() {
        window.card.removeCard();
        fragmentCard.appendChild(window.card.createCard(window.data[i-1]));
        mapElement.insertBefore(fragmentCard, mapElement.querySelector('.map__filters-container'));
        mapElement.querySelector('.popup__close').addEventListener('click', window.card.removeCard);
      });
    }
  }

  function disableFieldsets() {
    for (let i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = true;
    }
  }
  function enableFieldsets() {
    for (let i = 0; i < fieldsets.length; i++) {
      fieldsets[i].disabled = false;
    };
  }
  function setFormAddress() {
    let formInputAddress = form.querySelector('#address');
    formInputAddress.value = `${pinMain.offsetLeft + (PIN_MAIN_WIDTH / 2)}, ${pinMain.offsetTop + PIN_MAIN_HEIGHT}`;
  }
})();