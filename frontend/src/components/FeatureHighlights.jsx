import React from 'react';
import { FiTruck, FiShield, FiRotateCcw, FiHeadphones } from 'react-icons/fi';

export default function FeatureHighlights() {
  const highlights = [
    {
      icon: <FiTruck className="w-6 h-6 text-rose-500" />,
      title: 'Free Shipping',
      subtitle: 'Complimentary shipping across India on all prepaid orders.'
    },
    {
      icon: <FiHeadphones className="w-6 h-6 text-rose-500" />,
      title: '24/7 Concierge',
      subtitle: 'Dedicated stylist consultation and order tracking support.'
    },
    {
      icon: <FiShield className="w-6 h-6 text-rose-500" />,
      title: 'Secure Checkout',
      subtitle: 'Encrypted payment gateways accepting major cards & UPI.'
    },
    {
      icon: <FiRotateCcw className="w-6 h-6 text-rose-500" />,
      title: 'Hassle-Free Returns',
      subtitle: 'Easy 14-day exchange policy for correct sizing fits.'
    }
  ];

  return (
    <section id="highlights" className="bg-[#FAF7F0] border-b border-cream-200 py-16 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-cream-200/50 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mb-4.5">
                {item.icon}
              </div>

              {/* Text */}
              <h3 className="font-serif text-sm font-bold text-charcoal-900 uppercase tracking-widest mb-2">
                {item.title}
              </h3>
              <p className="text-xxs md:text-xs text-charcoal-500 max-w-[220px] leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
