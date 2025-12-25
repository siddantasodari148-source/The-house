import { MapPin, Instagram, Facebook } from 'lucide-react';

interface Props {
  categories: any[];
  items: any[];
  isDaily: boolean;
  image?: string | null;
}

export default function MenuList({ categories, items, isDaily }: Props) {
  const reviewLink = "https://www.google.com/search?q=the+house+caffee...&lqi=ChF0aGUgaG91c2UgY2FmZS4uLiIDiAEBSP7ag_TeuoCACFoaEAAQARACGAAYASIOdGhlIGhvdXNlIGNhZmWSARFicnVuY2hfcmVzdGF1cmFudJoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VSaWJIQXpkWFIzUlJBQvoBBAgAEC0#lkt=LocalPoiReviews&rlimm=14749441452503669747&lrd=0x3994fb000b760fc9:0xccb08adaebe71bf3,3,,,,"; // (Shortened for brevity)

  return (
    <div className="bg-[#F4F1EA] text-[#3D2B1F] rounded-t-[40px] px-6 py-12 min-h-[80vh] shadow-[0_-10px_60px_rgba(0,0,0,0.5)] relative overflow-hidden max-w-5xl mx-auto">
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`}}></div>

      <div className="relative z-10">
        
        {/* --- MENU HEADER (Borcelle Style) --- */}
        <div className="text-center mb-16">
           {/* Your Logo Image Here */}
           <div className="w-24 h-24 mx-auto mb-4 opacity-90">
             <img src="/thehouse.png" alt="The House Logo" className="w-full h-full object-contain" />
           </div>
           
           <h1 className="font-serif text-5xl font-bold tracking-tight text-[#3D2B1F] mb-2">
             THE HOUSE
           </h1>
           <p className="font-serif italic text-xl text-[#8C8C8C]">
             {isDaily ? 'Daily Specials' : 'Coffee Shop Menu'}
           </p>
        </div>

        {/* --- CATEGORY LOOP --- */}
        {categories.map(cat => {
          const catItems = items.filter(i => i.category_id === cat.id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id} className="mb-16 last:mb-0">
              
              {/* Category Title with Separator */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] flex-1 bg-[#3D2B1F]" />
                <h3 className="text-2xl font-serif font-bold uppercase tracking-[0.15em] text-[#3D2B1F] px-4">
                  {cat.name}
                </h3>
                <div className="h-[2px] flex-1 bg-[#3D2B1F]" />
              </div>

              {/* Items Grid: 1 Column on Mobile, 2 Columns on Desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {catItems.map(item => (
                  <div key={item.id} className={`flex items-start gap-4 group ${item.is_out_of_stock ? 'opacity-40 grayscale' : ''}`}>
                    
                    {/* Optional Item Image (Styled Elegant & Small) */}
                    {item.image_url && (
                      <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border border-[#3D2B1F]/10 shadow-sm mt-1">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1 border-b border-[#3D2B1F]/10 pb-2">
                      <div className="flex justify-between items-baseline w-full">
                        <h4 className="font-sans font-bold text-[#3D2B1F] text-[16px] uppercase tracking-wide">
                          {item.name}
                        </h4>
                        <div className="font-bold text-[#3D2B1F] text-[16px] font-sans whitespace-nowrap ml-2">
                          <span className="text-xs mr-1">Rs.</span>{item.price}
                        </div>
                      </div>
                      
                      {item.description && (
                         <p className="text-[12px] text-[#6C6C6C] font-serif italic mt-1 leading-snug w-5/6">
                           {item.description}
                         </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="text-center py-24 opacity-40 font-serif italic text-lg">
            No items available today.
          </div>
        )}

        {/* --- FOOTER --- */}
        <div className="mt-24 pt-12 border-t-2 border-double border-[#D6D0C4] text-center">
            <h3 className="text-[#3D2B1F] font-bold text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center justify-center gap-2">
              <MapPin size={14} /> Visit Us
            </h3>
            
            <div className="w-full max-w-lg mx-auto h-48 bg-stone-200 grayscale rounded-xl overflow-hidden mb-10 border border-[#D6D0C4] shadow-inner">
               <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.812345678901!2d84.44123456789012!3d27.69123456789012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb000b760fc9%3A0xccb08adaebe71bf3!2sThe%20House%20Cafe!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp" 
                width="100%" height="100%" style={{border:0}} loading="lazy"
              ></iframe>
            </div>

            <div className="flex justify-center gap-8 text-[#3D2B1F] mb-10">
              <a href="#" className="hover:text-[#C6A87C] transition-colors"><Instagram /></a>
              <a href="#" className="hover:text-[#C6A87C] transition-colors"><Facebook /></a>
            </div>

             <a 
              href={reviewLink}
              target="_blank"
              className="inline-block bg-[#3D2B1F] text-[#F4F1EA] px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-colors"
            >
              Leave a Review
            </a>
            
            <p className="text-[10px] text-[#8C8C8C] uppercase tracking-[0.3em] mt-12">
              © 2025 The House Cafe • Chitwan
            </p>
        </div>

      </div>
    </div>
  );
}