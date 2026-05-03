import React, { useState } from 'react';
import { useAddresses, Address } from '../AddressContext';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plus, Trash2, CheckCircle2, Edit3, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAddresses = () => {
  const { addresses, addAddress, deleteAddress, setDefaultAddress, updateAddress } = useAddresses();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAddress(editingId, formData);
      setEditingId(null);
    } else {
      addAddress(formData);
    }
    setFormData({ name: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
    setIsAdding(false);
  };

  const startEdit = (address: Address) => {
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
    setEditingId(address.id);
    setIsAdding(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-16 md:pt-20 pb-10 md:pb-20">
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors group mb-12"
      >
        <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-brand-accent/10 transition-colors">
          <ChevronRight className="rotate-180" size={18} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Gallery</span>
      </Link>
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-serif text-brand-text">My Addresses</h1>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ name: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
          }}
          className="flex items-center space-x-2 bg-brand-button text-white px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all"
        >
          <Plus size={18} />
          <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-8 rounded-[32px] border transition-all relative group ${
                address.isDefault 
                  ? 'bg-white border-brand-accent shadow-sm' 
                  : 'bg-brand-section/30 border-brand-accent/10 hover:border-brand-accent/30'
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-6 right-6 text-brand-accent flex items-center space-x-1">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Default</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-brand-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-brand-text">{address.name}</h3>
                    <p className="text-sm text-brand-subtext mt-1">{address.street}</p>
                    <p className="text-sm text-brand-subtext">{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(address.id)}
                      className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:text-brand-text transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(address)}
                    className="p-2 text-brand-subtext hover:text-brand-text transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => deleteAddress(address.id)}
                    className="p-2 text-brand-subtext hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsAdding(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl space-y-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-serif text-brand-text">
                  {editingId ? 'Edit Address' : 'New Address'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-brand-subtext hover:text-brand-text">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext ml-4">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-brand-section/50 border border-brand-accent/20 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext ml-4">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-brand-section/50 border border-brand-accent/20 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                      placeholder="e.g. 123 Luxury Lane"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext ml-4">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-brand-section/50 border border-brand-accent/20 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext ml-4">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-brand-section/50 border border-brand-accent/20 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-subtext ml-4">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-brand-section/50 border border-brand-accent/20 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-brand-accent outline-none transition-all"
                      placeholder="ZIP Code"
                    />
                  </div>
                  <div className="flex items-center space-x-3 ml-4">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-brand-accent text-brand-accent focus:ring-brand-accent"
                    />
                    <label htmlFor="isDefault" className="text-xs text-brand-subtext font-medium">Set as default address</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-button text-white py-5 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-all shadow-lg"
                >
                  {editingId ? 'Save Changes' : 'Add Address'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyAddresses;
