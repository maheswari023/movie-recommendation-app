const API_KEY = "ec332d19e6fed067df0160ce34067cc4";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const NOW_PLAYING_URL = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=te-IN&region=IN`;
const POPULAR_TELUGU_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=te-IN&sort_by=popularity.desc&with_original_language=te`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;

const movieSet = new Set();

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies(NOW_PLAYING_URL);
  fetchMovies(POPULAR_TELUGU_URL);
});

async function fetchMovies(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const teluguMovies = data.results.filter(movie => movie.original_language === "te");

    if (teluguMovies.length > 0) {
      showMovies(teluguMovies);
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

function showMovies(movies) {
  movies.forEach(movie => {
    if (!movie.poster_path || movieSet.has(movie.id)) return;

    movieSet.add(movie.id);

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");

    movieEl.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}" class="movie-img" data-id="${movie.id}">
      <div class="movie-info">
        <h3 class="movie-title" data-id="${movie.id}">${movie.title}</h3>
        <span>${movie.vote_average.toFixed(1)}</span>
      </div>
    `;

    main.appendChild(movieEl);
  });
}

main.addEventListener("click", (event) => {
  if (event.target.classList.contains("movie-img") || event.target.classList.contains("movie-title")) {
    const movieId = event.target.getAttribute("data-id");
    window.location.href = `movie.html?id=${movieId}`;
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if (searchTerm) {
    try {
      const res = await fetch(SEARCH_URL + encodeURIComponent(searchTerm));
      const data = await res.json();
      const filteredMovies = data.results.filter(movie => movie.original_language === "te");

      main.innerHTML = "";
      movieSet.clear();

      if (filteredMovies.length > 0) {
        showMovies(filteredMovies);
      } else {
        main.innerHTML = `<h2>No results found for "${searchTerm}".</h2>`;
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }
});
