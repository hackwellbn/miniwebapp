document.addEventListener("DOMContentLoaded", () => {
    const filmsList = document.getElementById("films");
    const moviePoster = document.getElementById("movie-poster");
    const movieTitle = document.getElementById("movie-title");
    const movieDescription = document.getElementById("movie-description");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieShowtime = document.getElementById("movie-showtime");
    const movieTickets = document.getElementById("movie-tickets");
    const buyTicketButton = document.getElementById("buy-ticket");

    let baseUrl = "http://localhost:3000";
    let movies = [];
    let selectedMovie = null;

    fetch(`${baseUrl}/films`) 
        .then(response => response.json())
        .then(data => {
            moviesData = data;
            displayMovies(movies);
            selectMovie(movies[0]);
        });


        //so here we are fetching the data from the server and then we are displaying the movies

    function displayMovies(moviesData) {
        filmsList.innerHTML = "";
        moviesData.forEach(movie => {
            const li = document.createElement("li");
            li.textContent = movie.title;
            li.classList.add("film-item");
            li.addEventListener("click", () => selectMovie(movie));
            filmsList.appendChild(li);
        });
    }

    //pick the movie and display it

    function selectMovie(movie) {
        selectedMovie = movie;
        moviePoster.src = movie.poster;
        movieTitle.textContent = movie.title;
        movieDescription.textContent = movie.description;
        movieRuntime.textContent = movie.runtime;
        movieShowtime.textContent = movie.showtime;
        movieTickets.textContent = movie.capacity - movie.tickets_sold;
        buyTicketButton.disabled = movie.capacity - movie.tickets_sold === 0;
    }


    //listen for the click event on the buy ticket button and then we are sending the data to the server
    buyTicketButton.addEventListener("click", (e) => {
        e.preventDefault();

        if (!selectedMovie) return;
        
        let availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;
        if (availableTickets > 0) {
            selectedMovie.tickets_sold++;
            fetch(`${baseUrl}/films/${selectedMovie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: selectedMovie.tickets_sold })
            }).then(response => response.json())
              .then(updatedMovie => {
                  selectMovie(updatedMovie);
              });
        }
    });
});
