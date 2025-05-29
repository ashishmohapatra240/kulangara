import React from 'react';
import FastMarquee from 'react-fast-marquee';
import { FaArrowRight } from 'react-icons/fa';
import { defaultItems } from '@/app/data/marquee';

interface MarqueeProps {
  items: typeof defaultItems;
}

const Marquee: React.FC<MarqueeProps> = ({ items }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <FastMarquee
        gradient={false}
        speed={100}
        className="bg-black text-white py-2"
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 mx-8 h-6">
            <span className="text-sm">{item.text}</span>
            <FaArrowRight className="w-4 h-4" />
          </div>
        ))}
      </FastMarquee>
    </div>
  );
};

export default Marquee;

