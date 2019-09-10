
//get photo id data from FLICKRs search.photo api
  //set method to input flickr_params:/user_query and to only return images with geo data:true
// loop through data and store photo ids in an array [photoIDs]
// get geo data using photoIDs photo.getLocatoin api
// loop through data and set each as a marker with content window on google map's api 


/*pull data to get ids, title, lon/lat. assign ids per div.
use ids to get photo urls

for each object in returned data, loop through and pull the id, title, lat/lon, and url. 
send your id and get your photo. use url to match divs.

get put on the page
 */


console.log("hello, chello. GoogleFlickr1.0");
//0. define global function variables
const resultsWindow = document.querySelector(".resultsWindow");
const picSearch_button = document.querySelector("[name='picSearch_button']");
const picSearch_query = document.querySelector("[name='SearchInputField']");
const tagsSearch_button = document.querySelector("[name='tagsSearch_button']");
const tagsSearch_query = document.querySelector("[name='tagsSearchInputField']");

;(function(){
    //1. wrapped inside this function, define global function variables
    console.log ('flicker function booted...');
    //** the url containg info FLICKR needs to return requested data. User text is fed thru using template literals: ${var}. url stored in a var. */
    const SRCH_API_URL_BASE= 'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=47fa016833c10c7cf777062f48eb2908&tags=${tagsQuery}&text=${photoQuery}&max_upload_date=1567857600&has_geo=1&extras=geo&format=json&nojsoncallback=1';

    const INFO_API_URL_BASE= 'https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=47fa016833c10c7cf777062f48eb2908&photo_id=${photoID}&format=json&nojsoncallback=1';
    
    const IMGurl_API_URL_BASE = 'https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=47fa016833c10c7cf777062f48eb2908&photo_id=${photoID}&format=json&nojsoncallback=1';


    //7a. Pull content from neat objects such as title, lat, lon/ etc
    function createPhotoBox(infoResponse){ 
     console.log("loading photo info..." )
     //store object properties in values
     let photoDeck = infoResponse.data.photo.title._content;
      //create div to hold all content
      let resultPane = document.createElement('div');
      resultPane.className = "flickr_result";
      //create div to hold photo loaded 2ms later
      let resultImg = document.createElement('div');
      resultImg.className = "flickr_img";
      //create container for text
      let photoContent = document.createElement('p');
      photoContent.className = "flickr_content";
      //place content in container
      photoContent.innerText = photoDeck;
      //add containers to div
      resultPane.appendChild(resultImg);
      resultPane.appendChild(photoContent);
      //add div to page
      resultsWindow.appendChild(resultPane);
    };
    //7b. Pull urls containing sizes and jpgs. Selects 150x150/ 
    function pullURLS(infoImage){
      
      let photoSizes = infoImage.data.sizes;
      //console.log("photoSize of: " +)
      console.log(photoSizes) //select size by label name
      let img_lgSq = photoSizes.size.find( ({ label }) => label === 'Large Square' );
      let imgSrc = img_lgSq.source; //set src=" {in variable}"
    
      let imgWindow = document.createElement("img"); //create img element
      imgWindow.setAttribute("src", imgSrc) //set src as variable
      imgWindow.className = "flickr_img"; //add shared classname
      let img_box = document.querySelector(".flickr_result");
      document.body.append(imgWindow) //add img to page 
    };
    
    //6. call API again, now sending photoIDs to flickr
    function getPhotoInfo(photoID){ 

      // CALL 1: GETS USER INFO ON PHOTOS IN NEATER OBJECTS


      console.log("fetching photo info...");
      axios.get(INFO_API_URL_BASE,{ //call the link
        params:{
          photo_id: photoID // pass thru your varibales to Flickr's parameters
        }
      }).then(function(infoResponse){ //then call this function
        console.log(infoResponse);
        createPhotoBox(infoResponse); //pass the data to the next function;
      }).catch(function (error){ //if get function failed, call this function 
       console.log("infoResponse isn't working...");
       console.log(error); //show error code in the console
      });

      ///CALL 2: GETS PHOTO SRC IN VARIOUS SIZES AS JPGS
      
    //   console.log("fetching photo sizes...");
    //   axios.get(IMGurl_API_URL_BASE,{ //call the link
    //     params:{
    //       photo_id: photoID // pass thru your varibales to Flickr's parameters
    //     }
    //   }).then(function(infoImage){ //then call this function
    //    //console.log(infoImage);
    //    pullURLS(infoImage)
    //    //setTimeout(pullURLS(infoImage),2000); //(wait 2ms) pass the data to the next function;
    //    //so photos load just a hair after thier div containers 
    //   }).catch(function (error){ //if get function failed, call this function 
    //    console.log("infoImage isn't working...");
    //    console.log(error); //show error code in the console
    //   });
    // };

    //5. process the photo ID data recieved from FLICKr
    function handleQueryResponse(response){
      console.log("processing data...");
      //target the array from the data you want to loop through
     let photoReturn = response.data.photos.photo;
      //loop through the array of data
      for (var i=0; i < photoReturn.length; i++){
        //store specific data in variables
        let photoID = photoReturn[i].id;
        //call next function, passing through new array
        getPhotoInfo(photoID);
      }
    };


    //4. call FLICKRs.photo.search and pass user values along as Flickrs params
    function getQueryData(photoQuery, tagsQuery){
      console.log("fetching with GET:" + photoQuery ,tagsQuery);
      axios.get(SRCH_API_URL_BASE,{ //call the link
        params:{
          text: photoQuery, // pass thru your varibales to Flickr's parameters
          tags: tagsQuery
        }
      }).then(function(response){ //then call this function
        console.log("data retrieved for " + photoQuery + " with tags: " + tagsQuery );
        console.log(response); //show returned call data in the console
        handleQueryResponse(response); //pass the data to the next function;
      }).catch(function (error){ //if get function failed, call this function 
        console.log("photo search isn't working...");
        console.log(error); //show error code in the console
      }); //an addtional .then(function(var)) is always executed (optional)

    };

    //3.when button is clicked, run function 
    function makeSearchRequest(event){ //capture user value/calls getUserData()
      //presents the browser from doing default behavior like refreshing/loading/ etc
      event.preventDefault()
      //turn user text into variable
      const photoQuery = picSearch_query.value;
      const tagsQuery = tagsSearch_query.value;
      console.log('value of photo query: ', photoQuery);
      console.log('value of photo query: ', tagsQuery);
      //pass variables to next function
      getQueryData(photoQuery,tagsQuery);
      //function still works if one value is not entered.
    };

    //2. When user clickes the button, run this function (capture user values )
    picSearch_button.addEventListener("click", makeSearchRequest); //when user clicks button,
    tagsSearch_button.addEventListener("click", makeSearchRequest);// run this function

    ////-----------GOOGLE MAPS---------------- GOOGLE MAPS------------------GOOGLE MAPS-----////

    var map;
    //var service;
    var markers = [];
    var infowindow = null;


  function initMap() {

    console.log("init map is here")

    var circus = {lat:33.813245, lng: -84.362171};
    map = new google.maps.Map(document.getElementById('map'), {
      center: circus,
      zoom: 12
    });
   //makes places API a variable 
   
    var content ="something about this marker"
    infowindow= new google.maps.InfoWindow({
      content: content

    });
    
    //marker uses parameters and must include map: map to load the mapAPI 
    //var marker = new google.maps.Marker({position: circus, map: map});

    function showContentInWindow(newContent){
            //variable is placed in new content window
        infowindow.setContent(newContent)
            //content is set above the indicated marker
        infowindow.open(map, marker);
    }
    
    // marker.addListener("click", function (){
    //   //content is passed through the function 
    //   showContentInWindow("this is new content");
    //   console.log("clicky");
    // });
}
window.initMap = initMap;
})()