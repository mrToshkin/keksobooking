'use strict';

(function(){
  let cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  
  window.card = {
    createCard: function(cardsArray) {
      let card = cardTemplate.cloneNode(true);     
      
      card.querySelector('.popup__title').textContent = cardsArray.offer.title;
      card.querySelector('.popup__text--address').textContent = cardsArray.offer.address;
      card.querySelector('.popup__text--price').textContent = cardsArray.offer.price + '₽/ночь';
      card.querySelector('.popup__type').textContent = cardsArray.offer.type;
      card.querySelector('.popup__text--capacity').textContent = cardsArray.offer.rooms + ' комнаты для ' + cardsArray.offer.guests + ' гостей';
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardsArray.offer.checkin + ', выезд до ' + cardsArray.offer.checkout;
      card.querySelector('.popup__description').textContent = cardsArray.offer.description;
      card.querySelector('.popup__avatar').src = cardsArray.author.avatar;
    
      /* // Решение 1
      if(cardsArray.offer.features.length != 0) {
        for(let i = 11; i >= 0;) {
          for(let j = 0; j < cardsArray.offer.features.length;) {
            if(features.childNodes[i].classList[1] == 'popup__feature--' + cardsArray.offer.features[j]) {
              i -= 2;
              j = cardsArray.offer.features.length + 1;
              break;
            } else if (j + 1 === cardsArray.offer.features.length) {
              features.removeChild(features.childNodes[i]);
              features.removeChild(features.childNodes[i]);
              i -= 2;
              j++;
              break;
            } else {
              j++;
            }
          }
        }
      } else {
        while(features.firstChild) {
          features.removeChild(features.firstChild);
        }
      } */
    
      // Решение 2
      let features = card.querySelector('.popup__features'),
          photos = card.querySelector('.popup__photos'),
          fragmentFeatures = document.createDocumentFragment(),
          fragmentPhotos = document.createDocumentFragment(),
          feature = features.childNodes[1],
          photo = photos.childNodes[1];
    
      for (let i = 0; i < cardsArray.offer.features.length; i++) {
        fragmentFeatures.appendChild(createElementFeature(cardsArray.offer.features[i], feature));
      }
      for (let i = 0; i < cardsArray.offer.photos.length; i++) {
        fragmentPhotos.appendChild(createElementPhoto(cardsArray.offer.photos[i], photo));
      }
      
      while(features.firstChild) features.removeChild(features.firstChild);
      while(photos.firstChild) photos.removeChild(photos.firstChild);
      
      features.appendChild(fragmentFeatures);
      photos.appendChild(fragmentPhotos);
      
      function createElementFeature(array, element) {
        let clone = element.cloneNode(true);
        clone.classList = 'popup__feature popup__feature--' + array;
        return clone;
      }
      function createElementPhoto(array, element) {
        let clone = element.cloneNode(true);
        clone.src = array;
        return clone;
      }
      
      return card;
    },
    removeCard: function() {
      let card = document.querySelector('.map__card'); 
      if (card) card.remove();
    }
  }
})();