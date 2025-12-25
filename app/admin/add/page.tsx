'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Plus, X, Loader2 } from 'lucide-react'; // Added Loader2
import StatusModal from '@/components/StatusModal';

export default function AddItemPage() {
  const router = useRouter();
  
  // Security Check
  useEffect(() => {
    if (!sessionStorage.getItem('house_admin_session')) router.push('/admin');
    fetchCats();
  }, [router]);

  const [categories, setCategories] = useState<any[]>([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  const [form, setForm] = useState({ name: '', price: '', desc: '', catId: '', type: 'permanent' });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Separate preview state
  const [isCompressing, setIsCompressing] = useState(false); // Compression loading state
  const [modal, setModal] = useState({ open: false, msg: '', type: 'success' as 'success'|'error' });

  async function fetchCats() {
    const { data } = await supabase.from('categories').select('*');
    setCategories(data || []);
  }

  // --- NATIVE IMAGE COMPRESSOR UTILITY ---
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (event) => {
        img.src = event.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 1. Calculate new dimensions (Max 1000px width/height to keep size low)
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // 2. Draw image on canvas
        ctx?.drawImage(img, 0, 0, width, height);

        // 3. Compress to JPEG at 70% quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new File object with the compressed blob
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          0.7 // Quality (0.1 to 1.0)
        );
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const originalFile = e.target.files[0];
      
      // Show preview immediately
      setImagePreview(URL.createObjectURL(originalFile));
      setIsCompressing(true);

      try {
        const compressedFile = await compressImage(originalFile);
        setImage(compressedFile); // Store the smaller file
      } catch (error) {
        console.error("Compression error:", error);
        alert("Could not compress image. Using original.");
        setImage(originalFile);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  async function addCategory() {
      if (!newCatName) return;
      const { error } = await supabase.from('categories').insert({ name: newCatName });
      if (!error) {
        fetchCats();
        setShowCatModal(false);
        setNewCatName('');
      }
    }
  
    async function handleSubmit() {
      if (!image || !form.name || !form.price || !form.catId) {
        setModal({ open: true, msg: 'Please fill all fields and upload an image.', type: 'error' });
        return;
      }

      if (isCompressing) {
        setModal({ open: true, msg: 'Please wait for image compression to finish.', type: 'error' });
        return;
      }
  
      try {
        // Upload the COMPRESSED image
        const fileName = `${Date.now()}-${image.name}`;
        const { error: upErr } = await supabase.storage.from('menu-images').upload(fileName, image);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from('menu-images').getPublicUrl(fileName);
  
        const { error: dbErr } = await supabase.from('menu_items').insert({
          name: form.name,
          price: Number(form.price),
          description: form.desc,
          category_id: form.catId,
          image_url: publicUrl,
          is_permanent: form.type === 'permanent',
          is_daily: form.type === 'daily'
        });
  
        if (dbErr) throw dbErr;
        
        setModal({ open: true, msg: 'Item added successfully!', type: 'success' });
        setTimeout(() => router.push('/admin/dashboard'), 1500);
      } catch (e) {
        setModal({ open: true, msg: 'Upload failed. Try again.', type: 'error' });
      }
    }

  return (
    <div className="min-h-screen bg-stone-50 p-6 text-stone-900">
      <StatusModal isOpen={modal.open} message={modal.msg} type={modal.type} onClose={() => setModal({...modal, open: false})} />
      
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-stone-500 font-bold uppercase text-xs tracking-widest hover:text-stone-800">
        <ArrowLeft size={16} /> Cancel
      </button>

      <h1 className="text-2xl font-bold mb-8 text-stone-900 uppercase tracking-tight">Add New Item</h1>

      <div className="space-y-4">
        {/* Image Picker */}
        <div className="w-full h-40 bg-white border-2 border-dashed border-stone-300 rounded-3xl flex items-center justify-center overflow-hidden relative group hover:border-[#C6A87C] transition-colors">
          {imagePreview ? (
            <>
              <img src={imagePreview} className={`w-full h-full object-cover ${isCompressing ? 'opacity-50 blur-sm' : ''}`} />
              {/* Compression Indicator */}
              {isCompressing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <Loader2 className="animate-spin text-stone-800 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-800 bg-white/80 px-2 py-1 rounded-full">Compressing...</span>
                </div>
              )}
            </>
          ) : (
            <label className="flex flex-col items-center cursor-pointer p-10 w-full h-full justify-center">
              <Camera className="text-stone-300 mb-2 group-hover:text-[#C6A87C]" />
              <span className="text-[10px] uppercase font-bold text-stone-400 group-hover:text-[#C6A87C]">Tap to upload</span>
              {/* Changed onChange to handleImageSelect */}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </label>
          )}
        </div>

        <input placeholder="Item Name" className="input-field" onChange={e => setForm({...form, name: e.target.value})} />
        
        <div className="flex gap-2">
          <select className="input-field flex-1" onChange={e => setForm({...form, catId: e.target.value})}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button onClick={() => setShowCatModal(true)} className="bg-stone-900 text-white rounded-2xl w-14 flex items-center justify-center active:scale-95 transition-transform">
            <Plus />
          </button>
        </div>

        <div className="flex gap-4">
          <input type="number" placeholder="Price" className="input-field flex-1" onChange={e => setForm({...form, price: e.target.value})} />
          <select className="input-field flex-1" onChange={e => setForm({...form, type: e.target.value})}>
            <option value="permanent">Permanent</option>
            <option value="daily">Daily Special</option>
          </select>
        </div>

        <textarea placeholder="Description" className="input-field h-24 pt-4 resize-none" onChange={e => setForm({...form, desc: e.target.value})} />

        <button 
          onClick={handleSubmit} 
          disabled={isCompressing} // Disable save while compressing
          className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest mt-4 shadow-xl transition-transform ${isCompressing ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-900 text-white active:scale-95'}`}
        >
          {isCompressing ? 'Compressing Image...' : 'Save Item'}
        </button>
      </div>

      {/* New Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-end">
          <div className="bg-white w-full rounded-t-[32px] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg text-stone-900">New Category</h3>
              <button onClick={() => setShowCatModal(false)}><X size={20} className="text-stone-500"/></button>
            </div>
            <input 
              placeholder="e.g. Smoothies" 
              className="input-field mb-6 bg-stone-50" 
              autoFocus
              onChange={e => setNewCatName(e.target.value)} 
            />
            <button onClick={addCategory} className="w-full bg-[#C6A87C] text-white py-4 rounded-2xl font-bold uppercase tracking-widest">Create Category</button>
          </div>
        </div>
      )}
    </div>
  );
}