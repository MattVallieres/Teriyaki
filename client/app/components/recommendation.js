"use client"
import { BiRightArrow } from "react-icons/bi";
import { useState, useEffect } from "react";
import { GiChicken } from 'react-icons/gi';
import Link from "next/link";

export const Recommendations = () => {
  // We have a list where we keep information about anime
  const [recommend, setRecommend] = useState([]);
  // When we're waiting to see the anime, we show a spinning icon. When we see the anime, we stop the spinning icon
  const [isLoading, setIsLoading] = useState(true);

  // We fetch the data when the page loads
  useEffect(() => {
    fetchData();
  }, []);

  // Let's go fetch some cool anime!
  const fetchData = async () => {
    try {
      // Hey api, give me info about what you'll recommend today!
      const response = await fetch(`https://api.jikan.moe/v4/recommendations/anime`);
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error(`Error fetching recommendations: ${response.status} - ${response.statusText}`);
      }
      // Parse the response as JSON
      const data = await response.json();
      // Slice to show only 6 recommendations
      const slicedData = data.data.slice(0, 6);
      setRecommend(slicedData);
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
    <div className="flex justify-center">
      <div className="my-20 px-4 md:px-8">
        <h1 className="mb-4 uppercase text-lg font-medium md:text-xl">Fans recommendations!</h1>
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
              : recommend.map((x, index) => (
                <div key={`${x.entry[1].mal_id}-${index}`} className="w-44 relative">
                  <Link href={`/anime/${x.entry[1].mal_id}`}>
                    <img
                      src={x.entry[1].images.jpg.image_url}
                      alt={x.entry[1].title}
                      className="h-60 w-44 transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:opacity-75"
                    />
                    <h3 className="flex-wrap text-sm my-2">
                      {x.entry[1].title.length > 50 ? `${x.entry[1].title.slice(0, 50)}...` : x.entry[1].title}
                    </h3>
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 p-4 text-white opacity-0 hover:opacity-100 transition-opacity">
                      <h1 className="font-bold mb-2">
                        {x.entry[1].title.length > 20 ? `${x.entry[1].title.slice(0, 20)}...` : x.entry[1].title}
                      </h1>
                      <p className="text-white">
                        {x.content.length > 120 ? `${x.content.slice(0, 120)}...` : x.content}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
        <div className="flex">
          <Link href="/recommendation" className="text-base font-medium uppercase bg-[#202124] py-2 px-4 mt-10 hover:bg-[#414141] flex items-center">browse recommendations<BiRightArrow className="ml-2" /></Link>
        </div>
      </div>
    </div>
  );
};