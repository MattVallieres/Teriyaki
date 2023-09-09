"use client"
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import { AuthContext } from "../context/authContext";

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [animeData, setAnimeData] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { currentUser, isAuthenticated } = useContext(AuthContext);
    const Username = currentUser ? currentUser.name : null;

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                if (!isAuthenticated) {
                    // User is not authenticated, stop loading and return
                    setIsLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:8000/anime/${Username}/bookmarks`);

                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await response.json();

                setBookmarks(data.bookmarks);

                // Fetch anime details for each bookmarked anime
                const animeDetails = await Promise.all(
                    data.bookmarks.map(async (bookmark) => {
                        const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${bookmark.AnimeId}`);
                        if (!animeResponse.ok) {
                            throw new Error(`Failed to fetch anime details for ID ${bookmark.AnimeId}`);
                        }
                        const animeData = await animeResponse.json(); // Store the fetched anime data
                        return animeData;
                    })
                );

                setAnimeData(animeDetails);
                setIsLoading(false); // Data loading is complete

            } catch (error) {
                console.error("Error while fetching bookmarks:", error);
            }
        };

        fetchBookmarks();
    }, [isAuthenticated, Username]);

    const removeBookmark = async (animeId) => {
        event.preventDefault(); // Prevent navigation
        try {
            // Make a DELETE request to remove the bookmark
            const response = await fetch(`http://localhost:8000/anime/${Username}/bookmark/${animeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove bookmark');
            }

            // Update the state to remove the anime from the view
            setAnimeData((prevData) => prevData.filter((x) => x.data.mal_id !== animeId));
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    return (
        <>
            {isAuthenticated ? (
                <>
                    {/* Title of the page */}
                    <div className="text-center">
                        <h1 className="my-16 font-medium uppercase text-3xl">Activity Feed</h1>
                    </div>
                    {/* Bookmarked and History tab section */}
                    <div className="justify-center flex font-semibold text-base my-10">
                        <h1
                            className={`mr-20 cursor-pointer uppercase ${showHistory ? "text-neutral-300 hover:text-slate-50 duration-200" : "text-orange-500"
                            }`}
                            onClick={() => setShowHistory(false)}
                        >
                            Bookmarked
                        </h1>
                        <h1
                            className={`cursor-pointer uppercase ${showHistory ? "text-orange-500" : "text-neutral-300"
                            }`}
                            onClick={() => setShowHistory(true)}
                        >
                            History
                        </h1>
                    </div>
                    {showHistory ? (
                        <div className="text-center">
                            <p>Implementation coming soon!</p>
                        </div>
                    ) : (
                        
                        <div className="flex justify-center mb-20">
                            {/* Loading Section */}
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <div>
                                    {/* If the user hasnt bookmarked an anime yet */}
                                    {animeData.length === 0 ? (
                                        <div className="text-center">
                                            <p>Appears you haven't bookmarked an anime yet, come back when you bookmarked one!</p>
                                        </div>
                                    ) : (
                                        
                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 w-50">
                                            {/* Mapping the anime to show what the user bookmarked */}
                                            {animeData.map((x, index) => (
                                                <div className="w-44 relative" key={`${x.data.mal_id}_${index}`}>
                                                    <Link href={`/anime/${x.data.mal_id}`}>
                                                        <img
                                                            src={x.data.images.jpg.image_url}
                                                            alt={x.data.title}
                                                            className="h-60 w-44 transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:opacity-75"
                                                        />
                                                    </Link>
                                                    <h3 className="flex-wrap text-sm my-2">
                                                        {x.data.title.length > 50 ? `${x.data.title.slice(0, 50)}...` : x.data.title}
                                                    </h3>
                                                    <button
                                                        className="bottom-2 cursor-pointer"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            removeBookmark(x.data.mal_id);
                                                        }}
                                                    >
                                                        <FaTrash className="hover:text-red-500 duration-200" size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center my-16">
                    <p>You need to log in to access the activity feed.</p>
                </div>
            )}
        </>
    );
}