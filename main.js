// Change this to your API endpoint URL
var url = "http://localhost:5174/Movies";

// SELECTORS
let moviesContainer = document.querySelector("#movies-container");
let idInput = document.querySelector("#id-input");
let titleInput = document.querySelector("#title-input");
let genreInput = document.querySelector("#genre-input");
let dateInput = document.querySelector("#date-input");
let imgInput = document.querySelector("#img-input");
let addMovieBtn = document.querySelector("#add-movie-btn");
let errorText = document.getElementById("error-message");

// EVENT LISTENERS
addMovieBtn.addEventListener("click", addMovie);

// --------- FUNCTIONS ---------

//--------- ADD MOVIES ---------
// Function to add a new movie
function addMovie() {
  // Validate input fields
  if (!validateInputs()) {
    return;
  }

  // Create a new movie object
  let newMovie = {
    id: Number(idInput.value),
    title: titleInput.value,
    genre: genreInput.value,
    releaseYear: Number(dateInput.value),
    imageLink: imgInput.value,
  };

  // Send a POST request to add the new movie
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMovie),
  }).then((res) => {
    if (res.ok) {
      // If successful, refresh the displayed movies
      getMovies();
    } else {
      console.warn("Something is wrong with the API!");
    }
  });
}

//--------- GET MOVIES ---------
// Function to retrieve and display movies
function getMovies() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayMovies(data))
    .then(() => {
      // Add event listeners to update and delete buttons
      addBtnListeners();
    });
}

//--------- DISPLAY MOVIES ---------
// Function to display movies in the HTML
function displayMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach((movie) => {
    // Create HTML for each movie
    var html = `
      <div class="col-md-6 col-lg-4 movie-div">
          <h1 class="text-center">${movie.title}</h1>
          <h3 class="text-center">${movie.releaseYear}</h3>
          <img class="img" src="${movie.imageLink}">
          <p><span class="bold-text">Id: </span>${movie.id}</p>
          <p><span class="bold-text">Genre: </span>${movie.genre}</p>
          <div class="text-center">
              <button type="button" class="btn btn-primary update-btn" data-movie-id="${movie.id}">Update</button>
              <button type="button" class="btn btn-danger delete-btn" data-movie-id="${movie.id}">Delete</button>
          </div>
      </div>`;
    moviesContainer.innerHTML += html;
  });
}

// --------- ADD BTN LISTENERS ---------
// Function to add event listeners to update and delete buttons
function addBtnListeners() {
  let updateButtons = document.querySelectorAll(".update-btn");
  let deleteButtons = document.querySelectorAll(".delete-btn");

  updateButtons.forEach((button) => {
    button.addEventListener("click", handleUpdate);
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
}

// --------- HANDLE UPDATE ---------
// Function to handle the update button click
function handleUpdate(event) {
  const movieId = event.currentTarget.dataset.movieId;

  // Confirm update with the user
  if (
    !window.confirm(
      `Are you sure you want to update the movie with id ${movieId}?`
    )
  ) {
    return;
  }
  if (!validateInputs()) {
    return;
  }

  // Create updated movie object
  let updatedMovieData = {
    id: movieId,
    title: titleInput.value,
    genre: genreInput.value,
    releaseYear: Number(dateInput.value),
    imageLink: imgInput.value,
  };

  // Construct the update URL
  const updateUrl = url;

  // Send a PUT request to update the movie
  fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedMovieData),
  })
    .then((res) => {
      if (res.ok) {
        // If successful, refresh the displayed movies
        getMovies();
      } else {
        console.warn("Something is wrong with the API!");
      }
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });
}

// // --------- HANDLE DELETE ---------
// Function to handle the delete button click
function handleDelete(event) {
  const movieId = event.currentTarget.dataset.movieId;

  // Confirm delete with the user
  if (
    !window.confirm(
      `Are you sure you want to delete the movie with id ${movieId}?`
    )
  ) {
    return;
  }

  // Construct the delete URL
  const deleteUrl = url + "/" + movieId;

  // Send a DELETE request to delete the movie
  fetch(deleteUrl, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        // If successful, refresh the displayed movies
        getMovies();
      } else {
        console.warn("Something is wrong with the API!");
      }
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
    });
}

// --------- VALIDATE INPUTS ---------
// Function to validate input fields
function validateInputs() {
  // Check if all required fields are filled in
  if (
    titleInput.value == "" ||
    genreInput.value == "" ||
    dateInput.value == 0
  ) {
    // Display an error message on the webpage
    showError("Wrong inputs, check them and try again...");

    return false;
  }

  // If image input is empty, set it to an empty string
  if (!imgInput.value) {
    imgInput.value = "";
  }

  // Clear any previous error messages
  clearError();
  return true;
}

// --------- SHOW ERROR MESSAGE ---------
// Function to display error message on the webpage
function showError(message) {
  errorText.textContent = message;
  errorText.style.display = "block";
}

// --------- CLEAR ERROR MESSAGE ---------
// Function to clear error messages on the webpage
function clearError() {
  errorText.textContent = "";
  errorText.style.display = "none";
}

// Display movies at the start
getMovies();
