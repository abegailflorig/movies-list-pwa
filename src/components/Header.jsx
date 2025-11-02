import { useState } from "react";
import SearchBar from "./SearchBar";
import { Menu, X, Clapperboard} from "lucide-react";

export default function Header({
  searchTerm,
  setSearchTerm,
  onSearch,
  genres,
  years,
  genreFilter,
  setGenreFilter,
  yearFilter,
  setYearFilter,
  ratingFilter,
  setRatingFilter,
  loading,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-purple-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <Clapperboard size={22} className="text-purple-950" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Movies App</h1>
            </div>
          </div>

          {/*Menu*/}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/*Search and Filters */}
        <div
          className={`transition-all duration-300 overflow-hidden w-full md:w-auto ${
            menuOpen
              ? "max-h-[500px] opacity-100 mt-3"
              : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
          }`}
        >
          <div className="flex items-center gap-2 flex-wrap justify-end md:justify-end">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={onSearch}
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
          </div>
        </div>
      </div>
    </header>
  );
}
