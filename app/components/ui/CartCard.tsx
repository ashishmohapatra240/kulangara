import Image from "next/image";
import Link from "next/link";
import { ICartItem } from "@/app/types/cart.type";

interface CartCardProps {
  item: ICartItem;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
}

export default function CartCard({
  item,
  updateQuantity,
  removeFromCart,
}: CartCardProps) {

  const productId = item.product?.id || item.productId;

  if (!productId) {
    return (
      <div className="flex items-start gap-4 border-b border-gray-200 py-4">
        <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-400">
          No product info
        </div>
        <div className="flex-grow">
          <h2 className="text-base font-medium">Product unavailable</h2>
          <p className="text-sm text-gray-500">This item is no longer available.</p>
        </div>
      </div>
    );
  }

  const displayImage =
    item.product.images?.[0]?.url ||
    item.product.image ||
    "/images/coming-soon.jpg";


  return (
    <div className="flex items-start gap-4 border-b border-gray-200 py-4">
      <Link
        href={`/products/${productId}`}
        className="block w-24 h-24 relative flex-shrink-0"
      >
        <Image
          src={displayImage}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      <div className="flex-grow">
        <Link href={`/products/${productId}`}>
          <h2 className="text-base font-medium hover:underline">
            {item.product.name}
          </h2>
        </Link>
        <p className="text-base mt-1">
          {item.product.discountedPrice && item.product.discountedPrice < item.price ? (
            <>
              ₹{item.product.discountedPrice.toLocaleString()}.00{' '}
              <span className="text-gray-500 line-through text-sm">₹{item.price.toLocaleString()}.00</span>
            </>
          ) : (
            <>₹{item.price.toLocaleString()}.00</>
          )}
        </p>

        {/* Show variant info if available */}
        {item.variant && typeof item.variant === 'object' && (
          <p className="text-sm text-gray-500 mt-1">
            Size: {item.variant?.size || "N/A"} | Color: {item.variant?.color || "Standard"}
          </p>
        )}

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
          {item.product.discountedPrice && item.product.discountedPrice < item.price ? (
            <>
              ₹{(item.product.discountedPrice * item.quantity).toLocaleString()}.00{' '}
              <span className="text-gray-500 line-through text-sm">₹{(item.price * item.quantity).toLocaleString()}.00</span>
            </>
          ) : (
            <>₹{(item.price * item.quantity).toLocaleString()}.00</>
          )}
        </p>
      </div>
    </div>
  );
}
