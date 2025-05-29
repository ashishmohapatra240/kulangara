"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../ui/Button";
import { SLIDES } from "@/app/data/hero";
import Link from "next/link";
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] overflow-hidden mt-30">
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-opacity-30 flex items-center justify-center text-white z-10">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-medium">{slide.title}</h1>
              <p className="text-xl">{slide.description}</p>
              <Link href="/products">
              <Button variant="primary" size="lg" className="mt-6">
                Shop Now
              </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
