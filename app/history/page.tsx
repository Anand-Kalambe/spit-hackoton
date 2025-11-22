"use client";
import Head from 'next/head';
import { useState, useMemo, use } from 'react'; // Keep these imports for search functionality

// Assuming your moveHistoryData is defined here or imported correctly
// For demonstration, using a simplified version:
const moveHistoryData = [
  { date: '10/04/2001', moveDate: '01/01/2001', moveType: 'Move Internal', vendorStockist: 'Vendor1', product: 'V1/Stock1', quantity: 10, status: 'Ready', isNew: true },
  { date: '09/04/2001', moveDate: '01/01/2001', moveType: 'Move External', vendorStockist: 'Vendor2', product: 'V2/Stock2', quantity: 5, status: 'Ready', isNew: false },
  { date: '08/04/2001', moveDate: '01/01/2001', moveType: 'Move Internal', vendorStockist: 'Vendor3', product: 'V3/Stock3', quantity: 20, status: 'Ready', isNew: false },
  { date: '07/04/2001', moveDate: '01/01/2001', moveType: 'Move External', vendorStockist: 'StockistA', product: 'P4/Item', quantity: 12, status: 'Ready', isNew: false },
];


// Helper component for the Status badge - Adjusted for dark theme
const StatusBadge = ({ status, isNew }: { status: string; isNew: boolean }) => {
  // Adjusted default for better contrast on dark background
  let colorClass = 'bg-gray-700 text-gray-200'; 
  if (isNew) {
    colorClass = 'bg-green-600 text-white'; // Slightly darker green for 'NEW' for better contrast
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}>
      {isNew ? 'NEW' : status}
    </span>
  );
};

const MoveHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return moveHistoryData;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();

    return moveHistoryData.filter(move => {
      return Object.values(move).some(value => 
        String(value).toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [searchTerm]);

  return (
    // Main background: dark desaturated brown from the image
    <div className="min-h-screen bg-[#352D2A] p-8 text-gray-100"> 
      <Head>
        <title>Move History - Dashboard</title>
      </Head>
      
      {/* --- Header Section --- */}
      <header className="mb-6">
        {/* Adjusted text color for dark background */}
        <h1 className="text-2xl font-semibold text-white">Move History</h1> 
      </header>
      
      {/* --- History Table Container (Simulating the UI in the image) --- */}
      {/* Card background: slightly lighter brown than the main background */}
      <div className="bg-[#4E433E] p-6 rounded-lg shadow-lg border border-[#5A4F4A]"> 
        
        {/* Title and Search Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-[#5A4F4A]">
          {/* Adjusted text color for dark background */}
          <h2 className="text-xl font-medium text-white">Move History</h2> 
          <input 
            type="text" 
            placeholder="Search all columns..." 
            // Adjusted input styling for dark theme
            className="border border-gray-600 bg-gray-700 text-white p-2 rounded text-sm w-64 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* --- Table Body --- */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-700"> {/* Adjusted divider color */}
            <thead className="bg-[#413936]"> {/* Darker background for table header */}
              <tr>
                {['Date', 'Move Date', 'Move Type', 'Vendor/Stockist', 'Product', 'Quantity', 'Status'].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    // Adjusted text color for dark header
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" 
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table body background matches the card, adjusted divider */}
            <tbody className="bg-[#4E433E] divide-y divide-gray-700"> 
              {filteredData.map((move, index) => (
                <tr 
                  key={index} 
                  // Adjusted text colors for better contrast on dark background
                  className={move.isNew ? 'text-green-400 font-medium' : 'text-red-400'} 
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{move.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{move.moveDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{move.moveType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{move.vendorStockist}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{move.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{move.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    <StatusBadge status={move.status} isNew={move.isNew} />
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400"> {/* Adjusted text color */}
                    No results found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* --- Footer/Page Indicator Placeholder --- */}
        <div className="mt-4 text-center text-sm text-gray-400"> {/* Adjusted text color */}
          * End of History List *
        </div>
      </div>
    </div>
  );
};

export default MoveHistory;