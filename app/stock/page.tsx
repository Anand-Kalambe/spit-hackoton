'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, PackageIcon, Activity, X, CheckCircle, AlertCircle, Search, Filter, Settings, ArrowLeftRight, History, LayoutDashboard, Layers, ChevronDown, Warehouse } from 'lucide-react';
import { NavBar } from '../dashboard/components/nav-bar'; 


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
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    reserved: number;
}

// --- Mock Data ---
const MOCK_WAREHOUSES: Warehouse[] = [{ id: '1', name: 'Central Hub' }, { id: '2', name: 'West Coast Depot' }];
const MOCK_CATEGORIES = ['Electronics', 'Furniture', 'Office Supplies', 'Raw Materials'];

const MOCK_PRODUCTS: Product[] = [
    { id: '101', name: 'Desk', sku: 'FUR-001', category: 'Furniture', unitOfMeasure: 'pcs', cost: 3000, reorderLevel: 10, description: 'Office wooden desk' },
    { id: '102', name: 'Table', sku: 'FUR-002', category: 'Furniture', unitOfMeasure: 'pcs', cost: 3000, reorderLevel: 15, description: 'Meeting table' },
    { id: '103', name: 'Ergonomic Chair', sku: 'FUR-003', category: 'Furniture', unitOfMeasure: 'pcs', cost: 4500, reorderLevel: 5 },
    { id: '104', name: 'Monitor 24"', sku: 'ELE-009', category: 'Electronics', unitOfMeasure: 'pcs', cost: 12000, reorderLevel: 8 },
];

const MOCK_STOCK: Record<string, StockItem[]> = {
    '101': [{ warehouseId: '1', warehouseName: 'Central Hub', quantity: 50, reserved: 5 }],
    '102': [{ warehouseId: '1', warehouseName: 'Central Hub', quantity: 50, reserved: 0 }],
    '103': [{ warehouseId: '1', warehouseName: 'Central Hub', quantity: 20, reserved: 10 }],
    '104': [{ warehouseId: '1', warehouseName: 'Central Hub', quantity: 15, reserved: 2 }],
};

// --- Helper Components ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-xl shadow-2xl border-l-4 ${type === 'success' ? 'border-green-500 bg-[#1a100a] text-green-400' : 'border-red-500 bg-[#1a100a] text-red-400'} animate-in slide-in-from-right`}>
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${type === 'success' ? 'text-green-900 bg-green-400' : 'text-red-900 bg-red-400'} rounded-full`}>
            {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="ml-3 text-sm font-medium">{message}</div>
        <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-white rounded-lg p-1.5 inline-flex h-8 w-8"><X className="w-5 h-5" /></button>
    </div>
);

// --- Main Component ---
export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stockData, setStockData] = useState<Record<string, StockItem[]>>({});
    const [loading, setLoading] = useState(true);

    // UI States
    const [showProductModal, setShowProductModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Filter & Search States (New)
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Selection States
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);

    // Form Data
    const [productForm, setProductForm] = useState({ name: '', sku: '', category: '', unitOfMeasure: '', cost: '', description: '', reorderLevel: '' });
    const [stockForm, setStockForm] = useState({ quantity: 0, type: 'add' as 'add' | 'remove' });

    const navItems = [
        {
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        },
        {
        name: "Operations",
        url: "#",
        icon: Activity,
        },
        {
        name: "Stock",
        url: "/stock",
        icon: PackageIcon,
        },
        {
        name: "Move History",
        url: "/history",
        icon: History,
        },
        {
        name: "Warehouse",
        url: "/warehouse",
        icon: Warehouse,
        },
    ]

    useEffect(() => {
        const loadData = async () => {
            setTimeout(() => {
                setProducts(MOCK_PRODUCTS);
                setStockData(MOCK_STOCK);
                setLoading(false);
            }, 800);
        };
        loadData();
    }, []);

    useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    // --- Logic: Filtering ---
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || product.category === activeFilter;

        return matchesSearch && matchesFilter;
    });

    // --- Handlers ---

    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productForm, cost: Number(productForm.cost), reorderLevel: Number(productForm.reorderLevel) } : p));
            showToast('Product updated', 'success');
        } else {
            const newId = Math.random().toString();
            setProducts(prev => [...prev, { id: newId, ...productForm, cost: Number(productForm.cost), reorderLevel: Number(productForm.reorderLevel) }]);
            setStockData(prev => ({ ...prev, [newId]: [{ warehouseId: '1', warehouseName: 'Central Hub', quantity: 0, reserved: 0 }] }));
            showToast('Product created', 'success');
        }
        setShowProductModal(false);
    };

    const handleStockUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductForStock) return;

        setStockData(prev => {
            const currentItems = prev[selectedProductForStock.id] || [];
            const updatedItems = currentItems.length > 0 ? [...currentItems] : [{ warehouseId: '1', warehouseName: 'Central Hub', quantity: 0, reserved: 0 }];

            if (stockForm.type === 'add') {
                updatedItems[0].quantity += Number(stockForm.quantity);
            } else {
                updatedItems[0].quantity = Math.max(0, updatedItems[0].quantity - Number(stockForm.quantity));
            }

            return { ...prev, [selectedProductForStock.id]: updatedItems };
        });

        showToast('Stock updated successfully', 'success');
        setShowStockModal(false);
    };

    const openProductModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name, sku: product.sku, category: product.category, unitOfMeasure: product.unitOfMeasure,
                cost: product.cost.toString(), description: product.description || '', reorderLevel: product.reorderLevel?.toString() || ''
            });
        } else {
            setEditingProduct(null);
            setProductForm({ name: '', sku: '', category: MOCK_CATEGORIES[0], unitOfMeasure: '', cost: '', description: '', reorderLevel: '' });
        }
        setShowProductModal(true);
    };

    const openStockModal = (product: Product) => {
        setSelectedProductForStock(product);
        setStockForm({ quantity: 0, type: 'add' });
        setShowStockModal(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-clip">
            <NavBar items={navItems} className="sticky top-4 z-50" />
            <div className="min-h-screen relative font-sans flex items-center justify-center p-4 sm:p-8 bg-[#1a100a]">
                {/* Backgrounds */}
                <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 pointer-events-none"></div>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none"></div>

                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {/* Main Glass Container */}
                <div className="relative z-10 w-full max-w-6xl bg-[#2A1B12]/85 backdrop-blur-xl border border-[#A15C48]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">

                    {/* Header with Search & Filter */}
                    <div className="px-6 py-4 border-b border-[#A15C48]/20 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[#A15C48]">

                            {/* Search Bar */}
                            <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 sm:w-64 bg-[#1a100a]/50 border border-[#A15C48]/30 px-3 py-1.5 rounded-xl' : 'w-8'}`}>
                                <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:text-[#F7D6CF] transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search product..."
                                    className={`bg-transparent border-none outline-none text-[#F7D6CF] text-sm ml-2 w-full ${isSearchOpen ? 'block' : 'hidden'}`}
                                />
                                {isSearchOpen && searchQuery && (
                                    <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 text-[#F7D6CF]/50" /></button>
                                )}
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${activeFilter !== 'All' ? 'bg-[#A15C48] text-white' : 'hover:bg-[#A15C48]/10'}`}
                                >
                                    <Filter className="w-5 h-5" />
                                    {activeFilter !== 'All' && <span className="text-xs font-bold hidden sm:inline">{activeFilter}</span>}
                                </button>

                                {isFilterOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[#2A1B12] border border-[#A15C48]/30 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => { setActiveFilter('All'); setIsFilterOpen(false); }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeFilter === 'All' ? 'bg-[#A15C48]/20 text-[#A15C48]' : 'text-[#F7D6CF] hover:bg-[#A15C48]/10'}`}
                                            >
                                                All Categories
                                            </button>
                                            {MOCK_CATEGORIES.map(cat => (
                                                <button
                                                    key={cat}
                                                    onClick={() => { setActiveFilter(cat); setIsFilterOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeFilter === cat ? 'bg-[#A15C48]/20 text-[#A15C48]' : 'text-[#F7D6CF] hover:bg-[#A15C48]/10'}`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Overlay to close dropdown when clicking outside */}
                                {isFilterOpen && <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />}
                            </div>
                        </div>

                        {/* Add Product Button */}
                        <button onClick={() => openProductModal()} className="flex items-center gap-2 bg-[#A15C48] hover:bg-[#b56a53] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#A15C48]/20 transition-all">
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    </div>

                    {/* Page Title */}
                    <div className="p-6 pb-2">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Stock</h1>
                    </div>

                    {/* Table Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-[#A15C48]/50">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A15C48] mb-3"></div>
                                <p>Loading inventory...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-12 border border-[#A15C48]/10 border-dashed rounded-xl">
                                <p className="text-[#F7D6CF]/50">No products match your search.</p>
                                <button onClick={() => {setSearchQuery(''); setActiveFilter('All')}} className="mt-2 text-[#A15C48] hover:underline text-sm">Clear filters</button>
                            </div>
                        ) : (
                            <div className="w-full">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-bold text-[#A15C48] uppercase tracking-wider border-b border-[#A15C48]/20">
                                    <div className="col-span-4">Product</div>
                                    <div className="col-span-2 text-right">Per Unit Cost</div>
                                    <div className="col-span-2 text-center">On Hand</div>
                                    <div className="col-span-2 text-center">Free to Use</div>
                                    <div className="col-span-2 text-right">Actions</div>
                                </div>

                                {/* Table Rows */}
                                <div className="space-y-2 mt-2">
                                    {filteredProducts.map((product) => {
                                        const stock = stockData[product.id] || [];
                                        const onHand = stock.reduce((sum, s) => sum + s.quantity, 0);
                                        const reserved = stock.reduce((sum, s) => sum + s.reserved, 0);
                                        const freeToUse = onHand - reserved;

                                        return (
                                            <div key={product.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-xl hover:bg-[#A15C48]/5 transition-colors border-b border-[#A15C48]/10 last:border-0 animate-in fade-in slide-in-from-bottom-2">

                                                {/* Product Name */}
                                                <div className="col-span-4">
                                                    <div className="font-bold text-white text-lg">{product.name}</div>
                                                    <div className="text-xs text-[#F7D6CF]/50 font-mono">{product.sku}</div>
                                                </div>

                                                {/* Unit Cost */}
                                                <div className="col-span-2 text-right text-[#F7D6CF]">
                                                    {product.cost} Rs
                                                </div>

                                                {/* On Hand */}
                                                <div className="col-span-2 text-center font-bold text-white text-lg">
                                                    {onHand}
                                                </div>

                                                {/* Free To Use */}
                                                <div className="col-span-2 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-bold ${freeToUse > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {freeToUse}
                                                </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="col-span-2 flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openStockModal(product)}
                                                        className="px-3 py-1.5 rounded-lg bg-[#A15C48]/10 text-[#A15C48] text-xs font-bold hover:bg-[#A15C48] hover:text-white transition-colors"
                                                    >
                                                        Adjust
                                                    </button>
                                                    <button onClick={() => openProductModal(product)} className="p-2 text-[#F7D6CF]/50 hover:text-white"><Edit className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="p-4 text-center text-[#A15C48]/60 text-sm font-medium border-t border-[#A15C48]/20">

                    </div>
                </div>

                {/* --- Modals --- */}

                {/* 1. Product Modal (Create/Edit) */}
                {showProductModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-lg bg-[#2A1B12] border border-[#A15C48]/30 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
                            <h3 className="text-2xl font-bold text-white mb-6">{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input required placeholder="Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none" />
                                    <input required placeholder="SKU" value={productForm.sku} onChange={e => setProductForm({...productForm, sku: e.target.value})} className="bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none" />
                                    <input required type="number" placeholder="Cost (Rs)" value={productForm.cost} onChange={e => setProductForm({...productForm, cost: e.target.value})} className="bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none" />
                                    <input required placeholder="Unit (e.g. pcs)" value={productForm.unitOfMeasure} onChange={e => setProductForm({...productForm, unitOfMeasure: e.target.value})} className="bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none" />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setShowProductModal(false)} className="flex-1 py-3 rounded-xl border border-[#A15C48]/30 text-[#F7D6CF]">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#A15C48] text-white font-bold">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 2. Stock Adjustment Modal */}
                {showStockModal && selectedProductForStock && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-sm bg-[#2A1B12] border border-[#A15C48]/30 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
                            <h3 className="text-xl font-bold text-white mb-2">Update Stock</h3>
                            <p className="text-[#A15C48] text-sm mb-6">Adjusting inventory for <span className="text-white">{selectedProductForStock.name}</span></p>

                            <form onSubmit={handleStockUpdate} className="space-y-4">
                                <div className="flex gap-2 bg-[#1a100a] p-1 rounded-xl border border-[#A15C48]/30">
                                    <button type="button" onClick={() => setStockForm({...stockForm, type: 'add'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${stockForm.type === 'add' ? 'bg-[#A15C48] text-white' : 'text-[#F7D6CF]/50'}`}>Add (+)</button>
                                    <button type="button" onClick={() => setStockForm({...stockForm, type: 'remove'})} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${stockForm.type === 'remove' ? 'bg-red-500/20 text-red-400' : 'text-[#F7D6CF]/50'}`}>Remove (-)</button>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#A15C48] uppercase tracking-wider">Quantity</label>
                                    <input autoFocus type="number" min="1" required value={stockForm.quantity || ''} onChange={e => setStockForm({...stockForm, quantity: Number(e.target.value)})} className="w-full mt-2 bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold focus:border-[#A15C48] outline-none" />
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button type="button" onClick={() => setShowStockModal(false)} className="flex-1 py-3 rounded-xl border border-[#A15C48]/30 text-[#F7D6CF]">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 rounded-xl bg-[#A15C48] text-white font-bold">Confirm</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div> 
    );
}