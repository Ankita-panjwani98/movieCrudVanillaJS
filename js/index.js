let idMovie;

window.addEventListener("load", () => {
  console.log("In Load");
  displayMovies();
  document
    .getElementById("movieAddForm")
    .addEventListener("submit", async function (e) {
      let movie = {};
      e.preventDefault();
      const movieName = document.getElementById("movieName").value;
      const movieRating = document.getElementById("movieRating").value;
      const movieType = document.getElementById("movieType").value;
      const movieReleaseYear =
        document.getElementById("movieReleaseYear").value;
      const movieDuration = document.getElementById("movieDuration").value;
      const movieDirector = document.getElementById("movieDirector").value;

      movie = {
        movieName,
        movieRating,
        movieType,
        movieReleaseYear,
        movieDuration,
        movieDirector,
      };

      let allMovies = await getMovies();
      let currentProduct = allMovies.filter(
        (itm) => itm.movieName === movieName
      );
      console.log("Current Product", currentProduct);

      if (isFormValid()) {
        console.log("Inside form if");
        if (idMovie) {
          updateMovie(movie, idMovie);
          idMovie = "";
        } else {
          //condition of already exists or not
          if (currentProduct.length > 0) {
            document.getElementById("error-msg").innerHTML =
              "Movie with this name already exists!";
          } else {
            document.getElementById("error-msg").innerHTML = "";
            addMovie(movie);
          }
        }

        // displayMovies();

        resetForm();
        console.log("Movie added successfully");
      }
    });
});

const displayMovies = async () => {
  console.log("IN display FUNCTION");
  let allMovies = await getMovies();
  let count = 1;

  console.log("All MOVIES IN DISPLAY MOVIES:", allMovies);
  let displayMovies = "";

  //map
  allMovies.map((item) => {
    displayMovies += renderMovies(item, count++);
  });
  document.getElementById("movies").innerHTML = displayMovies;
};

function renderMovies(item, count) {
  return (
    `<tr>
                           <td>${count}</td>    
                           <td>${item.movieName}</td>
                           <td>${item.movieRating}</td>
                           <td>${item.movieType}</td>
                           <td>${item.movieReleaseYear}</td>
                           <td>${item.movieDuration}</td>
                           <td>${item.movieDirector}</td>` +
    '<td><i class="fas fa-trash-alt" onclick="deleteMovie(\'' +
    item.id +
    "')\">" +
    `</i></td>` +
    '<td><i class="fas fa-edit" onclick="populateMovie(\'' +
    item.id +
    "')\">" +
    `</i></td>
                         </tr>
                     </table>`
  );
}

async function handleSearchMovies() {
  console.log("In search function..");
  let allMovies = await getMovies();

  let inputValue = document.getElementById("inputSearch").value;
  let lowerCaseInputValue = inputValue.toLowerCase();
//   console.log("searched value in LOWERCASE", lowerCaseInputValue);

  let filteredMovies;

  filteredMovies = allMovies.filter(function (item) {
    return item.movieName.toLowerCase().includes(lowerCaseInputValue);
  });
  filteredMovies = allMovies.filter(function (item) {
    return item.movieType.toLowerCase().includes(lowerCaseInputValue);
  });
//   console.log("Filtered Movies", filteredMovies);
  let displayMovies = "";
  let count = 1;
  filteredMovies.map((item) => {
    displayMovies += renderMovies(item, count++);
  });
  document.getElementById("movies").innerHTML = displayMovies;
}

async function addMovie(movie) {
  await axios
    .post("http://localhost:3000/movies", movie)
    .then((resp) => {
      data = resp.data;
      console.log(data);
      displayMovies();
    })
    .catch((error) => {
      console.log(error);
    });

  //    data = res.data;
  //   return data;
}

async function updateMovie(movie, id) {
  await axios
    .put(`http://localhost:3000/movies/${id}`, movie)
    .then((response) => {
      console.log("edit:", response.data);
      displayMovies();
    })
    .catch((error) => {
      console.log(error);
    });

  //   let data = res.data;
  //   console.log(data);
}

const populateMovie = async (id) => {
  console.log("Inside update, ID IS:", typeof id);
  const currentMovie = await getMovieById(id);
  console.log("movie to be UPDATED:", currentMovie);
  populateData(currentMovie);
  idMovie = id;
};

const getMovieById = (id) => {
  const movieById = axios
    .get(`http://localhost:3000/movies/${id}`)
    .then((resp) => {
      data = resp.data;
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
  return movieById;
};

const deleteMovie = (id) => {
  console.log("Inside delete function", id);

  // await deleteSingleMovie(id);
  // console.log("data deleted", data);
  axios
    .delete(`http://localhost:3000/movies/${id}`)
    .then((response) => {
      //   console.log("Delete:", response.data);
      displayMovies();
    })
    .catch((error) => {
      console.log(error);
    });
};

const getMovies = () => {
  const moviesList = axios
    .get("http://localhost:3000/movies")
    .then((resp) => {
      data = resp.data;
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
  return moviesList;
};

// Movie Rating Validation
function isValidMovieRating() {
  const movieRating = document.getElementById("movieRating");
  console.log(movieRating.value);
  if (movieRating.value > 10) {
    movieRating.setCustomValidity(
      "Movie Rating can be 10 or less than 10 and must be valid"
    );
    return false;
  } else {
    movieRating.setCustomValidity("");
  }
  return true;
}

// Movie Form Validate
function isFormValid() {
  if (!isValidMovieRating()) {
    return false;
  }

  return true;
}

function resetForm() {
  document.getElementById("movieAddForm").reset();
  //   document.getElementById("movieName").value = "";
  //   document.getElementById("movieRating").value = "";
  //   document.getElementById("movieType").value = "";
  //   document.getElementById("movieReleaseYear").value = "";
  //   document.getElementById("movieDuration").value = "";
  //   document.getElementById("movieDirector").value = "";
}

function populateData(item) {
  document.getElementById("movieName").value = item.movieName;
  document.getElementById("movieRating").value = item.movieRating;
  document.getElementById("movieType").value = item.movieType;
  document.getElementById("movieReleaseYear").value = item.movieReleaseYear;
  document.getElementById("movieDuration").value = item.movieDuration;
  document.getElementById("movieDirector").value = item.movieDirector;
}

// const deleteSingleMovie = async (movieId) => {
//     console.log("movie id in axios", movieId);
//     const res = await axios.delete(
//       `http://localhost:3000/movies/${movieId}` ,

//     );
//     return res.data;
//   };

// Unique Id generator

// Add Movie Function

// function uuidv4() {
//     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
//       (
//         c ^
//         (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
//       ).toString(16)
//     );
//   }

// const deleteSingleMovie = async (movieId) => {
//         console.log("movie id in axios", movieId);
//         const res = await axios.delete(
//           `http://localhost:3000/movies/${movieId}` ,

//         );
//         return res.data;
//       };

// const handleChange = (event) => {
//     event.preventDefault();
//     console.log("Inside Handle Change");
//     let key = event.target.id;
//     let value = event.target.value;
//     movie[key] = value;

//     console.log("In HANDLE CHANGE-->", movie);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("FORM SUBMIT:", movie);
//     // alert("Form was submitted");

//     if (isFormValid()) {
//       console.log("Inside form if");
//       const id = "Movie-" + uuidv4();

//       let newMovie = { id, ...movie };

//       addMovie(newMovie);

//       console.log("Movie added successfully");
//       alert("Movie added Successfully");

//     }
//   };
// async function getMovies() {
//     let res = await axios.get("http://localhost:3000/movies");

//     let data = res.data;
//     console.log("GET movies", data);
//   }
