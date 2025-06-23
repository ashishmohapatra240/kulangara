import { IProduct } from "./product.type";

export interface IWishlistItem {
    id: string;
    userId: string;
    productId: string;
    createdAt: string;
    product: IProduct;
}

export interface IWishlistListResponse {
    data: IWishlistItem[];
}

export interface IWishlist {
    data: IWishlistItem;
}
