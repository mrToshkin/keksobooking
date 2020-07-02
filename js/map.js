'use strict';

(function() {
  const ENTER_KEYCODE = 13
  const PIN_MAIN_HEIGHT = 80;
  const PIN_MAIN_WIDTH = 64;

  let $map = document.querySelector('.map');
  let $pinsPerent = $map.querySelector('.map__pins');
  let $pinMain = $map.querySelector('.map__pin--main');
  let $form = document.querySelector('.ad-form');
  let $fieldsets = document.querySelectorAll('fieldset');
  let $pins;
  let data;

  disableFieldsets();
  setFormAddress();
  window.backend.load(onSuccess);

  $pinMain.addEventListener('keyup', onPinMainKeyup);
  $pinMain.addEventListener('mousedown', function(evt) {
    let $main = document.querySelector('main');
    let $overlay = document.querySelector('.map__overlay');

    window.dnd({
      event: evt,
      small: $pinMain,
      smallOffsetX: (PIN_MAIN_WIDTH / 2),
      smallOffsetY: PIN_MAIN_HEIGHT,
      bigOffsetX: $main.offsetLeft,
      limits: {
        top: $overlay.offsetTop + 130,
        right: $main.offsetLeft + $overlay.offsetWidth,
        bottom: 630,
        left: $main.offsetLeft
      },
      callbackFirst: activateMap,
      callbackAllways: setFormAddress
    });
  });

  function onSuccess(response) {
    data = response;

    for (let i = 0; i < data.length; i++) {
      switch (data[i].offer.type) {
        case "palace":  data[i].offer.type = "Дворец";    break;
        case "flat":    data[i].offer.type = "Квартира";  break;
        case "house":   data[i].offer.type = "Дом";       break;
        case "bungalo": data[i].offer.type = "Бунгало";   break;
      }
    }
  }

  function activateMap() {
    if (!$pins) {
      insertPins();
      $pins = $map.querySelectorAll('.map__pin');
      onPinClick();
    }
    if ($map.classList.contains('map--faded')) {
      setFormAddress();
      enableFieldsets();
      $map.classList.remove('map--faded');
      $form.classList.remove('ad-form--disabled');
    }
  }

  function insertPins() {
    if (data) {
      let fragmentPin = document.createDocumentFragment();
    
      for (let i = 0; i < data.length; i++) {
        fragmentPin.appendChild(window.pin.createPin(data[i]));
      }
      $pinsPerent.appendChild(fragmentPin);
    }
  }
  function onPinMainKeyup(evt) {
    if (evt.keyCode == ENTER_KEYCODE) {
      activateMap();
      $pinMain.removeEventListener('keyup', onPinMainKeyup);
    }
  } 
  function onPinClick() {
    let fragmentCard = document.createDocumentFragment();
  
    for (let i = 1; i < $pins.length; i++) {
      $pins[i].addEventListener('click', function() {
        window.card.removeCard();
        fragmentCard.appendChild(window.card.createCard(data[i-1]));
        $map.insertBefore(fragmentCard, $map.querySelector('.map__filters-container'));
        $map.querySelector('.popup__close').addEventListener('click', window.card.removeCard);
      });
    }
  }

  function disableFieldsets() {
    for (let i = 0; i < $fieldsets.length; i++) {
      $fieldsets[i].disabled = true;
    }
    $form.classList.add('ad-form--disabled');
  }
  function enableFieldsets() {
    for (let i = 0; i < $fieldsets.length; i++) {
      $fieldsets[i].disabled = false;
    };
    $form.classList.remove('ad-form--disabled');
  }
  function setFormAddress() {
    let formInputAddress = $form.querySelector('#address');
    formInputAddress.value = `${$pinMain.offsetLeft + (PIN_MAIN_WIDTH / 2)}, ${$pinMain.offsetTop + PIN_MAIN_HEIGHT}`;
  }
})();