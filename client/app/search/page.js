"use client"
import React, { useState, useEffect } from 'react';
import { GiChicken } from 'react-icons/gi';
import Link from 'next/link';

export default function Search() {
    // User's search query
    const [searchTerm, setSearchTerm] = useState('');
    // Stores the search results obtained from an API request
    const [searchResults, setSearchResults] = useState([]);
    // Indicates whether data is currently being loaded
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle changes in the search input field
    const handleSearchTermChange = (event) => {
        // Update the 'searchTerm' state with the current value of the input field
        setSearchTerm(event.target.value);
    };

    // Function to handle the search form submission
    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        
        setSearchResults([]);
        setIsLoading(true);

        try {
            // Fetch data based on the search term
            const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchTerm}&sfw`);
            if (!response.ok) {
                throw new Error(`Error fetching anime data: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            const results = data.data;
            setSearchResults(results);
            setIsLoading(false);
        } catch (error) {
            console.error('Error searching for anime:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
    }, []);

    return (
        <div className="container mx-auto">
            <div className="flex justify-center">
                <form onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="bg-[#141519] rounded px-4 m-6 py-2"
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            {isLoading && <div className="flex items-center justify-center mt-40">
                <GiChicken className="text-4xl animate-pulse" />
            </div>}
            {searchResults.length > 0 && (
                <div className="my-20 px-4 md:px-8">
                    <h2 className="flex uppercase my-4 text-xl">Search Results</h2>
                    <div className="flex justify-center">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-8">
                            {searchResults.map((result) => (
                                <div key={result.mal_id} className="w-44 relative">
                                    <Link href={`/anime/${result.mal_id}`}>
                                        <img
                                            src={result.images.jpg.image_url}
                                            alt={result.title}
                                            className="h-60 w-44 transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:opacity-75"
                                        />
                                        <h3 className="flex-wrap text-sm my-2">
                                            {result.title.length > 50 ? `${result.title.slice(0, 50)}...` : result.title}
                                        </h3>
                                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 p-4 text-white opacity-0 hover:opacity-100 transition-opacity">
                                            <h1 className="font-bold mb-2">
                                                {result.title.length > 20 ? `${result.title.slice(0, 20)}...` : result.title}
                                            </h1>
                                            <p className="text-white">
                                                {result.synopsis
                                                    ? result.synopsis.length > 120
                                                        ? `${result.synopsis.slice(0, 120)}...`
                                                        : result.synopsis
                                                    : 'Synopsis not available'}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {searchTerm !== '' && searchResults.length === 0 && !isLoading && (
                <div className="my-20 px-4 md:px-8 text-center text-gray-500">
                    No results found.
                </div>
            )}
        </div>
    );
}
