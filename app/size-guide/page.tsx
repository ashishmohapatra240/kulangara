import React from "react";
import Image from "next/image";

export default function SizeGuidePage() {
  return (
    <div className="max-w-3xl mt-4 mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Size Guide
          </h1>
        </div>
        <p className="text-gray-600">
          Find your perfect fit with our clothing size chart.
        </p>
      </div>

      <div className="relative w-full aspect-square">
        <Image
          src="/images/size-chart-men.png"
          alt="Men's size chart showing chest and length measurements in inches for regular fit and oversized t-shirts, sizes S to XXL"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      </div>

      {/* Footer Note */}
      <div className="mt-12 pt-6 border-t border-black text-center">
        <p className="text-sm text-gray-600">
          Need help? Contact our customer service team for personalized sizing
          assistance.
        </p>
      </div>
    </div>
  );
}
