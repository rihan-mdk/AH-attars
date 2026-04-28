import React, { useState, useRef } from 'react';
import { useProducts } from '../ProductContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Upload, Image as ImageIcon, Link as LinkIcon, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

const AdminAddScent = () => {
  const { addProduct } = useProducts();
  const navigate = useNavigate();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productType, setProductType] = useState<'Fragrance' | 'Apparel'>('Fragrance');
  
  const [imageEntries, setImageEntries] = useState<{
    id: string;
    url: string;
    file: File | null;
    preview: string | null;
    method: 'url' | 'file';
  }[]>([
    { id: '1', url: '', file: null, preview: null, method: 'url' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Floral',
    notes: '',
    material: '',
    sizes: ['S', 'M', 'L', 'XL'],
    selectedSizes: [] as string[],
    featured: false,
  });

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];

  const addImageEntry = () => {
    if (imageEntries.length >= 4) {
      setError('Maximum 4 images allowed per product.');
      return;
    }
    setImageEntries([
      ...imageEntries,
      { id: Math.random().toString(), url: '', file: null, preview: null, method: 'url' }
    ]);
  };

  const removeImageEntry = (id: string) => {
    if (imageEntries.length <= 1) return;
    setImageEntries(imageEntries.filter(entry => entry.id !== id));
  };

  const updateImageEntry = (id: string, updates: any) => {
    setImageEntries(imageEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('File size exceeds 1MB limit for database storage.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        updateImageEntry(id, { file, preview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter(s => s !== size)
        : [...prev.selectedSizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const processedImages: string[] = [];

      for (const entry of imageEntries) {
        if (entry.method === 'url') {
          if (entry.url) processedImages.push(entry.url);
        } else {
          if (entry.file) {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(entry.file!);
            });
            processedImages.push(base64);
          }
        }
      }

      if (processedImages.length === 0) {
        setError('Please provide at least one image.');
        setIsSubmitting(false);
        return;
      }

      // Check total size if using base64
      const totalSize = processedImages.reduce((acc, img) => acc + img.length, 0);
      if (totalSize > 1000000) {
        setError('Total image data is too large for the database. Please use smaller files or image URLs.');
        setIsSubmitting(false);
        return;
      }

      const productData: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        longDescription: formData.description,
        category: productType === 'Fragrance' ? formData.category : 'Apparel',
        image: processedImages[0],
        images: processedImages,
        featured: formData.featured,
      };

      if (productType === 'Fragrance') {
        productData.notes = formData.notes.split(',').map(n => n.trim()).filter(n => n !== '');
      } else {
        productData.material = formData.material;
        productData.sizes = formData.selectedSizes;
      }

      await addProduct(productData);
      navigate('/admin/manage');
    } catch (error: any) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-4 md:p-12 rounded-3xl md:rounded-[40px] shadow-xl border border-brand-accent/10"
      >
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center space-x-3 text-red-600"
            >
              <AlertTriangle size={18} />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          {/* Product Type Selector */}
          <div className="flex bg-brand-bg/30 p-1.5 rounded-2xl border border-brand-accent/20">
            <button
              type="button"
              onClick={() => setProductType('Fragrance')}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all",
                productType === 'Fragrance' ? "bg-brand-button text-white shadow-lg" : "text-brand-subtext hover:text-brand-text"
              )}
            >
              Fragrance
            </button>
            <button
              type="button"
              onClick={() => setProductType('Apparel')}
              className={cn(
                "flex-1 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all",
                productType === 'Apparel' ? "bg-brand-button text-white shadow-lg" : "text-brand-subtext hover:text-brand-text"
              )}
            >
              Apparel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">
                {productType === 'Fragrance' ? 'Scent Name' : 'Item Name'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                placeholder={productType === 'Fragrance' ? "e.g. Midnight Jasmine" : "e.g. Premium Cotton Tee"}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                placeholder="185"
              />
            </div>
          </div>

          {productType === 'Fragrance' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Floral">Floral</option>
                  <option value="Woody">Woody</option>
                  <option value="Citrus">Citrus</option>
                  <option value="Oriental">Oriental</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Olfactory Notes</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  placeholder="e.g. Jasmine, Ylang-Ylang (comma separated)"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={e => setFormData({ ...formData, material: e.target.value })}
                  className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                  placeholder="e.g. 100% Organic Cotton"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Available Sizes</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-[10px] font-bold transition-all border",
                        formData.selectedSizes.includes(size)
                          ? "bg-brand-button text-white border-brand-button shadow-sm"
                          : "bg-white text-brand-subtext border-brand-accent/20 hover:border-brand-accent"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Product Images (Max 4)</label>
              <button
                type="button"
                onClick={addImageEntry}
                disabled={imageEntries.length >= 4}
                className="flex items-center space-x-2 text-brand-accent hover:text-brand-text transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold">Add Image</span>
              </button>
            </div>

            <div className="space-y-4">
              {imageEntries.map((entry, index) => (
                <div key={entry.id} className="p-4 bg-brand-bg/20 rounded-2xl border border-brand-accent/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext">Image {index + 1} {index === 0 && '(Primary)'}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex bg-brand-bg/30 p-1 rounded-full">
                        <button
                          type="button"
                          onClick={() => updateImageEntry(entry.id, { method: 'url' })}
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all flex items-center space-x-2",
                            entry.method === 'url' ? "bg-brand-button text-white shadow-md" : "text-brand-subtext hover:text-brand-text"
                          )}
                        >
                          <LinkIcon size={10} />
                          <span>URL</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateImageEntry(entry.id, { method: 'file' })}
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all flex items-center space-x-2",
                            entry.method === 'file' ? "bg-brand-button text-white shadow-md" : "text-brand-subtext hover:text-brand-text"
                          )}
                        >
                          <ImageIcon size={10} />
                          <span>Upload</span>
                        </button>
                      </div>
                      {imageEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageEntry(entry.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {entry.method === 'url' ? (
                    <div className="relative">
                      <input
                        type="url"
                        value={entry.url}
                        onChange={e => updateImageEntry(entry.id, { url: e.target.value })}
                        className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none transition-all pl-10"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <Upload size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-subtext" />
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRefs.current[index]?.click()}
                      className="w-full aspect-video bg-brand-bg/30 border-2 border-dashed border-brand-accent/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-brand-bg/50 transition-all overflow-hidden group"
                    >
                      <input
                        type="file"
                        ref={el => fileInputRefs.current[index] = el}
                        onChange={e => handleFileChange(entry.id, e)}
                        accept="image/*"
                        className="hidden"
                      />
                      {entry.preview ? (
                        <div className="relative w-full h-full">
                          <img src={entry.preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Image</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <div className="w-8 h-8 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto text-brand-accent">
                            <Upload size={16} />
                          </div>
                          <p className="text-[10px] text-brand-subtext font-medium">Click to upload</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-brand-subtext">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-brand-bg/30 border border-brand-accent/20 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none transition-all resize-none"
              placeholder="Describe the olfactory journey..."
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-brand-bg/20 rounded-3xl">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-brand-text">Featured Product</h4>
              <p className="text-xs text-brand-subtext">Display this item on the homepage hero section.</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, featured: !formData.featured })}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                formData.featured ? "bg-brand-button" : "bg-brand-accent/40"
              )}
            >
              <motion.div
                animate={{ x: formData.featured ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-button text-white py-4 md:py-5 rounded-full text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-black transition-all shadow-lg flex items-center justify-center space-x-3"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check size={18} />
                <span>Add {productType === 'Fragrance' ? 'Scent' : 'Apparel'} to Catalog</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminAddScent;
