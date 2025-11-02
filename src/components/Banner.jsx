import { useState, useEffect } from "react";

export default function BannerSlideshow({ movies }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  //Auto change every 4s. pause on hover
  useEffect(() => {
    if (movies.length <= 1 || paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [movies.length, paused]);

  const movie = movies[index];

  return (
    <div
      className="relative w-full h-[350px] md:h-[400px] rounded-xl shadow-lg overflow-hidden"
      style={{
        backgroundImage:
          movie.Poster && movie.Poster !== "N/A"
            ? `url(${movie.Poster})`
            : "linear-gradient(90deg, #6b21a8, #9f7aea)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl"></div>
      <div className="absolute inset-0 flex items-end p-6 rounded-xl">
        <div className="text-white">
          <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
            {movie.Title}
          </h2>
          <p className="text-sm md:text-base">
            {movie.Genre} • {movie.Year}
          </p>
        </div>
      </div>
      {/* Dots navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
