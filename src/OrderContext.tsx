import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './constants';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface Order {
  id: string;
  userId: string;
  orderNumber: number;
  date: string;
  createdAt: Timestamp;
  items: CartItem[];
  total: number;
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'Processing' | 'Shipped' | 'Delivered';
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'userId'>) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, profile } = useAuth();
  
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const ordersRef = collection(db, 'orders');
      // Fetch all orders and handle sorting client-side to avoid index requirements
      const unsubscribe = onSnapshot(ordersRef, (snapshot) => {
        let ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        
        // Filter for user if not admin
        if (!isAdmin) {
          ordersData = ordersData.filter(o => o.userId === user.uid);
        }

        // Always sort by date desc client-side for reliability
        ordersData.sort((a, b) => {
          const getTime = (obj: any) => {
            if (obj?.createdAt?.toDate) return obj.createdAt.toDate().getTime();
            if (obj?.date) return new Date(obj.date).getTime();
            return 0;
          };
          return getTime(b) - getTime(a);
        });

        setOrders(ordersData);
        setLoading(false);
      }, (error) => {
        console.error("Firestore Order Subscription Error:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Order Query Setup Error:", err);
      setLoading(false);
    }
  }, [user, isAdmin, profile]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'userId'>) => {
    if (!user) {
      console.error("Cannot add order: No user authenticated");
      throw new Error("Must be logged in to place order");
    }

    try {
      const ordersRef = collection(db, 'orders');
      const payload = {
        ...orderData,
        userId: user.uid,
        status: 'Processing',
        createdAt: serverTimestamp()
      };
      
      console.log("Attempting to add order to Firestore...", payload);
      await addDoc(ordersRef, payload);
      console.log("Order added successfully!");
    } catch (error) {
      console.error("Firestore AddOrder Error details:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      console.log(`Order ${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
