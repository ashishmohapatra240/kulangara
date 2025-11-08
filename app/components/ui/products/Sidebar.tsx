import { useState } from "react";

const CATEGORIES = ["Men", "Women", "Unisex"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women", "Unisex"];


export default function Sidebar() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([399, 999]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  return (
<div className="w-64 flex-shrink-0 px-4">
  {/* Categories */}
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Categories</h2>
    <div className="space-y-2">
      {CATEGORIES.map((category) => (
        <label key={category} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedCategories.includes(category)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedCategories([...selectedCategories, category]);
              } else {
                setSelectedCategories(
                  selectedCategories.filter((c) => c !== category)
                );
              }
            }}
            className="border-gray-300 text-black"
          />
          {category}
        </label>
      ))}
    </div>
  </div>

  {/* Price Range */}
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Pricing</h2>
    <div className="px-2">
      <input
        type="range"
        min="399"
        max="999"
        value={priceRange[1]}
        onChange={(e) =>
          setPriceRange([priceRange[0], parseInt(e.target.value)])
        }
        className="w-full accent-black"
      />
      <div className="flex justify-between mt-2">
        <span>₹{priceRange[0]}</span>
        <span>₹{priceRange[1]}</span>
      </div>
    </div>
  </div>

  {/* Gender */}
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Gender</h2>
    <div className="space-y-2">
      {GENDERS.map((gender) => (
        <label key={gender} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedGenders.includes(gender)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedGenders([...selectedGenders, gender]);
              } else {
                setSelectedGenders(selectedGenders.filter((g) => g !== gender));
              }
            }}
            className="border-gray-300 text-black"
          />
          {gender}
        </label>
      ))}
    </div>
  </div>

  {/* Size */}
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Size</h2>
    <div className="grid grid-cols-4 gap-2">
      {SIZES.map((size) => (
        <label
          key={size}
          className={`flex items-center justify-center p-2 border cursor-pointer
          ${
            selectedSizes.includes(size)
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border"
          }`}
        >
          <input
            type="checkbox"
            checked={selectedSizes.includes(size)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedSizes([...selectedSizes, size]);
              } else {
                setSelectedSizes(selectedSizes.filter((s) => s !== size));
              }
            }}
            className="sr-only"
          />
          {size}
        </label>
        ))}
      </div>
    </div>
  </div>
);
}
