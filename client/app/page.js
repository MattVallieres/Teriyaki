import { Recommendations } from "./components/recommendation";
import { Carousel } from "./components/carousel";
import { Popular } from "./components/popular";

export default function Home() {
  return (
    <>
      <Carousel />
      <Recommendations />
      <Popular />
    </>
  )
}
