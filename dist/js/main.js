"use strict";

console.log("hello, chello. GoogleFlickr1.0");
var picSearch_button = document.querySelector("[name='picSearch_button']");
var picSearch_query = document.querySelector("[name='SearchInputField']");

(function () {
  console.log('flicker function booted...');
  var API_URL_BASE = 'https://www.flickr.com/services/rest/?method=flickr.photos.getPopular&api_key=47fa016833c10c7cf777062f48eb2908&user_id=184085204%40N06&format=json&nojsoncallback=1';

  function getQueryData(photoQuery) {
    console.log("fetching with GET:" + photoQuery);
    Axios.get(API_URL_BASE, {
      params: {}
    });
  }

  function makeSearchRequest(event) {
    //changes value/calls getUserData()
    //presents the browser from doing default behavior like refreshing/loading/ etc
    event.preventDefault();
    var photoSearch = picSearch_query.value;
    console.log('value of photo query: ', photoSearch); //getQueryData(photoSearch)
  }

  picSearch_button.addEventListener("click", makeSearchRequest); ////-----------GOOGLE MAPS---------------- GOOGLE MAPS------------------GOOGLE MAPS-----////

  var map; //var service;

  var markers = [];
  var infowindow = null;

  function initMap() {
    console.log("init map is here");
    var circus = {
      lat: 33.813245,
      lng: -84.362171
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: circus,
      zoom: 12
    }); //makes places API a variable 

    var content = "something about this marker";
    infowindow = new google.maps.InfoWindow({
      content: content
    }); //marker uses parameters and must include map: map to load the mapAPI 
    //var marker = new google.maps.Marker({position: circus, map: map});

    function showContentInWindow(newContent) {
      //variable is placed in new content window
      infowindow.setContent(newContent); //content is set above the indicated marker

      infowindow.open(map, marker);
    } // marker.addListener("click", function (){
    //   //content is passed through the function 
    //   showContentInWindow("this is new content");
    //   console.log("clicky");
    // });

  }

  window.initMap = initMap;
})();
//# sourceMappingURL=main.js.map
