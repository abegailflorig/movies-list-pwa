import { useState, useEffect, useMemo } from "react";
import Header from "./components/Header";
import MovieList from "./components/MovieList";
import Footer from "./components/Footer";
import BannerSlideshow from "./components/Banner";

const API_URL = "https://www.omdbapi.com/?apikey=aef4937c";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Filters
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  //Fetch movies by search
  const fetchMovies = async (term = searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}&s=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!data.Search) return setMovies([]);

      // Fetch full details
      const details = await Promise.all(
        data.Search.slice(0, 20).map(async (m) => {
          const r = await fetch(`${API_URL}&i=${m.imdbID}`);
          const d = await r.json();
          if (!d.Poster || d.Poster === "N/A") d.Poster = m.Poster;
          return d;
        })
      );

      setMovies(details.filter((d) => d && d.imdbID));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Load default movies
  useEffect(() => {
    const defaultSearches = ["Action", "Comedy", "Romance", "Horror"];
    const fetchAll = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          defaultSearches.map(async (term) => {
            const res = await fetch(`${API_URL}&s=${encodeURIComponent(term)}`);
            const data = await res.json();
            return data.Search || [];
          })
        );

        const combined = results.flat();
        const unique = Array.from(
          new Map(combined.map((m) => [m.imdbID, m])).values()
        );

        const details = await Promise.all(
          unique.slice(0, 40).map(async (m) => {
            const r = await fetch(`${API_URL}&i=${m.imdbID}`);
            const d = await r.json();
            if (!d.Poster || d.Poster === "N/A") d.Poster = m.Poster;
            return d;
          })
        );

        //Keep only valid movies with Genre
        const valid = details.filter(
          (m) => m && m.imdbID && m.Genre && m.Genre !== "N/A"
        );
        setMovies(valid);
      } catch (err) {
        console.error("fetchAll error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  //Genre dropdown
  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      if (m.Genre) m.Genre.split(",").forEach((g) => set.add(g.trim()));
    });
    return ["All", ...Array.from(set).sort()];
  }, [movies]);

  // Year dropdown
  const years = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => m.Year && set.add(m.Year));
    return ["All", ...Array.from(set).sort((a, b) => b - a)];
  }, [movies]);

  //Apply filters
  const filtered = movies.filter((m) => {
    if (genreFilter !== "All" && !m.Genre?.includes(genreFilter)) return false;
    if (yearFilter !== "All" && m.Year !== yearFilter) return false;
    if (ratingFilter !== "All") {
      const r = parseFloat(m.imdbRating) || 0;
      if (ratingFilter.endsWith("+")) {
        const min = parseFloat(ratingFilter.replace("+", ""));
        if (r < min) return false;
      } else if (ratingFilter === "below-5" && r >= 5) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={() => fetchMovies(searchTerm)}
        genres={genres}
        years={years}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        loading={loading}
      />

      <main className="w-full max-w-6xl px-4">
        <section className="mt-6 rounded-xl overflow-hidden relative w-full">
          {movies.length > 0 ? (
            <BannerSlideshow movies={movies} />
          ) : (
            <div className="w-full h-44 md:h-64 bg-gradient-to-r from-purple-700 to-purple-500 rounded-xl flex items-center justify-center text-white">
              <h2 className="text-2xl font-bold">Movie Banner</h2>
            </div>
          )}
        </section>

        <section className="mt-6">
          <MovieList movies={filtered} loading={loading} allMovies={movies} />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
