"use client";
import React, { useState, useEffect } from "react";
import { BiRightArrow } from "react-icons/bi";
import { GiChicken } from 'react-icons/gi';
import Link from "next/link";

export const Popular = () => {
  // state to store info
  const [getPopular, setGetPopular] = useState([]);
  // When we're waiting to see the anime, we show a spinning icon. When we see the anime, we stop the spinning icon
  const [isLoading, setIsLoading] = useState(true);

  // fetch data when the page loads
  useEffect(() => {
    fetchData();
  }, []);


  // fetching top anime
  const fetchData = async () => {
    try {
      // Hey api, what anime is popular?
      const response = await fetch(`https://api.jikan.moe/v4/top/anime`);
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching recommendations: ${response.status} - ${response.statusText}`);
      }
      // Parse the response as JSON
      const data = await response.json();
      // Slice to show only 6 recommendations
      const slicedData = data.data.slice(0, 6);
      setGetPopular(slicedData);
      // We're done fetching data, so set isLoading to false
      setIsLoading(false);
    } catch (error) {
      // Handle any errors here
      console.error('Error fetching recommendations:', error);
      // Also, set isLoading to false in case of an error
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="flex justify-center">
        <div className="my-20 px-4 md:px-8">
          <h1 className="mb-4 uppercase text-lg font-medium md:text-xl">popular among the fans!</h1>
          <div className="flex">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 w-50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
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
          <div className="flex">
            <Link href="/popular" className="text-base font-medium uppercase bg-[#202124] py-2 px-4 mt-10 hover:bg-[#414141] flex items-center">Browse Popularity<BiRightArrow className="ml-2" /></Link>
          </div>
        </div>
      </div>
    </>
  );
};
