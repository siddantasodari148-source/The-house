// components/Footer.tsx
import { Instagram, Facebook, MapPin, Star, ArrowUpRight } from 'lucide-react';
import Image from 'next/image'; // Import Next.js Image component

export default function Footer() {
  // 1. The actual Google Maps Link (for navigation)
  const mapLink = "https://www.google.com/maps/search/?api=1&query=The+House+Cafe+Narayangarh"; 

  return (
    <footer className="bg-stone-900 text-white mt-20 rounded-t-[3rem] px-8 pt-16 pb-12">
      <div className="max-w-md mx-auto space-y-12">
        
        {/* Review CTA */}
        <div className="text-center space-y-4">
          <div className="flex justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
          </div>
          <h2 className="text-xl font-serif italic">Best coffee and vibes in the city!</h2>
          <a 
             // Use your actual review link here
            href="https://www.google.com/search?q=the+house+caffee#lkt=LocalPoiReviews"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-stone-900 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform"
          >
            Leave a Review <ArrowUpRight size={14} />
          </a>
        </div>

        {/* --- OFFLINE-READY MAP SECTION --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
            <MapPin size={14} /> Find the House
          </div>
          
          <a 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block h-48 rounded-3xl overflow-hidden border border-stone-800 relative group"
          >
            {/* Using a Static Image ensures this works OFFLINE.
               The PWA will cache 'map-offline.png' automatically.
            */}
            <div className="relative w-full h-full">
               {/* Ensure you put 'map-offline.png' in your public folder! */}
               <img 
                 src="../map-offline.png" 
                 alt="Location Map"
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               
               {/* Stylish Overlay */}
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur text-stone-900 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <MapPin size={14} /> Open Maps
                  </div>
               </div>
            </div>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-stone-800 flex flex-col items-center gap-6">
          <div className="flex gap-8">
            <a href="#" className="p-3 bg-stone-800 rounded-full hover:bg-stone-700 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="p-3 bg-stone-800 rounded-full hover:bg-stone-700 transition-colors"><Facebook size={20} /></a>
          </div>
          <p className="text-[10px] text-stone-500 uppercase tracking-[0.3em]">
            © 2025 THE HOUSE CAFE
          </p>
        </div>
      </div>
    </footer>
  );
}