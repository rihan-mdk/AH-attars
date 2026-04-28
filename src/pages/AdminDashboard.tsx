import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../ProductContext';
import { Package, TrendingUp, Users, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useOrders } from '../OrderContext';
import { useCurrency } from '../CurrencyContext';

const AdminDashboard = () => {
  const { products } = useProducts();
  const { orders } = useOrders();
  const { formatPrice } = useCurrency();

  // Calculate Real Stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalProfit = totalRevenue * 0.65; // Estimated 65% margin
  const totalOrders = orders.length;
  
  // Calculate unique customers
  const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

  // Process Sales Data for Graph (Last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    const dailyTotal = orders.filter(o => {
      const orderDate = o.createdAt?.toDate ? o.createdAt.toDate() : (o.date ? new Date(o.date) : new Date());
      return orderDate.toDateString() === d.toDateString();
    }).reduce((sum, o) => sum + o.total, 0);

    return { name: dateStr, sales: dailyTotal };
  });

  // Process Top Sellers
  const productSalesMap: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSalesMap[item.name] = (productSalesMap[item.name] || 0) + item.quantity;
    });
  });

  const topSellersData = Object.entries(productSalesMap)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const COLORS = ['#D8C7B0', '#AE9476', '#E8DCCB', '#F5EFE6', '#2C2C2C'];

  const stats = [
    { name: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { name: 'Estimated Profit', value: formatPrice(totalProfit), icon: TrendingUp, color: 'bg-blue-50 text-blue-600' },
    { name: 'Total Orders', value: totalOrders.toString(), icon: Package, color: 'bg-purple-50 text-purple-600' },
    { name: 'Customers', value: uniqueCustomers.toString(), icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="space-y-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] shadow-sm border border-brand-accent/10 space-y-4"
          >
            <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-subtext font-bold">{stat.name}</p>
              <h3 className="text-3xl font-serif text-brand-text">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-brand-accent/10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif text-brand-text">Sales Trends</h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">+15% vs last month</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8E9299' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#8E9299' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#AE9476" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#AE9476', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-brand-accent/10 space-y-8">
          <h3 className="text-2xl font-serif text-brand-text">Top-Selling Fragrances</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellersData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#151619', fontWeight: 500 }}
                  width={120}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="sales" radius={[0, 10, 10, 0]} barSize={30}>
                  {topSellersData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-brand-accent/10 space-y-8">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-serif text-brand-text">Recent Orders</h3>
          <Link to="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-brand-accent hover:underline">
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-accent/10 text-left">
                <th className="pb-4 text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Order #</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Customer</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Total</th>
                <th className="pb-4 text-[10px] uppercase tracking-widest text-brand-subtext font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-accent/5">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="py-4 font-serif text-brand-text">#{order.orderNumber}</td>
                  <td className="py-4 text-sm text-brand-text">{order.address?.name || 'Customer'}</td>
                  <td className="py-4 text-sm font-bold text-brand-text">{formatPrice(order.total)}</td>
                  <td className="py-4 text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Additions */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-brand-accent/10 space-y-8">
        <h3 className="text-2xl font-serif text-brand-text">Recent Additions</h3>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="flex flex-col space-y-4 p-4 rounded-3xl bg-brand-bg/20">
              <img src={product.image} alt={product.name} className="w-full h-32 rounded-2xl object-cover" />
              <div>
                <h4 className="text-sm font-bold text-brand-text">{product.name}</h4>
                <p className="text-[10px] text-brand-subtext uppercase tracking-widest">{product.category}</p>
                <p className="text-sm font-bold text-brand-text mt-1">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
