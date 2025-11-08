import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
export default function Story() {
  return (
    <section className="py-16 bg-gray-50 mx-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-gray-600">
            Founded in 2024, Kulangara has been at the forefront of sustainable
            fashion. We believe in creating timeless pieces that not only look
            good but also feel good to wear and are good for the planet.
          </p>
          <Link href="/about">
          <Button variant="outline">Learn More</Button>
          </Link>
        </div>
        <div className="relative aspect-square">
          <Image
            src="/images/coming-soon.jpg"
            alt="Our story"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
