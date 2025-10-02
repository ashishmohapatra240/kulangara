// import Image from 'next/image';

// export default function AboutPage() {
//   return (
//     <main className="bg-black text-white font-sans">
//       {/* Hero Section */}
//       <section className="w-full">
//         <Image
//           src="/about-hero.png" // Replace with your uploaded hero collage image
//           alt="NUDE hero banner"
//           width={1920}
//           height={1080}
//           className="w-full h-auto"
//         />
//       </section>

//       {/* Intro Text */}
//       <section className="text-center px-4 py-10 max-w-5xl mx-auto ">
//         <h1 className="text-2xl md:text-3xl font-bold mb-4">
//           NUDE — For The Streets, By The Streets
//         </h1>
//         <p className="text-sm leading-7 md:text-base text-gray-300">
//           NUDE is India’s first genderless streetwear brand, redefining fashion by putting the power in your hands. We’re here to disrupt the traditional fashion cycle, making it about collaboration, creativity, and co-creation. Streetwear isn’t just clothing—it’s culture. At NUDE, we combine traditional design concepts with raw street style to create bold, intersectional apparel. From hip-hop battles featuring our oversized tees to tokenizing designs as NFTs, we’re rewriting the rules.
//         </p>
//       </section>

//       {/* KEEP IT FRESH Banner */}
//       <section className="w-full">
//         <Image
//           src="/keep-it-fresh.png" // Replace with relevant image
//           alt="Keep it Fresh Wall"
//           width={1920}
//           height={1080}
//           className="w-full h-auto"
//         />
//       </section>

//       {/* Why NUDE Section */}
//       <section className="text-center px-4 py-10 max-w-3xl mx-auto">
//         <h2 className="text-xl md:text-2xl font-bold mb-4">Why Nude?</h2>
//         <p className="text-sm md:text-base text-gray-300 mb-2">
//           <strong>Your Voice Matters:</strong> Be part of the design process from start to finish.
//         </p>
//         <p className="text-sm md:text-base text-gray-300 mb-2">
//           <strong>For Designers:</strong> Fair pay and creative freedom, breaking rigid industry norms.
//         </p>
//         <p className="text-sm md:text-base text-gray-300">
//           <strong>Less Waste, More Efficiency:</strong> Smarter production, optimized demand, and sustainable fashion.
//         </p>
//       </section>

//       {/* Team Image */}
//       <section className="w-full">
//         <Image
//           src="/nude-team.png" // Replace with team image
//           alt="NUDE Team"
//           width={1920}
//           height={1080}
//           className="w-full h-auto"
//         />
//       </section>

//       {/* Tech Meets Street */}
//       <section className="text-center px-4 py-10 max-w-3xl mx-auto">
//         <h2 className="text-xl md:text-2xl font-bold mb-4">Tech Meets Street</h2>
//         <p className="text-sm md:text-base text-gray-300">
//           We’re leveraging Web3 and blockchain technology to build a decentralized, collaborative fashion platform. From NFTs to seamless design interaction, NUDE is shaping the future of fashion.
//         </p>
//       </section>

//       {/* Party Image */}
//       <section className="w-full">
//         <Image
//           src="/nude-party.png" // Replace with party/group image
//           alt="NUDE Community"
//           width={1920}
//           height={1080}
//           className="w-full h-auto"
//         />
//       </section>

//       {/* Where We're Headed */}
//       <section className="text-center px-4 py-10 max-w-3xl mx-auto">
//         <h2 className="text-xl md:text-2xl font-bold mb-4">Where We’re Headed</h2>
//         <p className="text-sm md:text-base text-gray-300 mb-2">
//           This year, we’re growing the NUDE community with:
//         </p>
//         <ul className="text-sm md:text-base text-gray-300 mb-2 list-disc list-inside">
//           <li><strong>500+ designers</strong> and <strong>100+ enthusiasts</strong>.</li>
//           <li><strong>Dance battles</strong> and <strong>street events</strong> to bring our vision to life.</li>
//           <li><strong>NFT experiments</strong> to revolutionize participatory fashion.</li>
//         </ul>
//         <p className="text-sm md:text-base text-gray-300">
//           Let’s create the future of fashion—<strong>together</strong>. Welcome to NUDE.
//         </p>
//         <a href="#" className="mt-4 inline-block text-white font-semibold underline">JOIN OUR COMMUNITY</a>
//       </section>
//     </main>
//   );
// }

import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 font-sans">
      {/* Page Title */}
      <div className="mt-14">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 underline">
        About Us
      </h1>
      </div>

      {/* Intro */}
      <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
        Welcome to <span className="font-semibold">Kulangara</span>, where style
        meets comfort. We’re passionate about creating clothing that feels as
        good as it looks, designed for the modern individual who values quality
        and authenticity.
      </p>

      {/* Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>

          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed">
            Founded with a mission to redefine casual wear, Kulangara blends
            premium fabrics with timeless designs. Our journey started with a
            simple idea: to make everyday essentials that last longer, fit
            better, and feel softer.
          </p>
        </div>
        <div className="bg-gray-100 h-64 rounded-lg shadow-sm flex items-center justify-center text-gray-500">
          {/* Replace with an image */}
          Image Placeholder
        </div>
      </div>

      {/* Values */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Our Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Quality</h3>
            <p className="text-gray-600 text-sm">
              Every piece is made with care, ensuring durability and comfort.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Sustainability</h3>
            <p className="text-gray-600 text-sm">
              We aim to minimize waste and embrace eco-friendly practices.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Community</h3>
            <p className="text-gray-600 text-sm">
              Building a brand that supports and grows with our customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
