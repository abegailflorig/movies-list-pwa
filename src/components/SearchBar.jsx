import { Search, Loader, Film, Calendar, Star } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  onSearch,
  genres = ["All"],
  years = ["All"],
  genreFilter,
  setGenreFilter,
  yearFilter,
  setYearFilter,
  ratingFilter,
  setRatingFilter,
  loading,
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-end w-full">
      {/* 🔍 Search input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="p-2 rounded-md text-black border w-48 md:w-56"
      />

      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition flex items-center gap-2"
      >
        {loading ? (
          <span className="animate-pulse"><Loader size={18}/></span>
        ) : (
          <>
            <Search size={18} />
          </>
        )}
      </button>

      {/* 🎭 Genre Filter */}
      <div className="relative flex items-center">
        <Film size={18} className="absolute left-2 text-white-500 pointer-events-none" />
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-2 pl-8 border rounded-md text-black appearance-none"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* 📅 Year Filter */}
      <div className="relative flex items-center">
        <Calendar size={18} className="absolute left-2 text-red-500 pointer-events-none" />
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="p-2 pl-8 border rounded-md text-black appearance-none"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* ⭐ Rating Filter */}
      <div className="relative flex items-center">
        <Star size={18} className="absolute left-2 text-yellow-300 pointer-events-none" />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="p-2 pl-8 border rounded-md text-black appearance-none"
        >
          <option value="All">All ratings</option>
          <option value="9+">9+</option>
          <option value="8+">8+</option>
          <option value="7+">7+</option>
          <option value="6+">6+</option>
          <option value="below-6">Below 6</option>
        </select>
      </div>
    </div>
  );
}
  