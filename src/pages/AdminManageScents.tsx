import React, { useState, useRef } from 'react';
import { useProducts } from '../ProductContext';
import { useCurrency } from '../CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Trash2, X, Check, AlertTriangle, Upload, Image as ImageIcon, Link as LinkIcon, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../constants';

const AdminManageScents = () => {
  const { products, deleteProduct, updateProduct } = useProducts();
  const { formatPrice } = useCurrency();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageEntries, setImageEntries] = useState<{
    id: string;
    url: string;
    file: File | null;
    preview: string | null;
    method: 'url' | 'file';
  }[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (file.size > 1024 * 1024) {
        setError('File size exceeds 1MB limit.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageEntries(prev => prev.map(entry => 
          entry.id === id ? { ...entry, file, preview: reader.result as string } : entry
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setError(null);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      notes: product.notes ? product.notes.join(', ') : '',
      material: product.material || '',
      selectedSizes: product.sizes || [],
      featured: !!product.featured,
    });
    
    // Initialize image entries from product.images or product.image
    const initialImages = product.images && product.images.length > 0 
      ? product.images.map((img, idx) => ({
          id: idx.toString(),
          url: img,
          file: null,
          preview: img,
          method: 'url' as const
        }))
      : [{
          id: '0',
          url: product.image,
          file: null,
          preview: product.image,
          method: 'url' as const
        }];
    
    setImageEntries(initialImages);
  };

  const addImageEntry = () => {
    if (imageEntries.length >= 4) {
      setError('Maximum 4 images allowed.');
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDelete = async () => {
    if (deletingId) {
      try {
        await deleteProduct(deletingId);
        setDeletingId(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-3 md:p-6 rounded-2xl md:rounded-[32px] shadow-sm border border-brand-accent/10 hover:shadow-xl transition-all duration-500 group flex flex-col h-full"
          >
            <div className="aspect-square overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-6 bg-brand-bg/50 p-2 md:p-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain md:object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-brand-accent/10" />
              )}
            </div>
            <div className="space-y-3 md:space-y-4 flex-grow flex flex-col">
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="text-sm md:text-lg font-serif text-brand-text line-clamp-1">{product.name}</h3>
                  {product.featured && (
                    <span className="bg-brand-button text-white text-[6px] md:text-[8px] px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-widest font-bold flex-shrink-0">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[10px] md:text-xs text-brand-subtext uppercase tracking-widest">{product.category}</p>
              </div>
              <p className="text-sm md:text-lg font-bold text-brand-text">{formatPrice(product.price)}</p>
              
              <div className="flex space-x-2 pt-1 md:pt-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-2 md:py-3 rounded-lg md:rounded-xl border border-brand-button text-brand-button text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-brand-button hover:text-white transition-all"
                >
                  <Edit2 size={12} className="md:w-3.5 md:h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingId(product.id)}
                  className="p-2 md:p-3 rounded-lg md:rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={12} className="md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-brand-text/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl space-y-6 md:space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-serif text-brand-text">Edit Product</h2>
                <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-brand-bg rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

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

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!editingProduct || !editFormData) return;
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
                        } else if (entry.preview) {
                          processedImages.push(entry.preview);
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

                    const updatedData: any = {
                      name: editFormData.name,
                      price: parseFloat(editFormData.price),
                      category: editFormData.category as any,
                      description: editFormData.description,
                      image: processedImages[0],
                      images: processedImages,
                      featured: editFormData.featured,
                    };

                    if (editFormData.category === 'Apparel') {
                      updatedData.material = editFormData.material;
                      updatedData.sizes = editFormData.selectedSizes;
                    } else {
                      updatedData.notes = editFormData.notes.split(',').map((n: string) => n.trim()).filter((n: string) => n !== '');
                    }

                    await updateProduct(editingProduct.id, updatedData);
                    setEditingProduct(null);
                    setEditFormData(null);
                  } catch (error: any) {
                    console.error('Error updating product:', error);
                    setError(error.message || 'Failed to update scent. Please try again.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
              >
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Product Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Price ($)</label>
                    <input
                      name="price"
                      type="number"
                      required
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Category</label>
                    <select
                      name="category"
                      disabled={editFormData.category === 'Apparel'}
                      value={editFormData.category}
                      onChange={handleEditInputChange}
                      className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none appearance-none disabled:opacity-50"
                    >
                      <option value="Floral">Floral</option>
                      <option value="Woody">Woody</option>
                      <option value="Citrus">Citrus</option>
                      <option value="Oriental">Oriental</option>
                      <option value="Apparel">Apparel</option>
                    </select>
                  </div>
                </div>

                {editFormData.category === 'Apparel' ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Material</label>
                      <input
                        name="material"
                        type="text"
                        value={editFormData.material}
                        onChange={handleEditInputChange}
                        className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Sizes</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'].map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              const newSizes = editFormData.selectedSizes.includes(size)
                                ? editFormData.selectedSizes.filter((s: string) => s !== size)
                                : [...editFormData.selectedSizes, size];
                              setEditFormData({ ...editFormData, selectedSizes: newSizes });
                            }}
                            className={cn(
                              "px-2 py-1 rounded text-[8px] font-bold transition-all border",
                              editFormData.selectedSizes.includes(size)
                                ? "bg-brand-button text-white border-brand-button"
                                : "bg-white text-brand-subtext border-brand-accent/20"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Olfactory Notes</label>
                    <input
                      name="notes"
                      type="text"
                      value={editFormData.notes}
                      onChange={handleEditInputChange}
                      className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none"
                      placeholder="e.g. Rose, Oud, Clove"
                    />
                  </div>
                )}

                {/* Image Input Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Product Images (Max 4)</label>
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
                            <div className="flex bg-brand-bg/50 p-1 rounded-xl border border-brand-accent/10">
                              <button
                                type="button"
                                onClick={() => updateImageEntry(entry.id, { method: 'url' })}
                                className={cn(
                                  "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                  entry.method === 'url' ? "bg-white text-brand-button shadow-sm" : "text-brand-subtext hover:text-brand-text"
                                )}
                              >
                                <LinkIcon size={12} />
                                <span>URL</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => updateImageEntry(entry.id, { method: 'file' })}
                                className={cn(
                                  "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                  entry.method === 'file' ? "bg-white text-brand-button shadow-sm" : "text-brand-subtext hover:text-brand-text"
                                )}
                              >
                                <ImageIcon size={12} />
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
                          <input
                            type="url"
                            value={entry.url}
                            onChange={e => updateImageEntry(entry.id, { url: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none"
                          />
                        ) : (
                          <div className="space-y-4">
                            <input
                              type="file"
                              ref={el => fileInputRefs.current[index] = el}
                              onChange={e => handleFileChange(entry.id, e)}
                              accept="image/*"
                              className="hidden"
                            />
                            <div 
                              onClick={() => fileInputRefs.current[index]?.click()}
                              className="w-full aspect-video bg-brand-bg/30 border-2 border-dashed border-brand-accent/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-accent/40 transition-all group overflow-hidden relative"
                            >
                              {entry.preview ? (
                                <>
                                  <img src={entry.preview} alt="Preview" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Image</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={20} className="text-brand-button" />
                                  </div>
                                  <p className="text-[10px] font-bold text-brand-text uppercase tracking-widest">Click to upload image</p>
                                  <p className="text-[8px] text-brand-subtext uppercase tracking-widest mt-1">PNG, JPG up to 1MB</p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-brand-subtext">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    className="w-full bg-brand-bg/30 border border-brand-accent/20 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-brand-accent outline-none resize-none"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-bg/20 rounded-2xl">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-brand-text">Featured Product</h4>
                    <p className="text-[10px] text-brand-subtext uppercase tracking-widest">Display on homepage</p>
                  </div>
                  <input
                    name="featured"
                    type="checkbox"
                    checked={editFormData.featured}
                    onChange={handleEditInputChange}
                    className="w-5 h-5 accent-brand-button"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-4 rounded-full border border-brand-button text-brand-button text-xs font-bold uppercase tracking-widest hover:bg-brand-bg transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-full bg-brand-button text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-brand-text/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-sm p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl text-center space-y-6 md:space-y-8"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-brand-text">Delete Product?</h3>
                <p className="text-brand-subtext text-sm">This action cannot be undone. Are you sure you want to remove this item from the catalog?</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleDelete}
                  className="w-full py-4 rounded-full bg-brand-button text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                >
                  Yes, Delete Product
                </button>
                <button
                  onClick={() => setDeletingId(null)}
                  className="w-full py-4 rounded-full border border-brand-accent text-brand-subtext text-xs font-bold uppercase tracking-widest hover:bg-brand-bg transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManageScents;
