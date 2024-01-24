//Change this to your URL:
var url = "http://localhost:5174/Moves";

//Selectors
let moviesContainer = document.querySelector("#movies-container");
let idInput = document.querySelector("#id-input");
let titleInput = document.querySelector("#title-input");
let genreInput = document.querySelector("#genre-input");
let dateInput = document.querySelector("#date-input");
let imgInput = document.querySelector("#img-input");
let addMovieBtn = document.querySelector("#add-movie-btn");

//Event listeners

addMovieBtn.addEventListener("click", addMovie);

//Functions

function addMovie() {
  let newMovie = {
    id: Number(idInput.value),
    title: titleInput.value,
    genre: genreInput.value,
    releaseyear: Number(dateInput.value),
    imagelink: imgInput.value,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMovie),
  }).then((res) => {
    if (res.ok) {
      getMovies();
    } else {
      console.warn("Something is wrong with the API!");
    }
  });
}

function getMovies() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayMovies(data));
}

function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    var html = `
    <div class="sm-col-12 md-col-6 lg-col-4">
        <h1 class="text-center">${movie.title}</h1>
        <h3>${movie.releaseyear}</h3>
        <img src="${movie.imagelink}">
        <p><span class="bold-text">Id: </span>${movie.id}</p>
        <p><span class="bold-text">Genre: </span>${movie.genre}</p>

    </div>
    `;
    moviesContainer.innerHTML += html;
  });
}

//Display at start:
getMovies();
