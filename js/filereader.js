'use strict';

(function () {
  let FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  let $reset = document.querySelector('.ad-form__reset');

  let $avaInput = document.querySelector('.ad-form__field input[type=file]');
  let $avaPreview = document.querySelector('.ad-form-header__preview img');
  
  let $photoPerent = document.querySelector('.ad-form__photo-container')
  let $photoInput = document.querySelector('.ad-form__upload input[type=file]');
  let $photoPreviewDefault = document.querySelector('.ad-form__photo');

  $avaInput.addEventListener('change', () => {
    showPreview({
      input: $avaInput,
      preview: $avaPreview,
      index: 0
    });
  });

  $photoInput.addEventListener('change', () => {
    while ($photoPerent.children.length > 1) $photoPerent.removeChild($photoPerent.lastChild);

    Array.prototype.forEach.call($photoInput.files, (n, i) => {
      let $preview = createPreview();
      showPreview({
        input: $photoInput,
        preview: $preview,
        index: i
      });
      $photoPerent.appendChild($preview);
    });
  });

  $reset.addEventListener('click', () => {
    $avaPreview.src = 'img/muffin-grey.svg';
    while ($photoPerent.children.length > 1) $photoPerent.removeChild($photoPerent.lastChild);
    $photoPerent.appendChild($photoPreviewDefault);
  })

  function showPreview(f /* input, preview, index */) {
    let file = f.input.files[f.index];
    let fileName = file.name.toLowerCase();
    
    let matches = FILE_TYPES.some( n => fileName.endsWith(n) );
    if(matches) {
      let reader = new FileReader();

      reader.addEventListener('load', () => f.preview.src = reader.result );

      reader.readAsDataURL(file);
    }
  }

  function createPreview() {
    let img = document.createElement('img');
    img.className = 'ad-form__photo'
    img.alt = 'Фото жилья';
    img.width = '70'
    img.height = '70'
    
    return img;
  }
})();
