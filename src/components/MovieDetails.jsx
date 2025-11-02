import { useState, useEffect } from "react";

const FEEDBACK_KEY = "movie_feedback_v1";

// load all feedback data from localStorage 
function loadFeedback() {
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "{}");
  } catch {
    return {};
  }
}

// save all feedback data to localStorage
function saveFeedback(obj) {
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(obj));
}

export default function MovieDetails({ movie, allMovies, onClose }) {
  const [details, setDetails] = useState(movie); 
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [feedbackData, setFeedbackData] = useState(() => loadFeedback()[movie.imdbID] || []); 

  // If movie plot are missing, it fetches complete details.
  useEffect(() => {
    if (!details.Plot) {
      fetchDetails();
    }
  }, []);

  // fetch detailed info for the selected movie
  async function fetchDetails() {
    setLoadingDetails(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=aef4937c&i=${movie.imdbID}`);
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setLoadingDetails(false);
    }
  }

  // Open trailer
  function openTrailer() {
  if (details?.imdbID) {
    // go directly to IMDb title page where trailer auto-plays
    window.open(`https://www.imdb.com/title/${details.imdbID}/?ref_=tt_ov_vi`, "_blank");
  } else {
    // Fallback: search IMDb if ID not available
    const query = encodeURIComponent(`${details?.Title || movie.Title} trailer`);
    window.open(`https://www.imdb.com/find/?q=${query}`, "_blank");
  }
}


  //Save rating and comment to localStorage
  function submitFeedback(rating, comment) {
    const store = loadFeedback(); 
    store[movie.imdbID] = store[movie.imdbID] || [];
    store[movie.imdbID].unshift({
      rating,
      comment,
      date: new Date().toISOString(),
    }); 
    saveFeedback(store); 
    setFeedbackData(store[movie.imdbID]); 
  }

  // Find related movies by matching first genre
  const related = (() => {
    const genre = (details?.Genre || movie.Genre || "").split(",")[0].trim();
    return (allMovies || [])
      .filter((m) => m.imdbID !== movie.imdbID && m.Genre && m.Genre.includes(genre))
      .slice(0, 4);
  })();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50 overflow-auto py-8">
      <div className="bg-white rounded-2xl w-11/12 max-w-4xl mx-auto shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>
        {loadingDetails ? (
          <p className="text-center text-gray-500 mt-10">Loading details...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <img
                src={
                  details.Poster !== "N/A"
                    ? details.Poster
                    : "https://via.placeholder.com/300x450"
                }
                alt={details.Title}
                className="w-full h-auto rounded-lg mb-4"
              />
              <button
                onClick={openTrailer}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-lg"
              >
                ▶ Watch Trailer
              </button>
            </div>

            {/*Movie information and feedback */}
            <div className="col-span-2">
              <h2 className="text-2xl font-bold mb-1">{details.Title}</h2>
              <div className="text-sm text-gray-500 mb-3">
                {details.Year} • {details.Country} • {details.Genre} • {details.Runtime}
              </div>

              <p className="text-gray-700 mb-3">
                <strong>Plot:</strong> {details.Plot}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Director:</strong> {details.Director}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Cast:</strong> {details.Actors}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Quality:</strong> {details.Type || "Movie"}
              </p>
              <p className="text-gray-700 mb-3">
                <strong>IMDB Rating:</strong> {details.imdbRating}
              </p>

              {/*Feedback form */}
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold mb-2">Rate & leave feedback</h3>
                <FeedbackForm onSubmit={submitFeedback} />

                {/*Display past feedback */}
                <div className="mt-4">
                  <h4 className="font-medium">Recent feedback</h4>
                  <div className="mt-2 max-h-40 overflow-auto">
                    {feedbackData.length > 0 ? (
                      feedbackData.map((f, i) => (
                        <div key={i} className="border-b py-2">
                          <div className="text-sm text-yellow-500">★ {f.rating}</div>
                          <div className="text-sm">{f.comment}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(f.date).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No feedback yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/*Related movies */}
              {related.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold mb-2">Related movies</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {related.map((r) => (
                      <div key={r.imdbID} className="text-center text-sm">
                        <img
                          src={
                            r.Poster !== "N/A"
                              ? r.Poster
                              : "https://via.placeholder.com/100x150"
                          }
                          alt={r.Title}
                          className="w-full h-28 object-cover rounded"
                        />
                        <div className="mt-1">{r.Title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Feedback form component
function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  //Handle submit
  const send = (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("Please write a short comment");
    onSubmit(rating, comment.trim());
    setRating(5);
    setComment("");
  };

  return (
    <form onSubmit={send} className="flex flex-col gap-2">
      {/*Rating*/}
      <div className="flex items-center gap-2">
        <label className="text-sm">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-1 border rounded"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Very good</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
      </div>

      {/*Comment*/}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your feedback..."
        className="p-2 border rounded-md w-full"
        rows={3}
      />

      {/*Submit and Clear buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded"
        >
          Send
        </button>
        <button
          type="button"
          onClick={() => {
            setComment("");
            setRating(5);
          }}
          className="py-2 px-4 border rounded"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
