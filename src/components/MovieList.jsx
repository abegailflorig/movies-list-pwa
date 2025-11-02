import MovieCard from "./MovieCard";

function MovieList({ movies, loading, allMovies }) {
  if (loading) {
    return <p className="mt-10 text-gray-600">Loading movies...</p>;
  }

  if (!movies || movies.length === 0) {
    return <p className="mt-10 text-gray-600">No movies found.</p>;
  }

  // Get favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Sort movies: favorites first 
  const sortedMovies = [...movies].sort((a, b) => {
    const aFav = favorites.includes(a.imdbID);
    const bFav = favorites.includes(b.imdbID);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 w-full">
      {sortedMovies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} allMovies={allMovies} />
      ))}
    </div>
  );
}

export default MovieList;
