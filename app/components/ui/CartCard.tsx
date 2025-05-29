import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/app/data/cart";

interface CartCardProps {
  item: CartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export default function CartCard({
  item,
  updateQuantity,
  removeFromCart,
}: CartCardProps) {
  return (
    <div className="flex items-start gap-4 border-b border-gray-200 py-4">
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
        <p className="text-base mt-1">₹{item.price.toLocaleString()}.00</p>

        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center border border-gray-300">
            <button
              onClick={() =>
                updateQuantity(item.id, Math.max(0, item.quantity - 1))
              }
              className="px-3 py-1 hover:bg-gray-100"
            >
              -
            </button>
            <span className="px-3 py-1 border-x border-gray-300">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-gray-500 hover:text-black"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-medium">
          ₹{(item.price * item.quantity).toLocaleString()}.00
        </p>
      </div>
    </div>
  );
}
