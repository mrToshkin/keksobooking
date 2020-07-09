'use strict';

(function(){
  const Pin = {
    HEIGHT: 70,
    WIDTH: 25
  };

  const CARDS_AMOUNT = 8;
  const AVATARS_AMOUNT = 8;
  const TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  const PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
  let palace = 'Дворец', flat = 'Квартира', house = 'Дом', bungalo = 'Бунгало';
  let types = [palace, flat, house, bungalo];

  let $overlay = document.querySelector('.map__overlay');
  let shuffleNums = shuffle(getNums(AVATARS_AMOUNT));

  window.data = [];
  for (let i = 0; i < CARDS_AMOUNT; i++) {
    window.data.push(mockUnit(i))
    window.data[i].offer.address = (window.data[i].location.x + Pin.WIDTH) + ', ' + (window.data[i].location.y + Pin.HEIGHT);
    window.data[i].offer.features = randomLength(shuffle(FEATURES));
  }

  function mockUnit(i) {
    let unit = {
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
        x: randomInteger(0, $overlay.offsetWidth - Pin.WIDTH),
        y: randomInteger((130 - Pin.HEIGHT), (630 - Pin.HEIGHT))
      }
    };

    return unit;
  }
  function randomLength(array) {
    let newLength = randomInteger(0, array.length);
    let newArray = [];

    for (let j = 0; j < newLength; j++) {
      newArray.push(array[j]);
    }

    return newArray;
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
  function getNums(amount) {
    let nums = [];
  
    for (let i = 0; i < amount; i++) {
      nums.push(i);
    }
  
    return nums;
  }
})();