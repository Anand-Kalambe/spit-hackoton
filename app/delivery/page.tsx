"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, List, Package, Truck, X, Pencil, Search, Sliders, Calendar, CornerDownRight, CheckCircle, Clock } from 'lucide-react';
import { NavBar } from "@/app/dashboard/components/nav-bar"
import {
  TrendingDown,
  FileText,
  ArrowRightLeft,
  AlertCircle,
  LayoutDashboard,
  Activity,
  History,
  Settings,
  Warehouse,
} from "lucide-react"

// --- MOCK DATA ---

  const navItems = [
    {
      name: "Dashboard",
      url: "/",
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
      icon: Package,
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


const MOCK_DELIVERIES = [
  { id: 1, reference: 'WH/OUT/0001', from: 'WH/Stock1', to: 'Customer A', contact: 'Azure Interior', scheduledDate: '2025-11-25', status: 'Ready' },
  { id: 2, reference: 'WH/OUT/0002', from: 'WH/Stock2', to: 'Customer B', contact: 'Balsa Wood Co.', scheduledDate: '2025-11-26', status: 'Waiting' },
  { id: 3, reference: 'WH/OUT/0003', from: 'Prod/Floor', to: 'Customer C', contact: 'Creative Designs', scheduledDate: '2025-11-27', status: 'Done' },
  { id: 4, reference: 'WH/OUT/0004', from: 'WH/Stock1', to: 'Customer D', contact: 'Delta Corp.', scheduledDate: '2025-11-28', status: 'Draft' },
];

const MOCK_DETAIL = {
  id: 1,
  reference: 'WH/OUT/0001',
  deliveryAddress: '123 Commerce St, New York',
  responsible: 'Jane Doe (Manager)',
  operationType: 'Delivery Order',
  scheduledDate: '2025-11-25',
  status: 'Ready',
  notes: 'Requires signature upon receipt.',
  products: [
    { productId: 'DESK001', name: 'Executive Desk', quantity: 6, available: true },
    { productId: 'CHAIR005', name: 'Ergonomic Chair', quantity: 12, available: true },
    { productId: 'LAMP002', name: 'LED Desk Lamp', quantity: 2, available: false }, // Simulate Low Stock
  ]
};

// --- UTILITY COMPONENTS ---

type StatusBadgeProps = {
  status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled';
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-full transition-all duration-300 shadow-inner";
  let colorClasses = "";

  switch (status) {
    case 'Draft':
      colorClasses = "bg-orange-600/50 text-orange-200 border border-orange-400/50 shadow-orange-900/40";
      break;
    case 'Waiting':
      colorClasses = "bg-yellow-600/50 text-yellow-200 border border-yellow-400/50 shadow-yellow-900/40";
      break;
    case 'Ready':
      colorClasses = "bg-green-600/50 text-green-200 border border-green-400/50 shadow-green-900/40";
      break;
    case 'Done':
      colorClasses = "bg-neutral-700/50 text-neutral-300 border border-neutral-500/50 shadow-neutral-900/40";
      break;
    default:
      colorClasses = "bg-gray-500/50 text-gray-300 border border-gray-400/50";
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {status}
    </div>
  );
};

type HeaderButtonProps = {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  primary?: boolean;
};

const HeaderButton = ({ icon: Icon, label, onClick, primary = false }: HeaderButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300
      ${primary
        ? 'bg-[var(--foreforeground)] text-[var(--background)] hover:bg-white shadow-md hover:shadow-lg'
        : 'bg-[var(--foreground)] text-[var(--foreforeground)] hover:bg-[var(--foreground)]/80 border border-[var(--foreforeground)]/30'
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

// --- VIEW 1: DELIVERY LIST ---
type DeliveryListProps = {
  onSelectOrder: (id: number) => void;
  onCreateNew: () => void;
};

const DeliveryList = ({ onSelectOrder, onCreateNew }: DeliveryListProps) => {
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDeliveries = deliveries.filter(d =>
    d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
<div className="min-h-screen bg-background text-foreground pb-20 overflow-x-clip">
  <NavBar items={navItems} className="sticky top-4 z-50" />
    <div className="p-6 h-full flex flex-col">
      {/* Header and Controls */}
      <div className="flex justify-between items-center mb-6 border-b border-[var(--foreforeground)]/20 pb-4">
        <h1 className="text-3xl font-bold text-[var(--foreforeground)] flex items-center space-x-3">
          <Truck className="w-8 h-8 text-[var(--foreforeground)]" />
          <span>Delivery Operations</span>
        </h1>
        <div className="flex space-x-4">
          <HeaderButton icon={Pencil} label="New" primary={true} onClick={onCreateNew} />
          <div className="relative text-gray-400 focus-within:text-[var(--foreforeground)]">
            <Search className="w-5 h-5 absolute ml-3 mt-2 pointer-events-none"/>
            <input
              type="text"
              placeholder="Search by Ref or Contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-[var(--background)]/80 text-[var(--foreforeground)] border border-[var(--foreforeground)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--foreforeground)]/50 transition duration-150"
            />
          </div>
          <HeaderButton icon={Sliders} label="Filters" onClick={() => alert('Filters coming soon!')} />
        </div>
      </div>

      {/* Delivery Table */}
      <div className="flex-grow overflow-auto rounded-xl shadow-inner shadow-[var(--background)]/50 border border-[var(--foreforeground)]/10">
        <table className="min-w-full divide-y divide-[var(--foreforeground)]/10">
          <thead className="sticky top-0 bg-[var(--background)]/90 backdrop-blur-sm z-10">
            <tr>
              {['Reference', 'From', 'To', 'Contact', 'Schedule Date', 'Status'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-[var(--foreforeground)]/70 uppercase tracking-wider">
                  {header}
                </th>
              ))}
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--foreforeground)]/5">
            {filteredDeliveries.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-[var(--foreground)]/30 transition duration-150 cursor-pointer"
                onClick={() => onSelectOrder(order.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--foreforeground)]/90">{order.reference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreforeground)]/70">{order.from}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreforeground)]/70">{order.to}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreforeground)]/70">{order.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreforeground)]/70 flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{order.scheduledDate}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status as 'Draft' | 'Waiting' | 'Ready' | 'Done'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ChevronRight className="w-5 h-5 text-[var(--foreforeground)]/50 hover:text-[var(--foreforeground)] transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
</div>
  );
};

// --- VIEW 2: DELIVERY DETAIL ---
type DeliveryDetailProps = {
  order: typeof MOCK_DETAIL;
  onBack: () => void;
  onStatusChange: (id: number, status: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled') => void;
};

const DeliveryDetail = ({ order, onBack, onStatusChange }: DeliveryDetailProps) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [deliveryData, setDeliveryData] = useState(order);

  // Status flow logic for the UI
  const getNextStatus = (current: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled') => {
    switch (current) {
      case 'Draft': return 'Waiting';
      case 'Waiting': return 'Ready';
      case 'Ready': return 'Done';
      default: return null;
    }
  };

  const handleValidate = () => {
    if (currentStatus === 'Ready') {
      onStatusChange(deliveryData.id, 'Done');
      setCurrentStatus('Done');
    }
  };

  const handleStatusClick = () => {
    const nextStatus = getNextStatus(currentStatus as 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled');
    if (nextStatus) {
      onStatusChange(deliveryData.id, nextStatus);
      setCurrentStatus(nextStatus);
    }
  };

  const statusPath: ('Draft' | 'Waiting' | 'Ready' | 'Done')[] = ['Draft', 'Waiting', 'Ready', 'Done'];
  const currentStepIndex = statusPath.indexOf(currentStatus as 'Draft' | 'Waiting' | 'Ready' | 'Done');

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header and Controls */}
      <div className="flex justify-between items-center mb-6 border-b border-[var(--foreforeground)]/20 pb-4">
        <div className="flex items-center space-x-2 cursor-pointer text-[var(--foreforeground)]/80 hover:text-[var(--foreforeground)] transition duration-150" onClick={onBack}>
          <ChevronRight className="w-5 h-5 rotate-180" />
          <h1 className="text-3xl font-bold">Delivery {deliveryData.reference}</h1>
        </div>
        <div className="flex space-x-3">
          {currentStatus === 'Ready' && (
            <HeaderButton icon={CheckCircle} label="Validate" primary={true} onClick={handleValidate} />
          )}
          {currentStatus !== 'Done' && (
             <HeaderButton icon={X} label="Cancel" onClick={() => onStatusChange(deliveryData.id, 'Canceled')} />
          )}
          {currentStatus !== 'Draft' && <HeaderButton icon={List} label="Print" onClick={() => alert('Printing...')} />}
        </div>
      </div>

      {/* Status Flow Visualization */}
      <div className="flex justify-start items-center space-x-1 mt-2 mb-8">
          {statusPath.map((status, index) => (
              <React.Fragment key={status}>
                  <div
                      className={`px-4 py-2 text-xs font-semibold rounded-full transition-all duration-300 flex items-center space-x-1
                          ${index <= currentStepIndex
                              ? 'bg-green-700 text-green-100 shadow-md'
                              : 'bg-[var(--foreground)]/50 text-[var(--foreforeground)]/50 shadow-inner'
                          }
                          ${index === currentStepIndex && currentStatus !== 'Done' ? 'animate-pulse ring-2 ring-green-500' : ''}
                          ${currentStatus !== 'Done' && index === currentStepIndex && index < statusPath.length - 1 ? 'cursor-pointer hover:scale-105' : ''}
                      `}
                      onClick={index === currentStepIndex && currentStatus !== 'Done' ? handleStatusClick : undefined}
                  >
                      {index <= currentStepIndex ? <CheckCircle className='w-4 h-4' /> : <Clock className='w-4 h-4' />}
                      <span>{status}</span>
                  </div>
                  {index < statusPath.length - 1 && (
                      <ChevronRight className={`w-4 h-4 ${index < currentStepIndex ? 'text-green-500' : 'text-[var(--foreforeground)]/30'}`} />
                  )}
              </React.Fragment>
          ))}
      </div>


      {/* Main Form Content (2-Column Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 space-y-4">
          {/* Header Fields */}
          <div className="bg-[var(--foreground)]/50 p-5 rounded-xl shadow-lg border border-[var(--foreforeground)]/10">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreforeground)] flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Delivery Information</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Delivery Address" value={deliveryData.deliveryAddress} />
              <InputField label="Scheduled Date" value={deliveryData.scheduledDate} />
              <InputField label="Responsible" value={deliveryData.responsible} />
              <InputField label="Operation Type" value={deliveryData.operationType} />
            </div>
            <div className="mt-4">
              <InputField label="Notes" value={deliveryData.notes} multiline={true} />
            </div>
          </div>
        </div>

        {/* Status Definitions Sidebar */}
        <div className="md:col-span-1 space-y-3 bg-[var(--foreground)]/50 p-5 rounded-xl shadow-lg border border-[var(--foreforeground)]/10">
            <h2 className="text-xl font-semibold mb-3 text-[var(--foreforeground)] flex items-center space-x-2">
                <CornerDownRight className="w-5 h-5" />
                <span>Status Definition</span>
            </h2>
            <StatusDefinition status="Draft" desc="Initial state; order is being prepared." isCurrent={currentStatus === 'Draft'} />
            <StatusDefinition status="Waiting" desc="Waiting for out of stock products to arrive." isCurrent={currentStatus === 'Waiting'} />
            <StatusDefinition status="Ready" desc="All products are available and ready to be picked/shipped." isCurrent={currentStatus === 'Ready'} />
            <StatusDefinition status="Done" desc="Products have been delivered and stock is reduced." isCurrent={currentStatus === 'Done'} />
        </div>
      </div>

      {/* Products Table */}
      <div className="flex-grow overflow-auto bg-[var(--foreground)]/50 p-5 rounded-xl shadow-lg border border-[var(--foreforeground)]/10">
        <h2 className="text-xl font-semibold mb-3 text-[var(--foreforeground)] flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Products to Deliver</span>
        </h2>
        <table className="min-w-full divide-y divide-[var(--foreforeground)]/10">
          <thead className="bg-[var(--background)]/80">
            <tr>
              {['Product Code', 'Product Name', 'Requested Quantity', 'Stock Status'].map(header => (
                <th key={header} className="px-4 py-2 text-left text-xs font-medium text-[var(--foreforeground)]/70 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--foreforeground)]/5">
            {deliveryData.products.map((product) => (
              <tr
                key={product.productId}
                className={!product.available ? 'bg-red-900/40 text-red-200' : 'text-[var(--foreforeground)]/90'}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{product.productId}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{product.name}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">{product.quantity}</td>
                <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold">
                  {!product.available
                    ? <span className="text-red-300 flex items-center space-x-1"><X className="w-4 h-4"/> Low Stock (Alert)</span>
                    : <span className="text-green-300">Available</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-[var(--foreforeground)]/70">
          <button className="text-sm font-medium text-[var(--foreforeground)] hover:text-white transition duration-150">
            + Add New Product
          </button>
        </div>
      </div>
    </div>
  );
};

type InputFieldProps = {
  label: string;
  value: string;
  multiline?: boolean;
};

const InputField = ({ label, value, multiline = false }: InputFieldProps) => (
    <div className="flex flex-col space-y-1">
        <label className="text-xs font-medium text-[var(--foreforeground)]/70">{label}</label>
        {multiline ? (
             <textarea
                value={value}
                rows={3}
                readOnly
                className="w-full px-3 py-2 text-sm bg-[var(--background)]/80 text-[var(--foreforeground)] rounded-lg border border-[var(--foreforeground)]/20 focus:outline-none resize-none"
             />
        ) : (
            <input
                type="text"
                value={value}
                readOnly
                className="w-full px-3 py-2 text-sm bg-[var(--background)]/80 text-[var(--foreforeground)] rounded-lg border border-[var(--foreforeground)]/20 focus:outline-none"
            />
        )}

    </div>
);

type StatusDefinitionProps = {
  status: string;
  desc: string;
  isCurrent: boolean;
};

const StatusDefinition = ({ status, desc, isCurrent }: StatusDefinitionProps) => (
    <div className={`flex items-start space-x-3 p-3 rounded-lg transition duration-200 ${isCurrent ? 'bg-[var(--background)]/80 shadow-md border-l-4 border-green-500' : 'bg-transparent'}`}>
        <span className={`font-semibold text-sm ${isCurrent ? 'text-green-400' : 'text-[var(--foreforeground)]'}`}>{status}:</span>
        <span className="text-sm text-[var(--foreforeground)]/80">{desc}</span>
    </div>
);

// --- MAIN APP COMPONENT ---

export default function DeliveryPage() {
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState(MOCK_DELIVERIES);

  // Function to handle moving to the detail view
  const handleSelectOrder = (id: number) => {
    setSelectedOrderId(id);
    setView('detail');
  };

  // Function to simulate status change (for the demo)
  const handleStatusChange = (id: number, newStatus: 'Draft' | 'Waiting' | 'Ready' | 'Done' | 'Canceled') => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    // You would integrate your Spring Boot PUT/PATCH endpoint here:
    // fetch(`/api/deliveries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
    alert(`Order ${MOCK_DETAIL.reference} status changed to ${newStatus}`);
  };

  const currentOrder = view === 'detail' 
    ? { 
        ...MOCK_DETAIL, 
        // Sync the status from the list state if it was changed
        status: orders.find(o => o.id === selectedOrderId)?.status || MOCK_DETAIL.status
      } 
    : null;

  // The outer container representing the full PC screen/window
  return (
    <div style={{ backgroundColor: 'var(--background)' }} className="min-h-screen p-8 flex justify-center items-center">
      {/* The inner container (the application window) */}
      <div 
        style={{ backgroundColor: 'var(--foreground)' }} 
        className="w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl p-0 overflow-hidden 
                   border border-[var(--foreforeground)]/30 backdrop-blur-sm"
      >
        {view === 'list' && (
          <DeliveryList 
            onSelectOrder={handleSelectOrder} 
            onCreateNew={() => alert('New delivery creation form triggered!')}
          />
        )}

        {view === 'detail' && currentOrder && (
          <DeliveryDetail 
            order={currentOrder} 
            onBack={() => setView('list')} 
            onStatusChange={handleStatusChange} 
          />
        )}

        {/* Fallback for safety */}
        {view === 'detail' && !currentOrder && (
            <div className="p-8 text-[var(--foreforeground)]">Error: Order not found.</div>
        )}
      </div>
    </div>
  );
}