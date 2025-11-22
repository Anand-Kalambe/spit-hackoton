'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Package, AlertCircle, CheckCircle, Search, Filter, Layers, ArrowLeft, Box } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// --- Types ---
export interface Location {
    id: string;
    name: string;
    shortCode: string;
    warehouseId: string;
}

export interface ProductStock {
    productId: string;
    productName: string;
    quantity: number;
}

// --- Mock Data ---
const INITIAL_LOCATIONS: Location[] = [
    { id: '101', name: 'Zone A - Electronics', shortCode: 'ZA-ELE', warehouseId: '1' },
    { id: '102', name: 'Zone B - Furniture', shortCode: 'ZB-FUR', warehouseId: '1' },
    { id: '201', name: 'Cold Storage Room', shortCode: 'CS-RM1', warehouseId: '2' },
];

// Mock inventory per location
const MOCK_INVENTORY: Record<string, ProductStock[]> = {
    '101': [{ productId: 'p1', productName: 'Monitor 24"', quantity: 15 }, { productId: 'p2', productName: 'Wireless Mouse', quantity: 50 }],
    '102': [{ productId: 'p3', productName: 'Desk', quantity: 20 }, { productId: 'p4', productName: 'Ergonomic Chair', quantity: 10 }],
    '201': []
};

// --- Helper Components ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-xl shadow-2xl border-l-4 ${type === 'success' ? 'border-green-500 bg-[#1a100a] text-green-400' : 'border-red-500 bg-[#1a100a] text-red-400'} animate-in slide-in-from-right`}>
        <div className="ml-3 text-sm font-medium">{message}</div>
        <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-white rounded-lg p-1.5 inline-flex h-8 w-8"><X className="w-5 h-5" /></button>
    </div>
);

export default function LocationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const warehouseId = searchParams.get('warehouseId');

    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [locForm, setLocForm] = useState({ name: '', shortCode: '' });
    const [editingItem, setEditingItem] = useState<Location | null>(null);

    useEffect(() => {
        setTimeout(() => {
            // Filter locations for this warehouse
            const whLocations = INITIAL_LOCATIONS.filter(l => l.warehouseId === warehouseId);
            setLocations(whLocations);
            setLoading(false);
        }, 600);
    }, [warehouseId]);

    useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!warehouseId) return;

        if (editingItem) {
            setLocations(prev => prev.map(l => l.id === editingItem.id ? { ...l, ...locForm } : l));
            showToast('Location updated', 'success');
        } else {
            setLocations(prev => [...prev, { id: Math.random().toString(), warehouseId, ...locForm }]);
            showToast('Location created', 'success');
        }
        closeModal();
    };

    const openModal = (item?: Location) => {
        setEditingItem(item || null);
        if (item) {
            setLocForm({ name: item.name, shortCode: item.shortCode });
        } else {
            setLocForm({ name: '', shortCode: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingItem(null); };

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure?')) return;
        setLocations(prev => prev.filter(l => l.id !== id));
        showToast('Deleted successfully', 'success');
    };

    // If no warehouse ID is present (direct access), we could redirect or show empty
    if (!warehouseId && !loading) return <div className="min-h-screen bg-[#1a100a] flex items-center justify-center text-[#A15C48]">No Warehouse Selected</div>;

    return (
        <div className="min-h-screen relative font-sans flex items-center justify-center p-4 sm:p-8 bg-[#1a100a]">
            <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 pointer-events-none"></div>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-none"></div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="relative z-10 w-full max-w-6xl bg-[#2A1B12]/85 backdrop-blur-xl border border-[#A15C48]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">

                {/* Header */}
                <div className="p-6 pb-2 border-b border-[#A15C48]/20">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => router.back()} className="p-2 rounded-xl bg-[#A15C48]/10 text-[#A15C48] hover:bg-[#A15C48] hover:text-white transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold text-white tracking-tight">Locations</h1>
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#A15C48]/20 text-[#A15C48] border border-[#A15C48]/30">WH-{warehouseId}</span>
                            </div>
                            <p className="text-[#F7D6CF]/60 text-sm mt-1">Managing rooms and stock levels</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pb-2">
                        <h2 className="text-lg font-bold text-[#A15C48] flex items-center gap-2">
                            <Layers className="w-5 h-5" /> Zones & Rooms
                        </h2>
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#A15C48] hover:bg-[#b56a53] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#A15C48]/20 transition-all">
                            <Plus className="w-4 h-4" /> Add Location
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-[#A15C48]/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A15C48] mb-3"></div>
                            <p>Loading locations...</p>
                        </div>
                    ) : locations.length === 0 ? (
                        <div className="text-center py-12 border border-[#A15C48]/10 border-dashed rounded-xl"><p className="text-[#F7D6CF]/50">No locations found in this warehouse.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {locations.map((loc) => {
                                const inventory = MOCK_INVENTORY[loc.id] || [];
                                return (
                                    <div key={loc.id} className="group bg-[#A15C48]/5 hover:bg-[#A15C48]/10 border border-[#A15C48]/20 hover:border-[#A15C48]/40 rounded-2xl p-5 transition-all">
                                        {/* Location Header */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-[#F7D6CF]">{loc.name}</h3>
                                                <span className="text-xs font-mono text-[#A15C48]">{loc.shortCode}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => openModal(loc)} className="p-1.5 text-[#A15C48] hover:bg-[#A15C48]/10 rounded-lg"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(loc.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>

                                        {/* Inventory Section */}
                                        <div className="bg-[#1a100a]/40 rounded-xl p-3 border border-[#A15C48]/10">
                                            <h4 className="text-xs font-bold text-[#A15C48] uppercase mb-2 flex items-center gap-1">
                                                <Package className="w-3 h-3" /> Current Stock
                                            </h4>
                                            {inventory.length > 0 ? (
                                                <div className="space-y-2">
                                                    {inventory.map((item) => (
                                                        <div key={item.productId} className="flex justify-between items-center text-sm">
                                                            <span className="text-[#F7D6CF]">{item.productName}</span>
                                                            <span className="font-bold text-white">{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-[#F7D6CF]/30 italic">No products in this location</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-[#2A1B12] border border-[#A15C48]/30 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} Location</h3>
                            <button onClick={closeModal}><X className="text-[#A15C48] hover:text-white" /></button>
                        </div>
                        <form onSubmit={handleLocationSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-[#A15C48] uppercase tracking-wider">Location Name</label>
                                <input required value={locForm.name} onChange={e => setLocForm({...locForm, name: e.target.value})} className="w-full mt-1 bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none" placeholder="e.g. Shelf A"/>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-[#A15C48] uppercase tracking-wider">Short Code</label>
                                <input required value={locForm.shortCode} onChange={e => setLocForm({...locForm, shortCode: e.target.value})} className="w-full mt-1 bg-[#1a100a] border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none" placeholder="e.g. SH-A"/>
                            </div>
                            <button type="submit" className="w-full py-3.5 rounded-xl bg-[#A15C48] text-white font-bold mt-4 hover:bg-[#b56a53] transition-colors">Save Location</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}