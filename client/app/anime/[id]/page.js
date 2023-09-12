"use client";
import { FiBookmark } from "react-icons/fi";
import { ImArrowRight, ImArrowLeft } from "react-icons/im";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/app/context/authContext";

export default function AnimeID({ params }) {
  // State variables
  const [averageRating, setAverageRating] = useState(null); // Stores the average rating for the anime
  const [isLoading, setIsLoading] = useState(false); // Indicates if a loading state is active
  const [currentPage, setCurrentPage] = useState(1);
  const [animeData, setAnimeData] = useState(null); // Stores data about the anime
  const [episodes, setEpisodes] = useState([]); // Stores the list of episodes
  const [rating, setRating] = useState(0); // Stores the user's rating for the anime

  const episodesPerPage = 16; // Number of episodes to display per page
  const totalEpisodes = episodes.length;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
  const indexOfLastEpisode = currentPage * episodesPerPage;
  const indexOfFirstEpisode = indexOfLastEpisode - episodesPerPage;
  const currentEpisodes = Array.isArray(episodes)
    ? episodes.slice(indexOfFirstEpisode, indexOfLastEpisode)
    : [];

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  // AuthContext variables
  const {
    isAuthenticated,
    currentUser,
    currentUserRating,
    setCurrentUserRating,
    isBookmarked,
    setIsBookmarked,
  } = useContext(AuthContext);

  // Fetches necessary data and sets initial component state
  useEffect(() => {
    fetchData(); // Fetch anime data and episodes
    fetchAverageRating(); // Fetch average rating
    fetchCurrentUserRating(); // Fetch current user's rating
    fetchBookmarkStatus();
  }, []);

  // Fetch the current user's rating for the anime
  const fetchCurrentUserRating = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/anime/${params.id}/ratings/${currentUser.name}`
      );
      const data = await res.json();
      const { rating } = data;
      setCurrentUserRating(rating || 0);
    } catch (error) {
      setCurrentUserRating(0);
    }
  };

  // Fetch anime data and episodes
  const fetchData = async () => {
    try {
      const animeRes = await fetch(`https://api.jikan.moe/v4/anime/${params.id}`);
      const animeData = await animeRes.json();
      setAnimeData(animeData.data);

      // Fetch episodes
      const episodesRes = await fetch(`https://api.jikan.moe/v4/anime/${params.id}/episodes`);
      const episodesData = await episodesRes.json();
      setEpisodes(episodesData.data); // Set the fetched episodes data in the episodes state variable
    } catch (error) {
      console.error("Error occurred while fetching data:", error);
    }
  };

  // Fetch the average rating for the anime
  const fetchAverageRating = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/anime/${params.id}/rating/average`
      );
      const data = await res.json();
      const { averageRating } = data;
      setAverageRating(averageRating || 0); // Set a default value of 0 when averageRating is null or undefined
    } catch (error) {
      setAverageRating(0); // Set a default value of 0 when there is an error fetching the average rating
    }
  };

  // Handle rating submission
  const handleRate = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!isAuthenticated) {
        // User is not authenticated, display a window notification
        window.alert("Please log in to rate anime shows.");
        return;
      }

      const payload = {
        rating,
        username: currentUser.name,
      };

      // If the user already rated, update the rating using PATCH
      // Otherwise, create a new rating using POST
      if (currentUserRating) {
        await fetch(`http://localhost:8000/anime/${params.id}/update-rating`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`http://localhost:8000/anime/${params.id}/add-rating`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      await fetchAverageRating(); // Fetch average rating after successful rating submission
      setCurrentUserRating(rating); // Update the currentUserRating state with the new rating
    } catch (error) {
      console.error("Error occurred while submitting or updating rating:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarkStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/anime/${params.id}/bookmark/${currentUser.name}`
      );
      if (res.ok) {
        setIsBookmarked(true); // User has bookmarked the anime
      } else {
        setIsBookmarked(false); // User hasn't bookmarked the anime
      }
    } catch (error) {
      console.error("Error occurred while fetching bookmark status:", error);
    }
  };

    // Define the addBookmark and removeBookmark functions
    const addBookmark = async () => {
      try {
        const username = currentUser.name;
        const response = await fetch(`http://localhost:8000/anime/${params.id}/bookmark/${username}`, {
          method: "POST",
        });
  
        if (response.ok) {
          // Bookmark added successfully
          setIsBookmarked(true);
        } else {
          console.error("Error occurred while adding bookmark.");
        }
      } catch (error) {
        console.error("Error occurred while adding bookmark:", error);
      }
    };

  const removeBookmark = async () => {
    try {
      const username = currentUser.name;
      console.log("Removing bookmark for user:", username);

      // Send the DELETE request
      const response = await fetch(`http://localhost:8000/anime/${params.id}/bookmark/${username}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Bookmark removed successfully
        console.log("Bookmark removed successfully");
        setIsBookmarked(false); // Set the state to false after successfully removing a bookmark
      } else {
        // Handle the error here, if needed
        console.error("Error occurred while removing bookmark. Response:", response);
      }
    } catch (error) {
      console.error("Error occurred while removing bookmark:", error);
    }
  };

  if (!animeData) {
    return null;
  }

  // Utility function to format date and time
  const formatDateTime = (dateTime) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  return (
    <div className="container mx-auto px-6">
      {/* Anime Trailer */}
      <div className="flex mt-20 md:mt-20">
        <div className="w-full">
          {animeData.trailer && animeData.trailer.youtube_id ? (
            <div className="video-wrapper">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${animeData.trailer.youtube_id}`}
                frameBorder="0"
                allowFullScreen
                title="Trailer"
              ></iframe>
            </div>
          ) : (
            <p>No trailer available</p>
          )}
        </div>
      </div>

      {/* Anime Title | Average Rating | Bookmark */}
      <div className="my-10 md:ml-8">
        <h1 className="font-medium text-xl md:text-3xl">{animeData.title}</h1>
        <p className="font-medium my-2 text-sm md:text-lg">
          Average Rating:{" "}
          {typeof averageRating === "number"
            ? averageRating.toFixed(1)
            : "No Ratings"}
        </p>
        <div className="flex items-center">
          <button className="uppercase bg-orange-500 text-black font-semibold py-2 px-2 opacity-40 cursor-not-allowed text-xs md:text-base mr-2">
            Start watching e1
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                if (!isBookmarked) {
                  addBookmark(); // Call the addBookmark function
                } else {
                  removeBookmark(); // Call the removeBookmark function
                }
              }}
              disabled={isLoading}
              className={`flex text-orange-500 uppercase border-orange-500 border font-semibold py-2 px-2 text-xs md:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="mr-[2px] flex items-center">
                <FiBookmark className="text-sm md:text-xl" />
              </span>
              {isBookmarked ? "Remove Bookmark" : "Add to Bookmark"}
            </button>
          )}
        </div>
      </div>

      {/* Anime Synopsis */}
      <div className="flex my-10 md:ml-8 md:w-5/6">
        <div>
          <h3 className="font-medium text-xl md:text-3xl">Synopsis:</h3>
          <p className="text-sm md:text-base mt-4">{animeData.synopsis}</p>
        </div>
      </div>

      {/* Anime information */}
      <div className="md:ml-8 my-10">
        <h1 className="font-medium text-xl md:text-3xl">Information:</h1>
        <p className="text-sm md:text-base mb-2 mt-4">Type: {animeData.type}</p>
        <p className="text-sm md:text-base mb-2">Episodes: {animeData.episodes}</p>
        <p className="text-sm md:text-base mb-2">Status: {animeData.status}</p>
        {animeData.aired && (
          <p className="text-sm md:text-base mb-2">
            Aired from: {formatDateTime(animeData.aired.from)} to{" "}
            {formatDateTime(animeData.aired.to)}
          </p>
        )}
        <p className="text-sm md:text-based mb-2">Duration: {animeData.duration}</p>
        {animeData.genres && (
          <p className="text-sm md:text-base mb-2">
            Genres: {animeData.genres.map((genre) => genre.name).join(", ")}
          </p>
        )}
        <p className="text-sm md:text-base mb-2">Rating: {animeData.rating}</p>
        <p className="mb-4">
          Average Rating:{" "}
          {typeof averageRating === "number"
            ? averageRating.toFixed(1)
            : "N/A"}
        </p>
      </div>

      {/* Rating form */}
      <div className=" md:ml-8 my-10">
        <form onSubmit={handleRate}>
          <label
            htmlFor="rating"
            className="font-medium text-xl md:text-3xl"
          >
            Rate {animeData.title}
          </label>

          {!isAuthenticated && (
            <p className="text-red-500 font-semibold my-2">
              You must sign in to rate.
            </p>
          )}

          <div className="flex my-2">
            <select
              id="rating"
              value={rating}
              onChange={(event) => setRating(parseInt(event.target.value))}
              className={`mr-2 uppercase bg-orange-500 text-black py-2 px-2 text-xs md:text-xl ${isAuthenticated ? "" : "opacity-50"
                }`}
              disabled={!isAuthenticated || isLoading}
            >
              <option value={0}>Select Rating</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>

            <button
              type="submit"
              disabled={!isAuthenticated || isLoading}
              className={`mt-2 mb-10 uppercase bg-[#23252b] font-bold text-white py-2 px-4 rounded-md text-xs md:text-lg ${isAuthenticated ? "" : "opacity-50"
                }`}
            >
              Submit Rating
            </button>
          </div>
        </form>
      </div>

      {/* Episode Section + Next and Previous Button */}
      <div className="w-full md:ml-8">
        <h2 className="mb-4 font-medium text-lg md:text-3xl">Episodes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8">
          {currentEpisodes.map((episode, index) => (
            <div className="flex flex-col" key={index}>
              <div className="rounded-md shadow-md relative">
                <img
                  src={animeData?.images?.jpg?.image_url}
                  alt={animeData?.title}
                  className="object-cover rounded-md"
                />{" "}
                {/* Use movie image from Jikan v4 */}
                <button
                  disabled
                  className="absolute bottom-0 left-0 right-0 uppercase bg-[#23252b] font-bold text-white py-2 px-4 rounded-b-md opacity-70 cursor-not-allowed text-xs md:text-xl"
                >
                  Watch
                </button>
              </div>
              <div className="mt-2">
                <h3 className="text-md">{episode.title}</h3> {/* Anime title */}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex">
          {currentPage > 1 && (
            <button
              onClick={prevPage}
              className="flex uppercase items-center bg-[#23252b] font-semibold text-white py-2 px-4 rounded-md opacity-70 cursor-pointer text-xs md:text-lg mr-8"
            >
              <ImArrowLeft className="mr-2" /> Previous
            </button>
          )}
          {currentPage < totalPages && (
            <button
              onClick={nextPage}
              className="uppercase flex items-center bg-[#23252b] font-semibold text-white py-2 px-4 rounded-md opacity-70 cursor-pointer text-xs md:text-lg"
            >
              Next <ImArrowRight className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
