"use client"
import { BiRightArrow } from "react-icons/bi";
import { useState, useEffect } from "react";
import { FiLoader } from 'react-icons/fi';
import Link from "next/link";

export const Trending = () => {
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
      // Simulating a delay for demonstration purposes
      // In your real code, this delay should be removed
      await new Promise(resolve => setTimeout(resolve, 2000));

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
    <>
      {isLoading ? ( // If isLoading is true, show the loading spinner
        <div className="flex items-center justify-center mt-40">
          <FiLoader className="text-4xl animate-spin" />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="my-20 px-4 md:px-8">
            <h1 className="mb-4 uppercase text-lg font-medium md:text-xl">What's trending today!</h1>
            <div className="flex">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8 w-50">
                {/* map to show 6 anime */}
                {recommend.length > 0 &&
                  recommend.map((x, index) => (
                    <div key={`${x.entry[1].mal_id}-${index}`} className="w-44">
                      <Link href={`/anime/${x.entry[0].mal_id}`}>
                        <img
                          src={x.entry[1].images.jpg.image_url}
                          alt={x.entry[1].title}
                          className="h-60 w-44 transition-transform duration-300 ease-in-out transform-gpu hover:scale-105 hover:opacity-75"
                        />
                        <h3 className="flex-wrap text-sm my-2">
                          {/* if the title is too long add ...*/}
                          {x.entry[1].title.length > 50 ? `${x.entry[1].title.slice(0, 50)}...` : x.entry[1].title}
                        </h3>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex">
              <Link href="/recommendations" className="text-base font-medium uppercase bg-[#202124] py-2 px-4 mt-10 hover:bg-[#414141] flex items-center">Browse Trendings <BiRightArrow className="ml-2" /></Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};