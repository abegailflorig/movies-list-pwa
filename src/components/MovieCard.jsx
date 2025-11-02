import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import MovieDetails from "./MovieDetails";

export default function MovieCard({ movie, allMovies = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  //load favorite state
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.includes(movie.imdbID));
  }, [movie.imdbID]);

  //add or remove from favorites
  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updated =
      isFavorite
        ? favorites.filter((id) => id !== movie.imdbID)
        : [...favorites, movie.imdbID];
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="relative bg-white shadow rounded-xl p-3 text-center hover:scale-105 transition cursor-pointer"
      >
        {/*Favorite Button */}
        <div
          onClick={toggleFavorite}
          className="absolute top-2 right-2"
        >
          <Heart
            size={22}
            stroke={isFavorite ? "red" : "gray"}
            fill={isFavorite ? "red" : "none"}
          />
        </div>

        <img
          src={
            movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/200x300?text=No+Image"
          }
          alt={movie.Title}
          className="w-full h-56 object-cover rounded-lg"
        />

        {/* Title and Year */}
        <h2 className="font-bold mt-2 text-md truncate">{movie.Title}</h2>
        <p className="text-sm text-gray-600">{movie.Year}</p>
      </div>

      {/* Movie Details Modal */}
      {showModal && (
        <MovieDetails
          movie={movie}
          allMovies={allMovies}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
