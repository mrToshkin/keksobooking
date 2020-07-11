'use strict';

(function(){
  let pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  window.pin = {
    createPin: cardsArray => {
      let pin = pinTemplate.cloneNode(true);
      
      pin.style.left = cardsArray.location.x + 'px';
      pin.style.top = cardsArray.location.y + 'px';
      pin.querySelector('img').src = cardsArray.author.avatar;
      
      return pin;
    }
  }
})();