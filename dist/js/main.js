"use strict";

console.log("hello, chello. GoogleFlickr1.0");
var picSearch_button = document.querySelector("[name='picSearch_button']");
var picSearch_query = document.querySelector("[name='SearchInputField']");

(function () {
  console.log('flicker function booted...');
  var API_URL_BASE = 'https://www.flickr.com/services/rest/?method=flickr.photos.getPopular&api_key=47fa016833c10c7cf777062f48eb2908&user_id=184085204%40N06&format=json&nojsoncallback=1';

  function makeSearchRequest(event) {
    //changes value/calls getUserData()
    //presents the browser from doing default behavior like refreshing/loading/ etc
    event.preventDefault();
    var photoSearch = picSearch_query.value;
    console.log('value of photo query: ', photoSearch); // getQueryData(quickSearch)
  }

  picSearch_button.addEventListener("click", makeSearchRequest);
})();
//# sourceMappingURL=main.js.map
