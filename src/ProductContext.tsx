import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const isSeeding = React.useRef(false);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      // Use database data as the single source of truth.
      // Auto-patch legacy Unsplash URLs to new local premium assets
      const patchedProductsData = productsData.map(product => {
        if (product.image && typeof product.image === 'string' && product.image.includes('unsplash.com') && product.name) {
          const name = product.name.toLowerCase();
          if (name.includes('velvet rose')) return { ...product, image: '/images/velvet-rose.png' };
          if (name.includes('golden amber')) return { ...product, image: '/images/golden-amber.png' };
          if (name.includes('cedar mist')) return { ...product, image: '/images/cedar-mist.png' };
          if (name.includes('citrus bloom')) return { ...product, image: '/images/citrus-bloom.png' };
          if (name.includes('midnight jasmine')) return { ...product, image: '/images/midnight-jasmine.png' };
          if (name.includes('sandalwood soul')) return { ...product, image: '/images/sandalwood-soul.png' };
          if (name.includes('oceanic drift')) return { ...product, image: '/images/oceanic-drift.png' };
          if (name.includes('spiced saffron')) return { ...product, image: '/images/spiced-saffron.png' };
          if (name.includes('white musk')) return { ...product, image: '/images/white-musk.png' };
          if (name.includes('smoky vetiver')) return { ...product, image: '/images/smoky-vetiver.png' };
          if (name.includes('bergamot breeze')) return { ...product, image: '/images/bergamot-breeze.png' };
          if (name.includes('patchouli night')) return { ...product, image: '/images/patchouli-night.png' };
        }
        return product;
      });

      // Only fall back to INITIAL_PRODUCTS if the database is completely empty.
      const finalProducts = patchedProductsData.length > 0 ? [...patchedProductsData] : [...INITIAL_PRODUCTS];
      
      // Sort products: Featured first, then by name
      finalProducts.sort((a, b) => {
        const aFeatured = a.featured ? 1 : 0;
        const bFeatured = b.featured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return (a.name || '').localeCompare(b.name || '');
      });

      setProducts(finalProducts);
      setLoading(false);
      console.log(`Loaded ${finalProducts.length} products (${productsData.length} from DB)`);
      
      // If database is completely empty and user is admin, seed initial products
      if (!isSeeding.current && productsData.length === 0 && auth.currentUser?.email === 'ahattars812@gmail.com') {
        seedInitialProducts();
      }
    }, (error) => {
      console.error('Firestore snapshot error:', error);
      setProducts(INITIAL_PRODUCTS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const seedInitialProducts = async () => {
    // Only attempt to seed if the current user is the designated admin
    if (auth.currentUser?.email !== 'ahattars812@gmail.com' || isSeeding.current) {
      return;
    }

    isSeeding.current = true;
    try {
      const batch = writeBatch(db);
      for (const product of INITIAL_PRODUCTS) {
        const productRef = doc(db, 'products', product.id);
        batch.set(productRef, {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      await batch.commit();
    } catch (error) {
      console.error('Error seeding products:', error);
    } finally {
      isSeeding.current = false;
    }
  };

  const addProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedFields);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
