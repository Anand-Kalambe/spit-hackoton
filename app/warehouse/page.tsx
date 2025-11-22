'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, MapPin, Search, Filter, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

// --- Types ---
export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address: string;
  isActive?: boolean;
}

// --- Helper Components ---
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div className={`fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-xl shadow-2xl border-l-4 ${type === 'success' ? 'border-green-500 bg-[#2A1B12] text-green-400' : 'border-red-500 bg-[#2A1B12] text-red-400'} animate-in slide-in-from-right`}>
    <div className="ml-3 text-sm font-medium">{message}</div>
    <button onClick={onClose} className="ml-auto -mx-1.5 -my-1.5 text-gray-400 hover:text-white rounded-lg p-1.5 inline-flex h-8 w-8"><X className="w-5 h-5" /></button>
  </div>
);

export default function WarehousePage() {
  const router = useRouter();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Warehouse | null>(null);
  const [whForm, setWhForm] = useState({ name: '', code: '', address: '', isActive: true });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await api.get<Warehouse[]>('/warehouses'); 
      setWarehouses(data);
    } catch (error) {
      console.error("Failed to fetch warehouses:", error);
      showToast('Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWarehouses(); }, []);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(null), 3000); return () => clearTimeout(timer); } }, [toast]);
  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const handleWarehouseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updated = await api.put<Warehouse>(`/warehouses/${editingItem.id}`, whForm);
        setWarehouses(prev => prev.map(w => w.id === editingItem.id ? updated : w));
        showToast('Warehouse updated', 'success');
      } else {
        const created = await api.post<Warehouse>('/warehouses', whForm);
        setWarehouses(prev => [...prev, created]);
        showToast('Warehouse created', 'success');
      }
      closeModal();
    } catch (error) {
      showToast('Failed to save warehouse', 'error');
    }
  };

  const openModal = (item?: Warehouse) => {
    setEditingItem(item || null);
    if (item) {
      setWhForm({ name: item.name, code: item.code, address: item.address, isActive: item.isActive !== undefined ? item.isActive : true });
    } else {
      setWhForm({ name: '', code: '', address: '', isActive: true });
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingItem(null); };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/warehouses/${id}`);
      setWarehouses(prev => prev.filter(w => w.id !== id));
      showToast('Deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleCardClick = (id: number) => {
    router.push(`/location?warehouseId=${id}`);
  };

  return (
    <div className="min-h-screen relative font-sans flex items-center justify-center p-4 sm:p-8 bg-[#2A1B12]"> {/* Lighter Background Outside */}
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Main Container (The "Box") */}
      <div className="relative z-10 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-[#A15C48]/30 bg-[#2A1B12]">
        
        {/* Image INSIDE the box with HIGHER opacity (more dark) */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 pointer-events-none"></div>
        
        {/* Content Overlay (LIGHTER to reveal image) */}
        <div className="absolute inset-0 bg-[#2A1B12]/40 pointer-events-none"></div>

        {/* Actual Content (z-index to sit above background) */}
        <div className="relative z-20 flex flex-col h-full">
            
            {/* Header */}
            <div className="p-6 pb-4 border-b border-[#A15C48]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Warehouses</h1>
                    <p className="text-[#A15C48] mt-1 text-sm font-medium">Select a warehouse to view locations</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 bg-[#2A1B12]/50 border border-[#A15C48]/30 px-3 py-1.5 rounded-xl' : 'w-auto'}`}>
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-[#A15C48] hover:text-[#F7D6CF] rounded-lg transition-colors"><Search className="w-5 h-5" /></button>
                        {isSearchOpen && <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="bg-transparent border-none outline-none text-[#F7D6CF] text-sm ml-2 w-full"/>}
                    </div>
                    <button className="p-2 text-[#A15C48] hover:bg-[#A15C48]/10 rounded-lg transition-colors"><Filter className="w-5 h-5" /></button>
                    <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#A15C48] hover:bg-[#b56a53] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-[#A15C48]/20 transition-all ml-2">
                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Warehouse</span>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#A15C48]/50">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A15C48] mb-3"></div>
                        <p>Loading warehouses...</p>
                    </div>
                ) : warehouses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#A15C48]/50 border border-dashed border-[#A15C48]/20 rounded-2xl m-4 bg-[#2A1B12]/40">
                        <p>No warehouses found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {warehouses.map((wh) => (
                            <div 
                                key={wh.id} 
                                onClick={() => handleCardClick(wh.id)}
                                className="group relative bg-[#2A1B12]/60 hover:bg-[#2A1B12]/80 border border-[#A15C48]/20 hover:border-[#A15C48]/40 rounded-2xl p-6 transition-all cursor-pointer flex items-center justify-between backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="h-12 w-12 rounded-xl bg-[#2A1B12] flex items-center justify-center border border-[#A15C48]/30 group-hover:border-[#A15C48] transition-colors shadow-lg">
                                        <Building2 className="w-6 h-6 text-[#F7D6CF]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#A15C48] transition-colors">{wh.name}</h3>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#A15C48]/20 text-[#A15C48] border border-[#A15C48]/30 uppercase">{wh.code}</span>
                                            {wh.isActive !== undefined && (
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${wh.isActive ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                                                    {wh.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-[#F7D6CF]/70">
                                            <MapPin className="w-3 h-3" />
                                            {wh.address}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); openModal(wh); }} className="p-2 text-[#A15C48] hover:bg-[#A15C48]/20 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                        <button onClick={(e) => handleDelete(e, wh.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        <ChevronRight className="w-5 h-5 text-[#F7D6CF]/30 group-hover:text-[#F7D6CF] group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-[#2A1B12] border border-[#A15C48]/30 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 relative overflow-hidden">
                {/* Modal Background Image with HIGHER opacity */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-white">{editingItem ? 'Edit' : 'Add'} Warehouse</h3>
                        <button onClick={closeModal}><X className="text-[#A15C48] hover:text-white" /></button>
                    </div>
                    <form onSubmit={handleWarehouseSubmit} className="space-y-4">
                        <input required value={whForm.name} onChange={e => setWhForm({...whForm, name: e.target.value})} className="w-full bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" placeholder="Name"/>
                        <input required value={whForm.code} onChange={e => setWhForm({...whForm, code: e.target.value})} className="w-full bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" placeholder="Code (e.g. WH-NY)"/>
                        <input required value={whForm.address} onChange={e => setWhForm({...whForm, address: e.target.value})} className="w-full bg-[#2A1B12]/80 border border-[#A15C48]/30 rounded-xl px-4 py-3 text-white focus:border-[#A15C48] outline-none placeholder-[#F7D6CF]/30" placeholder="Address"/>
                        
                        <div className="flex items-center gap-3 pt-2">
                            <label className="text-sm text-[#F7D6CF] font-bold">Is Active?</label>
                            <button type="button" onClick={() => setWhForm({...whForm, isActive: !whForm.isActive})} className={`w-12 h-6 rounded-full relative transition-colors ${whForm.isActive ? 'bg-green-500' : 'bg-gray-600'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${whForm.isActive ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <button type="submit" className="w-full py-3.5 rounded-xl bg-[#A15C48] text-white font-bold mt-4 hover:bg-[#b56a53] transition-colors">Save Warehouse</button>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}