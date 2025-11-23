import Image from "next/image";
import Link from "next/link";

export default function BentoGrid() {
  return (
    <section className="py-16 container mx-auto px-4 max-w-6xl">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/products" className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-lg aspect-square md:aspect-auto">
          <Image
            src="/images/maarana.png"
            alt="Featured Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0" />
          <div className="absolute inset-0 flex items-end p-6">
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
              <p className="text-sm opacity-90">Explore our latest collection</p>
            </div>
          </div>
        </Link>

        {/* Small cards */}
        <Link href="/products" className="group relative overflow-hidden rounded-lg aspect-square">
          <Image
            src="/images/maahi.jpg"
            alt="Collection 1"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" /> */}
          <div className="absolute top-1 left-0.5 flex items-end p-4">
            <div className="text-white">
              <h3 className="text-xl font-bold">Essentials</h3>
            </div>
          </div>
        </Link>

        <Link href="/products" className="group relative overflow-hidden rounded-lg aspect-square">
          <Image
            src="/images/coming-soon.jpg"
            alt="Collection 2"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex items-end p-4">
            <div className="text-white">
              <h3 className="text-lg font-bold">Premium</h3>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

