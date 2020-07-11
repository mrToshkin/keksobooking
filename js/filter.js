'use strict';

(function() {
  const DEBOUNCE_INTERVAL = 500;

  let $filters = document.querySelector('.map__filters');
  let inputs;
  let featuresChosen;
  let filteredData
  
  $filters.addEventListener('change', () => {
    let features = [ "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner" ];

    inputs = Array
      .from($filters)
      .map((it) => it.value)
      .slice(0, 4);
    let checkboxes = Array
      .from($filters)
      .map((it) => it.checked)
      .slice(5, 11);

    featuresChosen = features.filter( (n, i) => checkboxes[i] === true);
    // вложенные объекты всё равно копируются по ссылке, не клонируются
    // let cloneData = window.map.data.slice();
    filteredData = window.map.data.filter(compare);
    updatePins();
  });
  
  let updatePins = debounce(() => {
    window.map.insertPins(filteredData);
    window.map.onPinClick(filteredData);
  });

  function compare(item) {
    if ((inputs[0] === 'any' || item.offer.type === window.map.engToRus[inputs[0]]) && // any, palace, flat, house, bungalo;

      ((inputs[1] === 'any') ||
      (item.offer.price < 10000 && inputs[1] === 'low') ||
      (item.offer.price >= 10000 && item.offer.price <= 50000 && inputs[1] === 'middle') ||
      (item.offer.price > 50000 && inputs[1] === 'high')) && // any, low(<10k), middle(10k - 50k), high(>50k);

      (inputs[2] === 'any' || item.offer.rooms === +inputs[2]) && // any, 1, 2, 3;

      (inputs[3] === 'any' || item.offer.guests === +inputs[3]) && // any, 2, 1, 0;

      (arrayComparator(item.offer.features, featuresChosen))) {
      return true;
    } else {
      return false;
    }

    function arrayComparator(have, choose) {
      let temp = 0;

      choose.forEach(n => { if (have.includes(n)) temp += 1; })

      if (temp === choose.length) {
        return true;
      } else {
        return false;
      }
    }
  }

  function debounce(fn) {
    let lastTimeout = null;

    return function() {
      let args = arguments;

      if (lastTimeout) clearTimeout(lastTimeout);

      lastTimeout = setTimeout(function() {
        fn.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  }
})();