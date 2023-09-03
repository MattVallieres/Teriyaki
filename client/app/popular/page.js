"use client"
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { FiLoader } from 'react-icons/fi';
import Link from "next/link";

export default function Popular() {
    // We use 'useState' to create a box of toys for our data, 'fetchRecommend' will store the anime.
    const [fetchRecommend, setFetchRecommend] = useState([]);
    // 'currentPage' keeps track of the page we're currently looking at.
    const [currentPage, setCurrentPage] = useState(1);
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
            setFetchRecommend(data.data);
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
            <div className="mx-auto container my-20 px-4">
                <h1 className="flex uppercase my-4 text-xl">Most popular</h1>

                {isLoading ? (
                    // If isLoading is true, show the loading spinner
                    <div className="flex items-center justify-center mt-40">
                        <FiLoader className="text-4xl animate-spin" />
                    </div>
                ) : (
                    // If isLoading is false, show the fetched data
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-8">
                            {fetchRecommend.length > 0 &&
                                fetchRecommend.map((x) => (
                                    <div key={x.mal_id} className="w-46">
                                        <Link href={`/anime/${x.mal_id}`}>
                                            <img
                                                src={x.images.jpg.image_url}
                                                alt={x.title_english}
                                                className="h-60 transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:opacity-75"
                                            />
                                            <h3 className="flex-wrap text-sm my-2">{x.title.length > 50 ? `${x.title_english.slice(0, 50)}...` : x.title}</h3>
                                        </Link>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

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
            </div>
        </>
    );
}