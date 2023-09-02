import { Carousel } from "./components/carousel";
import { Trending } from "./components/trending";
import { Popular } from "./components/popular";

export default function Home() {
  return (
    <>
      <Carousel />
      <Trending />
      <Popular />
    </>
  )
}
