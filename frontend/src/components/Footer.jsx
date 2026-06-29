import React, { useContext } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { ShopContext } from '../context/ShopContext';

export default function Footer() {
  const { setActivePage } = useContext(ShopContext);

  const handleLinkClick = (e, categoryName) => {
    e.preventDefault();
    setActivePage({ type: 'category', value: categoryName });
  };

  return (
    <footer id="footer" className="bg-charcoal-950 text-cream-100 font-sans border-t border-charcoal-800 pt-20 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">

          {/* Column 1: Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-widest uppercase mb-2">
              Contact Us
            </h3>
            <ul className="flex flex-col gap-3 text-xs text-cream-300">
              <li className="flex items-start gap-2.5 leading-relaxed">
                <FiMapPin className="w-4 h-4 text-rose-300 flex-shrink-0 mt-0.5" />
                <span>410 sheridan Trail, lrving, texas 75063</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="w-4 h-4 text-rose-300 flex-shrink-0" />
                <a href="tel:+14692364976" className="hover:text-rose-300 transition-colors">
                  +1(469) 236-4976
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="w-4 h-4 text-rose-300 flex-shrink-0" />
                <a href="mailto:blouseavenue@yahoo.com" className="hover:text-rose-300 transition-colors">
                  blouseavenue@yahoo.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Information */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-widest uppercase mb-2">
              Information
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-cream-300">
              {['Privacy Policy', 'Refund Policy', 'Shipping Policy', 'Terms & Conditions'].map((policy) => (
                <li key={policy}>
                  <a href="#" className="hover:text-rose-300 hover:pl-1 transition-all duration-300">
                    {policy}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-white tracking-widest uppercase mb-2">
              Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-xs text-cream-300">
              {[
                { label: 'Saree Wear Blouses', target: 'new-arrivals' },
                { label: 'Navratri Special', target: 'new-arrivals' },
                { label: 'Party Wear Blouses', target: 'new-arrivals' },
                { label: 'Bridal Collection', target: 'new-arrivals' },
                { label: 'Best Sellers', target: 'trending' }
              ].map((category, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    onClick={(e) => handleLinkClick(e, category.label)}
                    className="hover:text-rose-300 hover:pl-1 transition-all duration-300"
                  >
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer Strip */}
        <div className="border-t border-charcoal-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] tracking-widest text-cream-400 uppercase">

          {/* Copyright */}
          <div className="text-center">
            &copy; {new Date().getFullYear()} Blouse Avenue. All Rights Reserved.
          </div>

          {/* Designed Tag */}
          <div>
            Designed by <span className="text-rose-300 font-bold tracking-wider">Blouse Avenue Boutique</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
