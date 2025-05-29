import { Product } from "@/app/types/product";
import { DUMMY_WISHLIST } from "./wishlist";

export interface CartItem extends Product {
    quantity: number;
}

export const DUMMY_CART: CartItem[] = [
    {
        ...DUMMY_WISHLIST[0],
        quantity: 2,
    },
    {
        ...DUMMY_WISHLIST[1],
        quantity: 1,
    },
]; 