import Image from "next/image";
import Link from "next/link";

export default function BentoGrid() {
  return (
    <section className="container mx-auto py-8 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
        <div className="relative aspect-square md:aspect-[3/4]">
          <Image
            src="https://images.unsplash.com/photo-1591567462127-1f25099900ab?q=80&w=2033&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Collection highlight"
            width={1000}
            height={1500}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black/80 via-black/60 to-transparent h-[15%] sm:h-[12%]">
              <div className="text-white">
                <h3 className="text-xl sm:text-2xl font-medium">Summer Essentials</h3>
                <Link
                  href="/collection/summer"
                  className="underline mt-1 sm:mt-2 inline-block text-sm sm:text-base hover:text-gray-200 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-2 sm:gap-3 lg:gap-4">
          {[
            {
              title: "New Arrivals",
              image:
                "https://images.unsplash.com/photo-1538329972958-465d6d2144ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/new-arrivals",
            },
            {
              title: "Bestsellers",
              image:
                "https://images.unsplash.com/photo-1597196526281-fe4861daa915?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              link: "/bestsellers",
            },
          ].map((item, index) => (
            <div key={index} className="relative aspect-[4/3] sm:aspect-[3/2]">
              <Image
                src={item.image}
                alt={item.title}
                width={800}
                height={600}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-end">
                <div className="w-full p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent h-[20%]">
                  <div className="text-white">
                    <h3 className="text-lg sm:text-xl font-medium">{item.title}</h3>
                    <Link
                      href={item.link}
                      className="underline mt-1 sm:mt-2 inline-block text-sm sm:text-base hover:text-gray-200 transition-colors"
                    >
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
