"use client"
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { GiChicken } from 'react-icons/gi';
import Link from "next/link";

export default function Popular() {
    // We use 'useState' to create a box of toys for our data, 'fetchRecommend' will store the anime.
    const [getPopular, setGetPopular] = useState([]);
    // 'currentPage' keeps track of the page we're currently looking at.
    const [currentPage, setCurrentPage] = useState(1);
    // When we're waiting to see the anime, we show a spinning icon. When we see the anime, we stop the spinning icon
    const [isLoading, setIsLoading] = useState(true);
    // 'totalPages' tells us how many pages there are in total.
    const [totalPages, setTotalPages] = useState(0);
    // 'displayedPages' is like the remote control for our page numbers.
    const [displayedPages, setDisplayedPages] = useState([]);
    // 'isLoading' is like a light that tells us if we're waiting for something.

    // We use 'useEffect' to do something when our page loads or when certain things change.
    useEffect(() => {
        // When our page loads, we want to fetch some anime!
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        // When our page loads and when the number of total pages change, we want to decide which page numbers to show.
        generateDisplayedPages();
    }, [totalPages, currentPage]);

    // This function helps us fetch data from the Internet.
    const fetchData = async () => {
        try {
            // We ask the Internet for a list of top anime for the current page.
            const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${currentPage}`);
            // We check if the Internet gave us the right data (status code 200).
            if (!response.ok) {
                throw new Error(`Error fetching anime data: ${response.status} - ${response.statusText}`);
            }
            // We open a present from the Internet, and inside it, we find anime data.
            const data = await response.json();
            // We say, "Okay, we're done waiting for the data," and we turn off the waiting light.
            setIsLoading(false);
            // We put the anime toys in our toy box (fetchRecommend).
            setGetPopular(data.data);
            // The Internet also told us how many pages there are, so we keep track of that too.
            setTotalPages(data.pagination.last_visible_page);
        } catch (error) {
            console.error('Something went wrong:', error);
            // If something goes wrong, we still turn off the waiting light.
            setIsLoading(false);
        }
    };

    // This function decides which page numbers to show on our TV remote.
    const generateDisplayedPages = () => {
        // We want to show only a few page numbers at a time, not all of them.
        const maxDisplayedPages = 5;
        // We cut that big number in half to decide where to start showing page numbers.
        const halfDisplayedPages = Math.floor(maxDisplayedPages / 2);
        // We calculate the starting page number.
        let startPage = Math.max(currentPage - halfDisplayedPages, 1);
        // We calculate the ending page number.
        let endPage = Math.min(startPage + maxDisplayedPages - 1, totalPages);

        // If there are too few pages to show, we adjust the starting page.
        if (endPage - startPage + 1 < maxDisplayedPages) {
            startPage = Math.max(endPage - maxDisplayedPages + 1, 1);
        }

        // We pick which page numbers to show and put them on our TV remote (displayedPages).
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        setDisplayedPages(pages);
    };

    // These functions are like buttons on our TV remote.
    const handleNextPage = async () => {
        // When we press the "Next" button, we go to the next page.
        setCurrentPage(prevPage => prevPage + 1);
        // We also scroll to the top of the page smoothly, like an elevator ride.
        await window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePreviousPage = async () => {
        // When we press the "Previous" button, we go to the previous page.
        setCurrentPage(prevPage => prevPage - 1);
        // We also scroll to the top of the page smoothly, like an elevator ride.
        await window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePageClick = async (page) => {
        // When we press a number on our TV remote, we go to that page.
        setCurrentPage(page);
        // We also scroll to the top of the page smoothly, like an elevator ride.
        await window.scrollTo({ top: 0, behavior: "smooth" });
    };


    return (
        <>
            <div className="flex justify-center">
                <div className="my-20 px-4 md:px-8">
                    <h1 className="mb-4 uppercase text-lg font-medium md:text-xl">Fans recommendations!</h1>
                    <div className="flex">
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 w-50">
                            {isLoading
                                ? Array.from({ length: 25 }).map((_, index) => (
                                    <div key={`loader-${index}`} className="w-44 relative">
                                        <div className="text-4xl animate-pulse my-20">
                                            <GiChicken />
                                        </div>
                                    </div>
                                ))
                                : getPopular.map((x) => (
                                    <div key={x.mal_id} className="w-44 relative">
                                        <Link href={`/anime/${x.mal_id}`}>
                                            <img
                                                src={x.images.jpg.image_url}
                                                alt={x.title}
                                                className="h-60 w-44 transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:opacity-75"
                                            />
                                            <h3 className="flex-wrap text-sm my-2">{x.title.length > 50 ? `${x.title.slice(0, 50)}...` : x.title}</h3>
                                            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 p-4 text-white opacity-0 hover:opacity-100 transition-opacity">
                                                <h1 className="font-bold mb-2">
                                                    {x.title.length > 20 ? `${x.title.slice(0, 20)}...` : x.title}
                                                </h1>
                                                <p className="text-white">
                                                    {x.synopsis.length > 120 ? `${x.synopsis.slice(0, 120)}...` : x.synopsis}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex uppercase justify-center my-20 text-[#ff9100] text-md md:text-lg">
                {currentPage > 1 && (
                    <button onClick={handlePreviousPage}>
                        <MdOutlineKeyboardDoubleArrowLeft />
                    </button>
                )}
                {displayedPages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`mx-1 px-2 ${currentPage === page ? "text-orange-400" : "text-white"
                            }`}
                    >
                        {page}
                    </button>
                ))}
                {currentPage < totalPages && (
                    <button onClick={handleNextPage}>
                        <MdOutlineKeyboardDoubleArrowRight />
                    </button>
                )}
            </div>
        </>
    );
}