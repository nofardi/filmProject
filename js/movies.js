//nir.geiger@zoominsoftware.com

var fav_movies_list = [];
var movies_list = [];

function getMovies() {
  const Url = "https://swapi.co/api/films/";

  var cookieJson = checkCookie();
  if(!cookieJson) {
    const Http = new XMLHttpRequest();
    Http.open("Get", Url);
    Http.send();
    var done = false;

    Http.onreadystatechange = (e) => {
        if(!done) {
          //setCookie(JSON.parse(Http.responseText))
          distMovies(JSON.parse(Http.responseText));
          done = true;
      }
    }
  } else {
    distMovies(cookieJson);
  }
}

function checkCookie() {
  return getCookie("movies");
}

function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function distMovies(jsonMovies) {
  var moviesArr;
  var cookieVal = getCookie("movies");
  if(cookieVal) {
    var moviesArr = JSON.parse(cookieVal);
  }
  else
    var moviesArr = jsonMovies["results"];

  var favArr = getCookie("fav");
  try {
    if(moviesArr)
      moviesArr.forEach(createRegList);
    if(favArr)
      favArr = JSON.parse(favArr);
      favArr.forEach(createFavList);
  } catch (e) {
    console.log(`Error while iterating through movies ${e}`)
  }

}

function createFavList(movie, index) {
  var ulElem = document.getElementById("fav_movies");
  if(typeof(movie) == "string")
    createList(JSON.parse(movie), ulElem, true);
  else
    createList(movie, ulElem, true);
}

function createList(movie, ulElem, isChecked) {
  var container = document.createElement("div");
  var liElem = document.createElement("input");
  liElem.type = "checkbox";
  liElem.className = movie["title"];
  liElem.onclick = chooseFav;
  liElem.checked = isChecked;
  var label = document.createElement('label');

  var textElem = document.createTextNode(movie["title"]);
  label.appendChild(textElem);
  container.appendChild(liElem);
  container.appendChild(label);
  container.className = movie["title"] + " container";
  movies_list.push("{\"title\": \"" +movie["title"] + "\"}");
  ulElem.appendChild(container);
}

function createRegList(movie, index) {
  var ulElem = document.getElementById("movies_list");
  if(typeof(movie) == "string")
    createList(JSON.parse(movie), ulElem, false);
  else
    createList(movie, ulElem, false);
}

function chooseFav() {
  var movieContainer = document.getElementsByClassName(this.className + " container")[0];
  var favMovies = document.getElementById("fav_movies");
  var movies =document.getElementById("movies_list");
  var cookieText = "{\"title\": \"" +this.className + "\"}";

  if(this.checked == true) {
    favMovies.appendChild(movieContainer);
    fav_movies_list.push(cookieText);
    movies_list.splice(movies_list.indexOf(cookieText), 1);
  }
  else {
    movies.appendChild(movieContainer);
    movies_list.push(cookieText);
    fav_movies_list.splice(fav_movies_list.indexOf(cookieText), 1);

  }
  updateCookie();
}

function setCookie() {
  var d = new Date();
  d.setTime(d.getTime() + (356 * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  var movies = JSON.stringify(movies_list);
  var fav_movies = JSON.stringify(fav_movies_list);

  document.cookie = "movies=" + movies + ";" + expires + ";path=/";
  document.cookie = "fav=" + fav_movies + ";" + expires +";path=/";
}

function updateCookie() {
  setCookie();
}
