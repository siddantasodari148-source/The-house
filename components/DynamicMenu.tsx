'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Utensils, Star } from 'lucide-react';
import MenuList from './MenuList';

export default function DynamicMenu() {
  const [activeTab, setActiveTab] = useState<'permanent' | 'daily'>('permanent');
  const [data, setData] = useState<{items: any[], categories: any[]}>({ items: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getMenu() {
      // --- 1. OFFLINE FIRST: Try to load from LocalStorage immediately ---
      try {
        const cachedData = localStorage.getItem('house_menu_cache');
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setData(parsed);
          setLoading(false); // Show cached menu instantly
        }
      } catch (e) {
        console.error("Cache read error", e);
      }

      // --- 2. NETWORK STRATEGY: Try to fetch fresh data ---
      // If online, this will overwrite the cache with new prices/items
      try {
        const { data: categories, error: catError } = await supabase.from('categories').select('*').order('display_order');
        const { data: items, error: itemError } = await supabase.from('menu_items').select('*').order('name');

        if (!catError && !itemError && categories && items) {
          const freshData = { categories, items };
          
          // Update State
          setData(freshData);
          
          // Save to LocalStorage for next time (Offline Backup)
          localStorage.setItem('house_menu_cache', JSON.stringify(freshData));
        }
      } catch (err) {
        // If fetch fails (offline), we simply stay on the cached data we loaded in step 1.
        console.log("Network request failed, using offline cache.");
      } finally {
        setLoading(false);
      }
    }
    getMenu();
  }, []);

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-[#C6A87C] uppercase tracking-[0.3em] text-xs font-bold animate-pulse">Loading Menu...</div>
    </div>
  );

  const filteredItems = data.items.filter(i => activeTab === 'permanent' ? i.is_permanent : i.is_daily);

  return (
    <div className="w-full relative z-20">
      {/* Floating Tab Switcher */}
      <div className="flex justify-center mb-6 sticky top-4 z-50 px-4">
        <div className="bg-[#1A1A1A]/95 backdrop-blur border border-stone-800 p-1.5 rounded-full flex shadow-2xl w-full max-w-sm">
          <button
            onClick={() => setActiveTab('permanent')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'permanent' ? 'bg-[#F4F1EA] text-[#1A1A1A] shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Utensils size={12} /> Permanent
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === 'daily' ? 'bg-[#F4F1EA] text-[#1A1A1A] shadow-md' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Star size={12} /> Daily
          </button>
        </div>
      </div>

      <MenuList categories={data.categories} items={filteredItems} isDaily={activeTab === 'daily'} />
    </div>
  );
}