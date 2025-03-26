// Funkcija za detekciju iOS Safari
function isIosSafari() {
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  const iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/FxiOS/i);
  return iOSSafari;
}

// Funkcija za rješavanje problema s klikovima na iOS Safari
function removeHoverIosSafari() {
  if (!isIosSafari()) return;
  
  // Tap effect za linkove i gumbe
    document.body.addEventListener("click", function (event) {
        const target = event.target.closest("a, button"); // Ciljamo linkove i gumbe
        if (target) {
            target.style.transition = "opacity 0.2s ease-out";
            target.style.opacity = "0.5";
            
            setTimeout(() => {
                target.style.opacity = "1";
            }, 300); // Vraća opacity nakon 300ms
        }
    });

  // Tagovi od interesa: Obrađuj samo određene interaktivne elemente
  function shouldPrevent(target) {
    var tagName = target.tagName.toLowerCase();
    var datasetBind = target.dataset.bind;
    var preventFilter = (datasetBind && datasetBind.indexOf('click') > -1) || 
                        (tagName == 'a' || tagName == 'button');
    return preventFilter;
  }
  
  var eventSelector = {
    touchend: function (_, target) {
      // Resetiraj sve zastavice na touchend
      target.dataset._clicked_ = '';
      target.dataset._mousemove_ = '0';
      target.dataset._timeOutId_ = '';
    },
    mouseover: function (e) {
      e.preventDefault(); // Spriječi defaultno hover ponašanje
    },
    mousemove: function (e, target) {
      e.preventDefault(); // Spriječi defaultno hover ponašanje
      var _mousemoves = +(target.dataset._mousemove_ || '0');
      _mousemoves = _mousemoves + 1;
      console.log('mousemoves: ' + _mousemoves);
      target.dataset._mousemove_ = _mousemoves;
      // Pokreni click event nakon dovoljno pokreta
      if (_mousemoves > 1 && !target.dataset._timeOutId_) {
        var id = setTimeout(function () {
          console.log('double mousemove click fired');
          target.click(); // Simuliraj klik nakon pomicanja miša
        }, 80); // Prilagodi odgodu za fino podešavanje vremena click eventa
        target.dataset._timeOutId_ = id;
      }
    },
    click: function (e, target) {
      // Spriječi dvostruki klik
      if (target.dataset._clicked_) {
        // Ova provjera sprječava interferenciju s validnim praćenjem
        // i programskim click eventima.
        if (e.isTrusted) {
          console.log('prevented doubleclick');
          e.preventDefault();
        }
        return;
      }
      // Spriječi timeout klik
      if (target.dataset._timeOutId_) {
        console.log('cleared timeout');
        clearTimeout(+target.dataset._timeOutId_);
      }
      // Označi element kao kliknut
      target.dataset._clicked_ = 'true';
    }
  };
  
  function preventHover(e) {
    var target = e.target;
    // Preskoči elemente koji nemaju click handlere ili potrebne atribute
    if (!(target && target.click && target.tagName && target.dataset)) return;
    if (!shouldPrevent(target)) return;
    var type = e.type;
    console.log(type, target);
    eventSelector[type] && eventSelector[type](e, target);
  }
  
  // Dodaj event listenere za touch i mouse evente
  document.addEventListener('touchend', preventHover, true);
  document.addEventListener('mouseover', preventHover, true);
  document.addEventListener('mousemove', preventHover, true);
  document.addEventListener('click', preventHover, true);
}

// Inicijaliziraj fix za iOS Safari
function initIosSafariFix() {
  if (isIosSafari()) {
    removeHoverIosSafari();
  }
}

window.initIosSafariFix = initIosSafariFix;
initIosSafariFix(); 