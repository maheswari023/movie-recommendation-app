const API_KEY = "ec332d19e6fed067df0160ce34067cc4";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

if (movieId) {
    fetchMovieDetails(movieId);
}

async function fetchMovieDetails(id) {
    try {
      
        let res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=te-IN`);
        let movie = await res.json();

        
        if (!movie.overview) {
            const fallbackRes = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`);
            const fallbackMovie = await fallbackRes.json();
            movie.overview = fallbackMovie.overview;
        }

      
        document.getElementById("movie-title").textContent = movie.title || "Title not available";
        document.getElementById("movie-synopsis").textContent = movie.overview || "Synopsis not available";
        document.getElementById("movie-poster").src = movie.poster_path ? (IMG_URL + movie.poster_path) : "placeholder.jpg";

       
        const creditsRes = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
        const credits = await creditsRes.json();

        const director = credits.crew.find(member => member.job === "Director");
        document.getElementById("movie-director").textContent = director ? director.name : "Director info not available";

        const topCast = credits.cast.slice(0, 3).map(actor => actor.name).join(", ");
        document.getElementById("movie-cast").textContent = topCast || "Cast info not available";

    } catch (error) {
        console.error("Failed to fetch movie details:", error);
        document.getElementById("movie-title").textContent = "Error loading movie details.";
        document.getElementById("movie-synopsis").textContent = "";
        document.getElementById("movie-director").textContent = "";
        document.getElementById("movie-cast").textContent = "";
    }
}
