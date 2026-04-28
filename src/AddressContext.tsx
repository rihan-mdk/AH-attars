import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('aura_addresses');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aura_addresses', JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (newAddress: Omit<Address, 'id'>) => {
    const addressWithId: Address = {
      ...newAddress,
      id: Math.random().toString(36).substr(2, 9),
      isDefault: addresses.length === 0 ? true : newAddress.isDefault,
    };
    
    if (addressWithId.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(addressWithId));
    } else {
      setAddresses(prev => [...prev, addressWithId]);
    }
  };

  const updateAddress = (id: string, updatedFields: Partial<Address>) => {
    setAddresses(prev => {
      let newAddresses = prev.map(a => a.id === id ? { ...a, ...updatedFields } : a);
      if (updatedFields.isDefault) {
        newAddresses = newAddresses.map(a => a.id === id ? a : { ...a, isDefault: false });
      }
      return newAddresses;
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  return (
    <AddressContext.Provider value={{ addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
};
