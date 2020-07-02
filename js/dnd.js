'use strict';

(function() {
  window.dnd = function(f) {
    /* f = {
      event: '',
      small: '',
      smallOffsetX: '',
      smallOffsetY: '',
      bigOffsetX: '',
      limits: {
        top: '',
        right: '',
        bottom: '',
        left: ''
      },
      callbackFirst: '',
      callbackAllways: ''
    }; */
    let isDrag = false;

    // решение 1 с центрированием pin на курсоре
    onMouseDown(f.event);

    function onMouseDown(evt) {
      evt.preventDefault();
      isDrag = true;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      f.callbackFirst();
    }
    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      if (isDrag) {
        move(moveEvt);
      }
    }
    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      isDrag = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      f.callbackAllways();
    }
    
    function move(evt) {
      let newLocation = {
        x: f.limits.left,
        y: f.limits.top
      };

      if (evt.pageX > f.limits.right) {
        newLocation.x = f.limits.right - f.bigOffsetX;
      } else if (evt.pageX <= f.limits.left) {
        newLocation.x = f.limits.left - f.bigOffsetX;
      } else if (evt.pageX > f.limits.left) { 
        newLocation.x = evt.pageX - f.bigOffsetX;
      }

      if (evt.pageY > f.limits.bottom) {
        newLocation.y = f.limits.bottom;
      } else if (evt.pageY > f.limits.top) {
        newLocation.y = evt.pageY;
      }

      relocate(newLocation);
      f.callbackAllways();
    }
    function relocate(newLocation) {
      f.small.style.left = (newLocation.x - f.smallOffsetX) + 'px';
      f.small.style.top = (newLocation.y - f.smallOffsetY) + 'px';
    }

    /* // Решение 2 без центрирования pin на курсоре
    onMouseDown(evt);

    function onMouseDown(evt) {
      evt.preventDefault();

      let dragged = false;
      let startCoords = {
        x: evt.pageX,
        y: evt.pageY
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      cbFirst();

      function onMouseMove(moveEvt) {

        moveEvt.preventDefault();

        dragged = true;

        let shift = {
          x: startCoords.x - moveEvt.pageX,
          y: startCoords.y - moveEvt.pageY
        };

        startCoords = {
          x: moveEvt.pageX,
          y: moveEvt.pageY
        };

        if (moveEvt.pageX > f.limits.right + pinWidth) {
          pin.style.left = (f.limits.right - f.bigOffsetX.offsetLeft + (pinWidth / 2)) + 'px';
        } else if (moveEvt.pageX < f.limits.left) {
          pin.style.left = (f.limits.left - f.bigOffsetX.offsetLeft - (pinWidth / 2)) + 'px';
        } else if (moveEvt.pageX > f.limits.left) { 
          pin.style.left = (pin.offsetLeft - shift.x) + 'px';
        }

        if (moveEvt.pageY > f.limits.bottom + pinHeight) {
          pin.style.top = (f.limits.bottom) + 'px';
        } else if (moveEvt.pageY < f.limits.top) {
          pin.style.top = (f.limits.bottom) + 'px';
        } else if (moveEvt.pageY > f.limits.top) {
          pin.style.top = (pin.offsetTop - shift.y) + 'px';
        }

        cbAllways();
      }

      function onMouseUp(upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (dragged) {
          var onClickPreventDefault = function (evt) {
            evt.preventDefault();
            pin.removeEventListener('click', onClickPreventDefault)
          };
          pin.addEventListener('click', onClickPreventDefault);
        }

        cbAllways();
      }
    } */
  }
})();