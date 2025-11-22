'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Package, X, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { api } from '@/services/api';

// --- Types ---
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  cost: number;
  description?: string;
  reorderLevel?: number;
}

export interface Warehouse { id: string; name: string; }
export interface StockItem { 
  productId: string;
  warehouseId: string; 
  warehouseName: string; 
  quantity: number; 
  reserved: number;
}

// --- Helper Components ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-xl shadow-2xl border-l-4 ${type === 'success' ? 'border-green-500 bg-[#2A1B12] text-green-400' : 'border-red-500 bg-[#2A1B12] text-red-400'} animate-in slide-in-from-right`}>
    <div className="ml-3 text-sm font-medium">{message}</div>
    <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-white rounded-lg p-1.5 inline-flex h-8 w-8"><X className="w-5 h-5" /></button>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockData, setStockData] = useState<Record<string, StockItem[]>>({});
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Electronics', 'Furniture', 'Office Supplies']);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', sku: '', category: '', unitOfMeasure: '', cost: '', description: '', reorderLevel: '' });
  const [stockForm, setStockForm] = useState({ quantity: 0, type: 'add' as 'add' | 'remove', warehouseId: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, stocksRes, warehousesRes] = await Promise.all([
        api.get<Product[]>('/products'),
        api.get<StockItem[]>('/stocks'),
        api.get<Warehouse[]>('/warehouses')
      ]);
      setProducts(productsRes);
      setWarehouses(warehousesRes);
      const stockMap: Record<string, StockItem[]> = {};
      stocksRes.forEach(item => {
        if (!stockMap[item.productId]) stockMap[item.productId] = [];
        stockMap[item.productId].push(item);
      });
      setStockData(stockMap);
    } catch (error) {
      showToast('Failed to load inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...productForm, cost: Number(productForm.cost), reorderLevel: Number(productForm.reorderLevel) };
      if (editingProduct) {
        const updated = await api.put<Product>(`/products/${editingProduct.id}`, payload);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        showToast('Product updated', 'success');
      } else {
        const created = await api.post<Product>('/products', payload);
        setProducts(prev => [...prev, created]);
        showToast('Product created', 'success');
      }
      setShowProductModal(false);
    } catch (error) {
      showToast('Failed to save product', 'error');
    }
  };

  const handleStockUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedProductForStock) return;
      try {
        const payload = {
            productId: selectedProductForStock.id,
            warehouseId: stockForm.warehouseId || warehouses[0]?.id,
            quantity: Number(stockForm.quantity),
            operation: stockForm.type
        };
        await api.post('/stocks/adjust', payload);
        loadData();
        showToast('Stock updated', 'success'); 
        setShowStockModal(false);
      } catch (error) {
        showToast('Failed to update stock', 'error');
      }
  };

  const openProductModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setProductForm({ name: product.name, sku: product.sku, category: product.category, unitOfMeasure: product.unitOfMeasure, cost: product.cost.toString(), description: product.description || '', reorderLevel: product.reorderLevel?.toString() || '' });
      } else {
          setEditingProduct(null);
          setProductForm({ name: '', sku: '', category: categories[0] || '', unitOfMeasure: '', cost: '', description: '', reorderLevel: '' });
      }
      setShowProductModal(true);
  };

  const openStockModal = (product: Product) => { 
      setSelectedProductForStock(product); 
      setStockForm({ quantity: 0, type: 'add', warehouseId: warehouses[0]?.id || '' }); 
      setShowStockModal(true); 
  };

  return (
    <div className="min-h-screen relative font-sans flex items-center justify-center p-4 sm:p-8 bg-[#2A1B12]"> {/* Lighter Background Outside */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {/* Main Container */}
        <div className="relative z-10 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-[#A15C48]/30 bg-[#2A1B12]">
             
             {/* Image Inside Box with HIGHER opacity */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 pointer-events-none"></div>
             
             {/* Content Overlay (LIGHTER) */}
             <div className="absolute inset-0 bg-[#2A1B12]/40 pointer-events-none"></div>

             <div className="relative z-20 flex flex-col h-full">
                 {/* Header */}
                 <div className="p-6 pb-4 border-b border-[#A15C48]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Stock</h1>
                        <p className="text-[#A15C48] mt-1 text-sm font-medium">Manage inventory & products</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 bg-[#2A1B12]/50 border border-[#A15C48]/30 px-3 py-1.5 rounded-xl' : 'w-auto'}`}>
                            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-[#A15C48] hover:text-[#F7D6CF] rounded-lg transition-colors"><Search className="w-5 h-5" /></button>
                            {isSearchOpen && <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-[#F7D6CF] text-sm ml-2 w-full"/>}
                        </div>

                        <div className="relative">
                            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${activeFilter !== 'All' ? 'bg-[#A15C48] text-white' : 'hover:bg-[#A15C48]/10 text-[#A15C48]'}`}><Filter className="w-5 h-5" /></button>
                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-48 bg-[#2A1B12] border border-[#A15C48]/30 rounded-xl shadow-2xl overflow-hidden z-50">
                                        <div className="p-2 space-y-1">
                                            <button onClick={() => { setActiveFilter('All'); setIsFilterOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#A15C48]/10 text-[#F7D6CF]">All</button>
                                            {categories.map(cat => <button key={cat} onClick={() => { setActiveFilter(cat); setIsFilterOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#A15C48]/10 text-[#F7D6CF]">{cat}</button>)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <button onClick={() => openProductModal()} className="flex items-center gap-2 bg-[#A15C48] hover:bg-[#b56a53] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#A15C48]/20 transition-all ml-2">
                            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
                        </button>
                    </div>
                 </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#A15C48]/50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A15C48] mb-3"></div><p>Loading inventory...</p></div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-12 border border-[#A15C48]/10 border-dashed rounded-xl bg-[#2A1B12]/40"><p className="text-[#F7D6CF]/50">No products found.</p></div>
                    ) : (
                        <div className="w-full">
                            <div className="grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-bold text-[#A15C48] uppercase tracking-wider border-b border-[#A15C48]/20">
                                <div className="col-span-4">Product</div>
                                <div className="col-span-2 text-right">Cost</div>
                                <div className="col-span-2 text-center">On Hand</div>
                                <div className="col-span-2 text-center">Free</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            <div className="space-y-2 mt-2">
                                {filteredProducts.map((product) => {
                                    const stock = stockData[product.id] || [];
                                    const onHand = stock.reduce((sum, s) => sum + s.quantity, 0);
                                    const reserved = stock.reduce((sum, s) => sum + s.reserved, 0);
                                    const freeToUse = onHand - reserved;
                                    return (
                                        <div key={product.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl hover:bg-[#2A1B12]/40 transition-colors border-b border-[#A15C48]/10 last:border-0 bg-[#2A1B12]/20 backdrop-blur-sm">
                                            <div className="col-span-4"><div className="font-bold text-white text-lg">{product.name}</div><div className="text-xs text-[#F7D6CF]/50 font-mono">{product.sku}</div></div>
                                            <div className="col-span-2 text-right text-[#F7D6CF]">{product.cost} Rs</div>
                                            <div className="col-span-2 text-center font-bold text-white text-lg">{onHand}</div>
                                            <div className="col-span-2 text-center"><span className={`px-3 py-1 rounded-full text-sm font-bold ${freeToUse > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{freeToUse}</span></div>
                                            <div className="col-span-2 flex justify-end gap-2">
                                                <button onClick={() => openStockModal(product)} className="px-3 py-1.5 rounded-lg bg-[#A15C48]/10 text-[#A15C48] text-xs font-bold hover:bg-[#A15C48] hover:text-white transition-colors">Adjust</button>
                                                <button onClick={() => openProductModal(product)} className="p-2 text-[#F7D6CF]/50 hover:text-white"><Edit className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 text-center text-[#A15C48]/60 text-sm font-medium border-t border-[#A15C48]/20">User must be able to update the stock from here.</div>
             </div>
        </div>

        {/* Product Modal */}
        {showProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg bg-[#2A1B12] border border-[#A15C48]/30 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-6">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                        <form onSubmit={handleProductSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" />
                                <input required placeholder="SKU" value={productForm.sku} onChange={e => setProductForm({...productForm, sku: e.target.value})} className="bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" />
                                <input required type="number" placeholder="Cost (Rs)" value={productForm.cost} onChange={e => setProductForm({...productForm, cost: e.target.value})} className="bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" />
                                <input required placeholder="Unit (e.g. pcs)" value={productForm.unitOfMeasure} onChange={e => setProductForm({...productForm, unitOfMeasure: e.target.value})} className="bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 rounded-xl border border-[#A15C48]/30 text-[#F7D6CF]">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#A15C48] text-white font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {/* Stock Modal */}
        {showStockModal && selectedProductForStock && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="w-full max-w-sm bg-[#2A1B12] border border-[#A15C48]/30 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Update Stock</h3>
                        <p className="text-[#A15C48] text-sm mb-6">Adjusting inventory for <span className="text-white">{selectedProductForStock.name}</span></p>
                        <form onSubmit={handleStockUpdate} className="space-y-4">
                            <div className="flex gap-2 bg-[#2A1B12] p-1 rounded-xl border border-[#A15C48]/30">
                                <button type="button" onClick={() => setStockForm({...stockForm, type: 'add'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${stockForm.type === 'add' ? 'bg-[#A15C48] text-white' : 'text-[#F7D6CF]/50'}`}>Add (+)</button>
                                <button type="button" onClick={() => setStockForm({...stockForm, type: 'remove'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${stockForm.type === 'remove' ? 'bg-red-500/20 text-red-400' : 'text-[#F7D6CF]/50'}`}>Remove (-)</button>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#A15C48] uppercase tracking-wider">Warehouse</label>
                                <select value={stockForm.warehouseId} onChange={(e) => setStockForm({...stockForm, warehouseId: e.target.value})} className="w-full mt-2 bg-[#2A1B12] border border-[#A15C48]/30 rounded-xl px-4 py-2 text-white outline-none appearance-none">
                                    {warehouses.map(w => (<option key={w.id} value={w.id}>{w.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#A15C48] uppercase tracking-wider">Quantity</label>
                                <input autoFocus type="number" min="1" required value={stockForm.quantity || ''} onChange={e => setStockForm({...stockForm, quantity: Number(e.target.value)})} className="w-full mt-2 bg-[#2A1B12] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold focus:border-[#A15C48] outline-none" />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="button" onClick={() => setShowStockModal(false)} className="flex-1 py-3 rounded-xl border border-[#A15C48]/30 text-[#F7D6CF]">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-[#A15C48] text-white font-bold">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}