import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/app/types/product.type";
import Button from "./Button";

export default function WishlistCard({
  item,
  removeFromWishlist,
  moveToCart,
}: {
  item: IProduct;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 hover:border-gray-300 transition-colors">
      <Link
        href={`/products/${item.id}`}
        className="block w-24 h-24 relative flex-shrink-0"
      >
        <Image src={item.images?.[0].url || ""} alt={item.name} fill className="object-cover" />
      </Link>

      <div className="flex-grow min-w-0">
        <Link href={`/products/${item.id}`}>
          <h2 className="text-base font-medium hover:underline truncate">{item.name}</h2>
        </Link>
        <p className="text-base mt-1 font-semibold">Rs. {item.price.toLocaleString()}.00</p>
        
        <div className="flex items-center gap-3 mt-3">
          <Button
            onClick={() => moveToCart(item.id)}
            size="sm"
            className="px-4 py-2 text-sm"
          >
            Move to Cart
          </Button>
          <button
            onClick={() => removeFromWishlist(item.id)}
            className="text-sm text-gray-500 hover:text-black underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
