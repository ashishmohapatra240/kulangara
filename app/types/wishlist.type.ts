import { Product } from "./product.type";

export interface IWishlistItem {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
    product: Product;
}

export interface IWishlistListResponse {
    data: IWishlistItem[];
}

export interface IWishlist {
    data: IWishlistItem;
}
