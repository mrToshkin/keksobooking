'use strict';

const CARDS_COUNT = 8;
const AVATARS_COUNT = 8;
const TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
let palace = 'Дворец', flat = 'квартира', house = 'Дом', bungalo = 'Бунгало';
let types = [palace, flat, house, bungalo];

let pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
let cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
let cards = [];

let shuffleNums = shuffle(getNums(AVATARS_COUNT));
for (let i = 0; i < CARDS_COUNT; i++) {
  cards.push({
    author: {
      avatar: `img/avatars/user0${shuffleNums[i] + 1}.png`
    },
    offer: {
      title: TITLES[shuffleNums[i]],
      address: '',
      price: `${randomInteger(1000, 1000000)}`,
      type: types[randomInteger(0, 3)],
      rooms: randomInteger(1, 5),
      guests: randomInteger(1, 10),
      checkin: `1${randomInteger(2, 4)}:00`,
      checkout: `1${randomInteger(2, 4)}:00`,
      features: [],
      description: '',
      photos: shuffle(PHOTOS) //NOTE перемешивает один раз для всех. У всех одинаковая перемешка =\
    },
    location: {
      x: randomInteger(0, 890),
      y: randomInteger(130, 630)
    }
  });
  
  cards[i].offer.address = cards[i].location.x + ', ' + cards[i].location.y;
  
  for(let j = 0,
    shuffledFeatures = shuffle(FEATURES),
    randomFeaturesLength = randomInteger(0, FEATURES.length);
    j < randomFeaturesLength;
    j++) {
      cards[i].offer.features.push(shuffledFeatures[j])
  }
}

let fragmentPin = document.createDocumentFragment();
let fragmentCard = document.createDocumentFragment();

for (var i = 0; i < cards.length; i++) {
  fragmentPin.appendChild(renderPin(cards[i]));
}
fragmentCard.appendChild(renderCard(cards[0]));

document.querySelector('.map__pins').appendChild(fragmentPin);
document.querySelector('.map').insertBefore(fragmentCard, document.querySelector('.map__filters-container'));

function renderPin(cardsArray) {
  let pin = pinTemplate.cloneNode(true);
  
  pin.style.left = cardsArray.location.x + 'px';
  pin.style.top = cardsArray.location.y + 'px';
  pin.querySelector('img').src = cardsArray.author.avatar;
  
  return pin;
}
function renderCard(cardsArray) {
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
  
  console.log(cardsArray.offer.features);
  return card;
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}
function shuffle(array) {
  let i = array.length,
      j = 0,
      temp;

  while (i--) {
      j = Math.floor(Math.random() * (i+1));

      // swap randomly chosen element with current element
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }

  return array;
}
function getNums(count) {
  let nums = [];

  for (let i = 0; i < count; i++) {
    nums.push(i);
  }

  return nums;
}

document.querySelector('.map').classList.remove('map--faded');
console.log(cards);