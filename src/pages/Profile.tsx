import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useOrders } from '../OrderContext';
import { useCurrency } from '../CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Package, MapPin, ChevronRight, LogOut, Edit2, Save, X, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile, updateEmail, updatePassword, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const Profile = () => {
  const { user, profile } = useAuth();
  const { orders } = useOrders();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  
  const getTier = (spent: number) => {
    if (spent > 5000) return { name: 'Gold Member', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (spent > 2000) return { name: 'Silver Member', color: 'text-gray-600', bg: 'bg-gray-50' };
    return { name: 'Bronze Member', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const tier = getTier(totalSpent);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Update Display Name if changed
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
        // Update Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { displayName: formData.displayName });
      }

      // 2. Update Email if changed
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { email: formData.email });
      }

      // 3. Update Password if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        await updatePassword(user, formData.password);
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Update error:", err);
      if (err.code === 'auth/requires-recent-login') {
        setError("Security check: Please sign out and sign back in to update your email or password.");
      } else {
        setError(err.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-20 space-y-12">
      <div className="flex justify-between items-center">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-brand-subtext hover:text-brand-text transition-colors group"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-brand-accent/10 transition-colors">
            <ChevronRight className="rotate-180" size={18} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Gallery</span>
        </Link>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest ${
            isEditing 
            ? 'bg-brand-text text-white hover:bg-brand-text/90' 
            : 'bg-white text-brand-text border border-brand-accent/20 hover:bg-brand-bg shadow-sm'
          }`}
        >
          {isEditing ? (
            <><X size={14} /> <span>Cancel</span></>
          ) : (
            <><Edit2 size={14} /> <span>Edit Profile</span></>
          )}
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-[40px] bg-brand-accent/20 flex items-center justify-center text-4xl font-serif text-brand-text border-2 border-white shadow-xl overflow-hidden">
            {formData.displayName?.charAt(0) || user?.displayName?.charAt(0) || 'A'}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-brand-button text-white p-2 rounded-2xl shadow-lg">
            <User size={18} />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row items-center md:items-baseline md:space-x-4">
            <h1 className="text-4xl font-serif text-brand-text">{user?.displayName || 'AH Guest'}</h1>
            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${tier.bg} ${tier.color}`}>
              {profile?.role === 'admin' ? 'Administrator' : tier.name}
            </span>
          </div>
          <p className="text-brand-subtext flex items-center justify-center md:justify-start space-x-2">
            <Mail size={14} />
            <span>{user?.email}</span>
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-3xl flex items-center space-x-3"
          >
            <CheckCircle2 size={18} />
            <span className="text-sm font-medium">{success}</span>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-3xl flex items-center space-x-3"
          >
            <X size={18} />
            <span className="text-sm font-medium">{error}</span>
          </motion.div>
        )}

        {isEditing ? (
          <motion.form
            key="edit-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleUpdateProfile}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-brand-accent/10 space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-brand-text">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Display Name</label>
                  <input
                    type="text"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-accent/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-button/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-brand-bg/50 border border-brand-accent/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-button/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-2xl font-serif text-brand-text">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">New Password (Leave blank to keep current)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-accent/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-button/20 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-subtext hover:text-brand-text transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-brand-bg/50 border border-brand-accent/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-button/20 transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-subtext hover:text-brand-text transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-button text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-button/90 transition-all shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <><Save size={16} /> <span>Save Changes</span></>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="display-details"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Account Details */}
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-brand-accent/10 space-y-8">
              <h3 className="text-xl font-serif text-brand-text">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Display Name</p>
                  <p className="text-lg text-brand-text">{user?.displayName || 'AH Customer'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Email Address</p>
                  <p className="text-lg text-brand-text">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-brand-text">Account Settings</h3>
                <div className="bg-white rounded-[32px] border border-brand-accent/10 shadow-sm overflow-hidden divide-y divide-brand-accent/5">
                  <Link to="/orders" className="flex items-center justify-between p-6 hover:bg-brand-bg transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-brand-bg p-3 rounded-2xl group-hover:bg-white transition-colors">
                        <Package size={20} className="text-brand-accent" />
                      </div>
                      <span className="font-bold text-brand-text">My Orders</span>
                    </div>
                    <ChevronRight size={18} className="text-brand-subtext" />
                  </Link>
                  <Link to="/addresses" className="flex items-center justify-between p-6 hover:bg-brand-bg transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-brand-bg p-3 rounded-2xl group-hover:bg-white transition-colors">
                        <MapPin size={20} className="text-brand-accent" />
                      </div>
                      <span className="font-bold text-brand-text">Manage Addresses</span>
                    </div>
                    <ChevronRight size={18} className="text-brand-subtext" />
                  </Link>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif text-brand-text">Security</h3>
                <div className="bg-white rounded-[32px] border border-brand-accent/10 shadow-sm overflow-hidden divide-y divide-brand-accent/5">
                  <button 
                    onClick={async () => {
                      await signOut(auth);
                      navigate('/');
                    }}
                    className="w-full flex items-center justify-between p-6 hover:bg-red-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-red-100 p-3 rounded-2xl group-hover:bg-white transition-colors">
                        <LogOut size={20} className="text-red-600" />
                      </div>
                      <span className="font-bold text-red-600">Sign Out</span>
                    </div>
                    <ChevronRight size={18} className="text-red-300" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
