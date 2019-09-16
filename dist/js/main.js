"use strict";

//get photo id data from FLICKRs search.photo api
//set method to input flickr_params:/user_query and to only return images with geo data:true
// loop through data and store photo ids in an array [photoIDs]
// get geo data using photoIDs photo.getLocatoin api
// loop through data and set each as a marker with content window on google map's api 

/* store the info in an object
store the objects in an array
when (Flickr photo search) button is clicked:

create marker:
loop through array and for each object
create marker using its lat, lon, title
place marker on map*/

/*pull data to get ids, title, lon/lat. assign ids per div.
use ids to get photo urls

for each object in returned data, loop through and pull the id, title, lat/lon, and url. 
send your id and get your photo. use url to match divs.

get put on the page
 */
console.log("hello, chello. GoogleFlickr1.0"); //0. define global function variables

var resultsWindow = document.querySelector(".resultsWindow");
var picSearch_button = document.querySelector("[name='picSearch_button']");
var picSearch_query = document.querySelector("[name='SearchInputField']");
var tagsSearch_button = document.querySelector("[name='tagsSearch_button']");
var tagsSearch_query = document.querySelector("[name='tagsSearchInputField']");
var flickr_windows; //appends images to page 

var imgThumbnails = []; // array for collecting photo png srcs 

var markerLoad = []; //array for when marker data is created

var mapMarkers; // array where markers are stored 

var map; // calls goole map !!important

var infowindow = null;
;

(function () {
  //1. wrapped inside this function, define global function variables
  console.log('flicker function booted...'); //** the url containg info FLICKR needs to return requested data. User text is fed thru using template literals: ${var}. url stored in a var. */

  var SRCH_API_URL_BASE = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=47fa016833c10c7cf777062f48eb2908&tags=${tagsQuery}&text=${photoQuery}&max_upload_date=1567857600&has_geo=1&extras=geo&format=json&nojsoncallback=1';
  var INFO_API_URL_BASE = 'https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=47fa016833c10c7cf777062f48eb2908&photo_id=${photoID}&format=json&nojsoncallback=1';
  var IMGurl_API_URL_BASE = 'https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=47fa016833c10c7cf777062f48eb2908&photo_id=${photoID}&format=json&nojsoncallback=1'; ////-----------FLICKR---------------- FLICKR------------------FLICKR-----////
  //10. clears any markers from the map

  function clearOverlays() {
    //function to clear the markers from the arrays, deleting them from the map
    for (var i = 0; i < mapMarkers.length; i++) {
      mapMarkers[i].setMap(null);
    }

    mapMarkers.length = 0;
  } //9. pass in coordinates to marker creator


  function placeMarker(inputLat, inputLng, inputTitle, inputOwner, urlID) {
    console.log("creating marker..."); //console.log(imgThumbnails);

    var thumb = " ";
    var i;

    for (i = 0; i < imgThumbnails.length; i++) {
      thumb = imgThumbnails[i];
      console.log(thumb);
    } //pass through again to function that handles setting up content 


    var content = "<div>" + urlID + "<p>" + inputTitle + "</p><p>Photo by : " + inputOwner + "</p></div>";
    var infowindow = new google.maps.InfoWindow({
      content: content
    });
    var newLatLng = new google.maps.LatLng(inputLat, inputLng);
    var marker = new google.maps.Marker({
      position: newLatLng,
      map: map
    });
    console.log("adding to array");
    mapMarkers.push(marker); //when click on marker, show and set content on map 

    marker.addListener("click", function () {
      console.log("clicky click");
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });
  } //8. place photos on the page 


  function displayPhotoResults(urlID, photoTitle, photoDesc, photoLoc, photoOwner, sizeID) {
    //create div to hold all content
    var resultPane = document.createElement('div');
    resultPane.className = "flickr_result"; //create div to hold photo (loaded 2ms later)

    var resultImg = document.createElement('div');
    resultImg.className = "flickr_window";
    resultImg.id = urlID; //sets class as id for matching purposes 
    //create container for text

    var photoContent = document.createElement('div');
    photoContent.className = "flickr_content"; //create text divs

    var contentTitle = document.createElement('p');
    contentTitle.className = "photo_title";
    var contentDesc = document.createElement('p');
    contentDesc.className = "photo_desc";
    var contentLoc = document.createElement('p');
    contentLoc.className = "photo_location";
    var contentOwner = document.createElement('p');
    contentOwner.className = "photo_owner"; //create labels for text

    var textLabelA = document.createElement('label');
    var textLabelB = document.createElement('label');
    var textLabelC = document.createElement('label'); //place content in container

    contentTitle.innerHTML = photoTitle;
    textLabelA.innerHTML = "Description : ";
    contentDesc.innerHTML += " " + photoDesc;
    textLabelB.innerHTML = "Location : ";
    contentLoc.innerHTML += " " + photoLoc;
    textLabelC.innerHTML = "Owner : ";
    contentOwner.innerHTML += " " + photoOwner; //add text to content container

    photoContent.appendChild(contentTitle);
    photoContent.appendChild(textLabelA);
    photoContent.appendChild(contentDesc);
    photoContent.appendChild(textLabelB);
    photoContent.appendChild(contentLoc);
    photoContent.appendChild(textLabelC);
    photoContent.appendChild(contentOwner); //add containers to main div

    resultPane.appendChild(resultImg);
    resultPane.appendChild(photoContent); //add div to page

    resultsWindow.appendChild(resultPane); //call and add photos

    getPhotoSizes(sizeID);
  } //6b. Pull content from neat objects such as id title, lat, lon/ etc


  function pullPhotoData(infoResponse) {
    console.log("loading photo info...");
    console.log(infoResponse); //store object properties in values

    var photoTitle = infoResponse.data.photo.title._content;
    var photoDesc = infoResponse.data.photo.description._content;
    var photoOwner = infoResponse.data.photo.owner.username;
    var photoLoc = infoResponse.data.photo.owner.location;
    var photoLat = infoResponse.data.photo.location.latitude;
    var photoLng = infoResponse.data.photo.location.longitude;
    var sizeID = infoResponse.data.photo.id;
    var urlDeck = infoResponse.data.photo.urls.url;
    var urlID;

    for (var i = 0; i < urlDeck.length; i++) {
      urlID = urlDeck[i]._content;
    }

    ; //put results on page

    displayPhotoResults(urlID, photoTitle, photoDesc, photoLoc, photoOwner, sizeID); //pass location coordinates to google

    placeMarker(photoLat, photoLng, photoTitle, photoOwner, urlID);
  }

  ; //7b. Pull urls containing sizes and jpgs. Selects 150x150/ 

  function pullURLS(infoImage) {
    var photoSizes = infoImage.data.sizes; //console.log("photoSize of: " +)
    //console.log(photoSizes) //select size by label name

    var img_lgSq = photoSizes.size.find(function (_ref) {
      var label = _ref.label;
      return label === 'Medium';
    });
    var imgSrc = img_lgSq.source; //set src=" {in variable}"

    var urlSrc = img_lgSq.url; // set url in variable to match against 
    //^^ GET VARIABLES //

    imgThumbnails.push(imgSrc); //vv CREATE ELEMENTS //

    var imgWindow = document.createElement("img"); //create img element

    imgWindow.setAttribute("src", imgSrc); //set src as variable

    imgWindow.id = urlSrc; //add shared classname (sets url as id);

    imgWindow.className = "picture"; // console.log("src url:");
    // console.log(urlSrc);
    //vv FIND DOM ELEMENT //

    flickr_windows = document.querySelectorAll(".flickr_window"); //collect divs in array, loop thru each div, match the id

    for (var w = 0; w < flickr_windows.length; w++) {
      var windowDiv = flickr_windows[w].id;

      if (urlSrc.includes(windowDiv)) {
        // console.log("match found");
        //console.log(windowDiv, urlSrc);
        flickr_windows[w].appendChild(imgWindow);
      }
    }
  }

  ; //6a. call API again, now sending photoIDs to flickr

  function getPhotoInfo(photoID) {
    // CALL 1: GETS USER INFO ON PHOTOS IN NEATER OBJECTS
    console.log("fetching photo info...");
    axios.get(INFO_API_URL_BASE, {
      //call the link
      params: {
        photo_id: photoID // pass thru your varibales to Flickr's parameters

      }
    }).then(function (infoResponse) {
      //then call this function
      //console.log(infoResponse);
      pullPhotoData(infoResponse);
    }).catch(function (error) {
      //if get function failed, call this function 
      console.log("infoResponse isn't working...");
      console.log(error); //show error code in the console
    });
  } //7a.  all API again, now reqesuting imgs


  function getPhotoSizes(sizeID) {
    ///CALL 2: GETS PHOTO SRC IN VARIOUS SIZES AS JPGS
    console.log("fetching photo sizes...");
    axios.get(IMGurl_API_URL_BASE, {
      //call the link
      params: {
        photo_id: sizeID // pass thru your varibales to Flickr's parameters

      }
    }).then(function (infoImage) {
      //then call this function
      // console.log(infoImage);
      pullURLS(infoImage); //setTimeout(pullURLS(infoImage),2000); //(wait 2ms) pass the data to the next function;
      //so photos load just a hair after thier div containers 
    }).catch(function (error) {
      //if get function failed, call this function 
      console.log("infoImage isn't working...");
      console.log(error); //show error code in the console
    });
  } //5. process the photo ID data recieved from FLICKr


  function handleQueryResponse(response) {
    console.log("processing data..."); //target the array from the data you want to loop through

    var photoReturn = response.data.photos.photo; //loop through the array of data

    for (var i = 0; i < photoReturn.length; i++) {
      //store specific data in variables
      var photoID = photoReturn[i].id; //call next function, passing through new array

      getPhotoInfo(photoID);
    }
  }

  ; //4. call FLICKRs.photo.search and pass user values along as Flickrs params

  function getQueryData(photoQuery, tagsQuery) {
    console.log("fetching with GET:" + photoQuery, tagsQuery);
    axios.get(SRCH_API_URL_BASE, {
      //call the link
      params: {
        text: photoQuery,
        // pass thru your varibales to Flickr's parameters
        tags: tagsQuery
      }
    }).then(function (response) {
      //then call this function
      console.log("data retrieved for " + photoQuery + " with tags: " + tagsQuery);
      console.log(response); //show returned call data in the console

      handleQueryResponse(response); //pass the data to the next function;
    }).catch(function (error) {
      //if get function failed, call this function 
      console.log("photo search isn't working...");
      console.log(error); //show error code in the console
    }); //an addtional .then(function(var)) is always executed (optional)
  }

  ; //3.when button is clicked, run function 

  function makeSearchRequest(event) {
    //capture user value/calls getUserData()
    //presents the browser from doing default behavior like refreshing/loading/ etc
    event.preventDefault(); //turn user text into variable

    var photoQuery = picSearch_query.value;
    var tagsQuery = tagsSearch_query.value;
    console.log('value of photo query: ', photoQuery);
    console.log('value of photo query: ', tagsQuery); //pass variables to next function

    getQueryData(photoQuery, tagsQuery); //function still works if one value is not entered.

    resultsWindow.innerHTML = " "; // clears any results from page

    clearOverlays(); //clears any markers from the map
  }

  ; //2. When user clickes the button, run this function (capture user values )

  picSearch_button.addEventListener("click", makeSearchRequest); //when user clicks button,

  tagsSearch_button.addEventListener("click", makeSearchRequest); // run this function
  ////-----------FLICKR---------------- FLICKR------------------FLICKR-----////
  ////-----------GOOGLE MAPS---------------- GOOGLE MAPS------------------GOOGLE MAPS-----////
  // var map;
  // //var service;
  // var mapMarkers;
  // var infowindow = null;

  function initMap() {
    console.log("init map is here");
    mapMarkers = [];
    var circus = {
      lat: 33.813245,
      lng: -84.362171
    };
    map = new google.maps.Map(document.getElementById('map'), {
      center: circus,
      zoom: 11
    });
  }

  ; ////-----------GOOGLE MAPS---------------- GOOGLE MAPS------------------GOOGLE MAPS-----////

  window.initMap = initMap;
})();
//# sourceMappingURL=main.js.map
