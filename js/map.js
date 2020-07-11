'use strict';

(function() {
  const ENTER_KEYCODE = 13;
  const PinMain = {
    HEIGHT: 80,
    WIDTH: 64
  };

  let $map = document.querySelector('.map');
  let $pinMain = $map.querySelector('.map__pin--main');
  let $form = document.querySelector('.ad-form');
  let $fieldsets = document.querySelectorAll('fieldset');
  let $pins;

  window.map = {
    data: [],
    engToRus: {
      'palace':  'Дворец',
      'flat':    'Квартира',
      'house':   'Дом',
      'bungalo': 'Бунгало'
    },
    insertPins: pins => {
      if (pins) {
        let fragmentPin = document.createDocumentFragment();
        let pinsAmount = pins.length > 5 ? 5 : pins.length;
        let $pinsPerent = document.querySelector('.map__pins');

        while ($pinsPerent.children.length > 2) $pinsPerent.removeChild($pinsPerent.lastChild);

        for (let i = 0; i < pinsAmount; i++) {
          fragmentPin.appendChild(window.pin.createPin(pins[i]));
        }
        $pinsPerent.appendChild(fragmentPin);
      }
    },
    onPinClick: data => {
      let fragmentCard = document.createDocumentFragment();
      $pins = $map.querySelectorAll('.map__pin');
  
      for (let i = 1; i < $pins.length; i++) {
        $pins[i].addEventListener('click', () => {
          window.card.removeCard();
          fragmentCard.appendChild(window.card.createCard(data[i-1]));
          $map.insertBefore(fragmentCard, $map.querySelector('.map__filters-container'));
          $map.querySelector('.popup__close').addEventListener('click', window.card.removeCard);
        });
      }
    }
  }

  function onSuccess(response) {
    window.map.data = response;

    window.map.data.forEach( item => {
      let temp = window.map.engToRus[item.offer.type];
      item.offer.type = temp;
      /* switch (item.offer.type) {
        case "palace":  item.offer.type = "Дворец";    break;
        case "flat":    item.offer.type = "Квартира";  break;
        case "house":   item.offer.type = "Дом";       break;
        case "bungalo": item.offer.type = "Бунгало";   break;
      } */
    });
    window.map.insertPins(window.map.data);
    window.map.onPinClick(window.map.data);
  }

  disableFieldsets();
  setFormAddress();

  $pinMain.addEventListener('keyup', onPinMainKeyup);
  $pinMain.addEventListener('mousedown', evt => {
    let $main = document.querySelector('main');
    let $overlay = document.querySelector('.map__overlay');

    window.dnd({
      event: evt,
      small: $pinMain,
      smallOffsetX: (PinMain.WIDTH / 2),
      smallOffsetY: PinMain.HEIGHT,
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

  function activateMap() {
    if (!$pins) {
      // вложенные объекты всё равно копируются по ссылке, не клонируются
      // let cloneData = window.map.data.slice();
      window.backend.load(onSuccess);
    }
    if ($map.classList.contains('map--faded')) {
      setFormAddress();
      enableFieldsets();
      $map.classList.remove('map--faded');
      $form.classList.remove('ad-form--disabled');
    }
  }
  function onPinMainKeyup(evt) {
    if (evt.keyCode == ENTER_KEYCODE) {
      activateMap();
      $pinMain.removeEventListener('keyup', onPinMainKeyup);
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
    formInputAddress.value = `${$pinMain.offsetLeft + (PinMain.WIDTH / 2)}, ${$pinMain.offsetTop + PinMain.HEIGHT}`;
  }
})();