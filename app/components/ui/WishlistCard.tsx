import Link from "next/link";
import Image from "next/image";
import { Product } from "@/app/types/product";

export default function WishlistCard({
  item,
  removeFromWishlist,
}: {
  item: Product;
  removeFromWishlist: (id: string) => void;
}) {
  return (
    <div key={item.id} className="flex items-start gap-4 group">
      <Link
        href={`/products/${item.id}`}
        className="block w-24 h-24 relative flex-shrink-0"
      >
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex-grow">
        <Link href={`/products/${item.id}`}>
          <h2 className="text-base font-medium hover:underline">{item.name}</h2>
        </Link>
        <p className="text-base mt-1">Rs. {item.price.toLocaleString()}.00</p>
        <button
          onClick={() => removeFromWishlist(item.id)}
          className="text-sm text-gray-500 hover:text-black mt-2 cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
