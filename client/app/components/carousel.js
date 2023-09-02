"use client"
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import React, { useEffect, useState, useRef } from 'react';
import { MdOutlinePersonalVideo } from 'react-icons/md';
import { ImClock2 } from 'react-icons/im';
import { FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export const Carousel = () => {
    // We have a list where we keep information about anime
    const [animeData, setAnimeData] = useState([]);
    // We use a special number called "currentIndex" to remember which anime we're looking at
    const [currentIndex, setCurrentIndex] = useState(0);
    // When we're waiting to see the anime, we show a spinning icon. When we see the anime, we stop the spinning icon
    const [isLoading, setIsLoading] = useState(true);
    // When we hover the slideshow it stops moving until we move our mouse away from it
    const [isHovered, setIsHovered] = useState(false);
    // We also have a timer to change the pictures and information every 5 seconds
    const slideshowIntervalRef = useRef(null);
    // We only show a little bit of information about the anime, not too much
    const maxSynopsisLength = 300;
    // We wait for a short time before changing the pictures and information
    const slideshowDelay = 5000;

    // This special part helps render our little magic trick
    useEffect(() => {
        // We have a timer here. It's like telling a robot to do something
        slideshowIntervalRef.current = setInterval(() => {
            // The timer makes the robot (or our program) do something repeatedly
            // It's like saying, "Hey robot, keep doing this over and over"
            // In this case, it changes what we see on the screen
            setCurrentIndex(prevIndex => (prevIndex === animeData.length - 1 ? 0 : prevIndex + 1));
        }, slideshowDelay);

        // We also clean up the timer when the component unmounts or when 'animeData' changes
        return () => {
            // This part says, "Okay robot, you can stop now"
            clearInterval(slideshowIntervalRef.current);
        };
    }, [animeData]); // Only 'animeData' is needed as a dependency

    // This special part helps render our little magic trick
    useEffect(() => {
        // Let's go fetch some cool anime!
        const fetchAnime = async () => {
            try {
                // We have a list of anime IDs to find
                const ids = [30276, 38000, 50265, 34572];
                // We'll ask the internet for info about each anime
                const animePromises = ids.map(async (id) => {
                    // Hey api, give me info about this anime!
                    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
                    // Check if the response is successful (status code 200)
                    if (!response.ok) {
                        throw new Error(`Error fetching anime: ${response.status} - ${response.statusText}`);
                    }
                    // The api gives us info in JSON format
                    const data = await response.json();
                    // We found the anime info!
                    return data.data;
                });
                // Let's wait for the api to find all the anime
                const animeData = await Promise.all(animePromises);
                // We have the info for all the anime. Let's remember and store it in a usestate!
                setAnimeData(animeData);
                // We're done searching for anime
                setIsLoading(false);
            } catch (error) {
                // Uh-oh, something went wrong while looking for anime
                console.error('Error fetching anime:', error);
                // But it's okay, we're done now with an error 
                setIsLoading(false);
            }
        };

        fetchAnime();
    }, []);

    // We're going to pick a pretty background for every anime
    const getBackgroundStyle = (id) => {
        // Depending on which canime we're talking about (its ID), we'll choose a different background!
        // I choose Switch since we're not asking anything complicated
        switch (id) {
            case 30276:
                return 'bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400';
            case 38000:
                return 'bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900';
            case 50265:
                return 'bg-gradient-to-r from-sky-700 via-cyan-600 to-cyan-700';
            case 34572:
                return 'bg-gradient-to-r from-amber-800 via-red-900 to-amber-800';
            default:
                // If we don't know which anime it is, we won't have any special background, just a boring black one 
                return '';
        }
    };


    // This is like a remote control for changing anime
    const handlePrev = () => {
        // When we press the "Previous" button, we go back to the anime before the current one
        setCurrentIndex(prevIndex => (prevIndex === 0 ? animeData.length - 1 : prevIndex - 1));
        // We also reset a timer so the anime changes after a while
        resetSlideshowInterval();
    };

    // This is like a remote control for going forward in anime
    const handleNext = () => {
        // When we press the "Next" button, we go to the next anime
        setCurrentIndex(prevIndex => (prevIndex === animeData.length - 1 ? 0 : prevIndex + 1));
        // We also reset a timer so the anime changes after a while
        resetSlideshowInterval();
    };

    // This is like a helper to reset the timer for changing anime
    const resetSlideshowInterval = () => {
        // We stop the timer for now
        clearInterval(slideshowIntervalRef.current);
        // Then, we start it again to keep changing the anime pictures and info
        slideshowIntervalRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex === animeData.length - 1 ? 0 : prevIndex + 1));
        }, slideshowDelay);
    };
    // When the mouse enters the special thing (carousel), we stop changing pictures
    const handleMouseEnter = () => {
        setIsHovered(true);
        // Stop changing pictures
        clearInterval(slideshowIntervalRef.current);
    };

    // When the mouse leaves the special thing (carousel), we show different pictures again
    const handleMouseLeave = () => {
        setIsHovered(false);
        // Start showing different pictures again
        resetSlideshowInterval();
    };

    // This helps us know which anime we're looking at right now
    const currentAnime = animeData[currentIndex];

    // Sometimes, there's too much to read about an anime. We cut it short
    const shortenedSynopsis =
        currentAnime && currentAnime.synopsis.length > maxSynopsisLength
            ? currentAnime.synopsis.slice(0, maxSynopsisLength) + '...'
            : currentAnime && currentAnime.synopsis;

    // When we click on the name of an anime, we switch to that anime
    const handleTitleClick = index => {
        setCurrentIndex(index);
        // We also reset the timer so we can stay on the new anime for a while
        resetSlideshowInterval();
    };

    return (
        <>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {isLoading ? (
                    <div className="flex items-center justify-center mt-40">
                        <FiLoader className="text-4xl animate-spin" />
                    </div>
                ) : (
                    <div className={`flex ${getBackgroundStyle(currentAnime?.mal_id)}`}>
                        <div className="flex justify-center mx-auto container mb-8 ">
                            <button onClick={handlePrev} className="mr-4">
                                <AiFillCaretLeft className="rounded bg-none hover:bg-[#23252b] duration-200 text-5xl p-2" />
                            </button>
                            {currentAnime && (
                                <div className="mt-10 mb-10 flex flex-col md:flex-row lg:w-9/12">
                                    <img className="h-80 w-60 m-0" src={currentAnime?.images?.jpg?.large_image_url} alt="Banner" />
                                    <div className="flex flex-col ml-4">
                                        <h2 className="text-lg md:text-2xl font-bold my-2">
                                            {currentAnime.title}
                                        </h2>

                                        <div className="flex text-base">
                                            <div className="flex items-center rounded bg-[#ffdd95] text-black px-2">
                                                <ImClock2 className="mr-2" />
                                                <p>{currentAnime.duration.replace(' per ep', '')}</p>
                                            </div>

                                            <div className="flex items-center rounded bg-[#b0e3af] text-black px-2 ml-2">
                                                <MdOutlinePersonalVideo className="mr-2" />
                                                <p>{currentAnime.type}</p>
                                            </div>
                                        </div>

                                        <p className="flex my-4 hidden text-md md:flex">{shortenedSynopsis}</p>
                                        <div className="flex text-sm my-4">
                                            <Link href={`/anime/${currentAnime.mal_id}`} className="flex items-center p-2 bg-[#23252b] rounded">
                                                Watch now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button onClick={handleNext} className="ml-4">
                                <AiFillCaretRight className="rounded bg-none hover:bg-[#23252b] duration-200 text-5xl p-2" />
                            </button>
                        </div>
                    </div>
                )}
                <div className="px-4 mt-10 justify-center mx-auto container grid grid-cols-2 md:grid-cols-4 gap-4">
                    {animeData.length > 0 &&
                        animeData.map((anime, index) => {
                            if (anime && anime.mal_id && anime.title) {
                                return (
                                    <button
                                        key={anime.mal_id}
                                        onClick={() => handleTitleClick(index)}
                                        className={`p-2 ${currentIndex === index
                                            ? 'bg-[#414141]'
                                            : 'bg-[#202124] text-sm'
                                            }`}
                                    >
                                        {anime.title}
                                    </button>
                                );
                            } else {
                                return null;
                            }
                        })}
                </div>
            </div>
        </>

    );
};    