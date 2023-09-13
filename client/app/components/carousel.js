"use client"
import { AiFillCaretRight, AiFillCaretLeft } from 'react-icons/ai';
import React, { useEffect, useState, useRef } from 'react';
import { MdOutlinePersonalVideo } from 'react-icons/md';
import { ImClock2 } from 'react-icons/im';
import { FiLoader } from 'react-icons/fi';
import Image from 'next/image';
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
                const ids = [30276, 16498, 21, 1735];
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

                    <div className="flex justify-center mx-auto container mb-8 h-[30rem] ">
                        <button onClick={handlePrev} className="mr-4">
                            <AiFillCaretLeft className="rounded bg-none hover:bg-[#23252b] duration-200 text-5xl p-2" />
                        </button>
                        {currentAnime && (
                            <div className="mt-10 mb-10 flex flex-col md:flex-row lg:w-10/12">
                                <img className="h-86 w-72 m-0" src={currentAnime?.images?.jpg?.large_image_url} alt="Banner" />
                                <div className="flex flex-col ml-4">
                                        <div className="flex mt-2 justify-center items-center md:justify-start md:items-start">
                                            <Image
                                                src={`/title${currentAnime.mal_id}.png`}
                                                alt={currentAnime.title}
                                                width={180}
                                                height={180}
                                            />
                                    </div>

                                    <p className="flex bottom my-4 hidden text-md md:flex">{shortenedSynopsis}</p>
                                    <div className="flex text-sm my-4 justify-center items-center md:justify-start md:items-start">
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
                )}

                <div className="flex mt-60 md:mt-20 justify-center gap-4">
                    {animeData.length > 0 &&
                        animeData.map((anime, index) => {
                            if (anime && anime.mal_id && anime.title) {
                                return (
                                    <button
                                        key={anime.mal_id}
                                        onClick={() => handleTitleClick(index)}
                                        className={`p-2 ${currentIndex === index
                                            ? 'rounded-xl bg-orange-500 h-2 w-2'
                                            : 'rounded-xl bg-neutral-900 h-2 w-2'
                                            }`}
                                    >
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