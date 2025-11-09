"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { IProduct, IProductImage } from "@/app/types/product.type";
import productsService from "@/app/services/products.service";
import { Button } from "../ui/button";

interface ProductImagesManagementProps {
  product: IProduct;
  onClose: () => void;
}

export default function ProductImagesManagement({
  product,
  onClose,
}: ProductImagesManagementProps) {
  const [images, setImages] = useState<IProductImage[]>(product.images || []);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    if (!alt.trim()) {
      toast.error('Please provide alt text for the image');
      return;
    }
    
    setUploading(true);
    try {
      // 1. Get upload URL
      const response = await productsService.getUploadUrls(product.id, [
        file.type,
      ]);

      // Check if we have upload URLs
      if (!response.uploadUrls || response.uploadUrls.length === 0) {
        throw new Error("No upload URLs received");
      }

      const uploadUrlData = response.uploadUrls[0];
      if (!uploadUrlData) {
        throw new Error("Invalid upload URL data");
      }
      const uploadURL = uploadUrlData.uploadURL;
      const imageKey = uploadUrlData.key;

      // 2. Upload to S3
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to S3: ${uploadResponse.statusText}`);
      }

      // 3. Register image in backend - use the S3 URL without query parameters
      const s3Url = `https://kulangara.s3.ap-south-1.amazonaws.com/${imageKey}`;
      await productsService.addProductImages(product.id, [
        {
          url: s3Url,
          alt: alt || file.name,
          isPrimary,
        },
      ]);

      // 4. Refresh images
      const updatedProduct = await productsService.getProductById(product.id);
      setImages(updatedProduct.images || []);

      // Reset form
      setFile(null);
      setAlt("");
      setIsPrimary(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Show success message
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    setDeleting(imageId);
    try {
      await productsService.deleteProductImage(product.id, imageId);
      // Refetch images from backend
      const updatedProduct = await productsService.getProductById(product.id);
      setImages(updatedProduct.images || []);
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    setSettingPrimary(imageId);
    try {
      // Set all others to false, this one to true
      const updatedImages = images.map(img => ({ ...img, isPrimary: img.id === imageId }));
      await productsService.addProductImages(product.id, updatedImages);
      setImages(updatedImages);
      toast.success('Primary image updated successfully!');
    } catch (error) {
      console.error('Set primary error:', error);
      toast.error(`Failed to update primary image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSettingPrimary(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Images for {product.name}</h2>
      <div className="mb-4">
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
        <input
          type="text"
          placeholder="Alt text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="ml-2 px-2 py-1 border border-gray-300"
        />
        <label className="ml-2">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
          />{" "}
          Primary
        </label>
        <Button 
          onClick={handleUpload} 
          disabled={uploading || !file || !alt.trim()} 
          className="ml-2"
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2 font-medium">Image</th>
              <th className="text-left px-4 py-2 font-medium">Alt</th>
              <th className="text-left px-4 py-2 font-medium">Primary</th>
              <th className="text-left px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id} className="border-b border-gray-200">
                <td className="px-4 py-2">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover border"
                  />
                </td>
                <td className="px-4 py-2">{img.alt}</td>
                <td className="px-4 py-2">{img.isPrimary ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  {!img.isPrimary && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetPrimary(img.id)}
                      disabled={settingPrimary === img.id}
                    >
                      {settingPrimary === img.id ? "Setting..." : "Set Primary"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(img.id)}
                    disabled={deleting === img.id}
                  >
                    {deleting === img.id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
