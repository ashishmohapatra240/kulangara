"use client";

import React from "react";
import Image from "next/image";
import Modal from "./Modal";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCategory?: string;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
}: SizeGuideModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6">
        <div className="relative w-full aspect-square">
          <Image
            src="/images/size-chart-men.png"
            alt="Men's size chart showing chest and length measurements in inches for regular fit and oversized t-shirts, sizes S to XXL"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 640px"
            priority
          />
        </div>

        <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact our customer service team for personalized sizing
            assistance.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
