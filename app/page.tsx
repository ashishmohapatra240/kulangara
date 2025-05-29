import FeaturedProducts from "./components/sections/FeaturedProducts";
import Hero from "./components/sections/Hero";
import Story from "./components/sections/Story";
import BentoGrid from "./components/sections/BentoGrid";
export default function Home() {
  return (
    <>
      <main className="min-h-screen overflow-x-hidden">
        <Hero />
        <FeaturedProducts />
        <Story />
        <BentoGrid />
      </main>
    </>
  );
}
