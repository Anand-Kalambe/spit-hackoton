"use client"

import type React from "react"
import { cn } from "@/app/dashboard/lib/utils"
import { NavBar } from "@/app/dashboard/components/nav-bar"
import ScanLoader from "@/app/dashboard/components/scan-loader"
import { useState, useEffect } from "react"
import useSWR from "swr"
import { LayoutGrid } from "@/app/dashboard/components/ui/layout-grid"
import {
  Package,
  TrendingDown,
  FileText,
  Truck,
  ArrowRightLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  LayoutDashboard,
  Activity,
  History,
  Settings,
  Warehouse,
} from "lucide-react"

// Types
type Operation = {
  id: string
  type: "receipt" | "delivery" | "transfer" | "adjustment"
  status: "late" | "waiting" | "ready" | "done" | "scheduled"
  details: string
  date?: string
}

type Transfer = {
  id: number
  status: string
  from: {
    name: string
    code: string
    address: string
    isActive: boolean
    id: number
  }
  to: {
    name: string
    code: string
    address: string
    isActive: boolean
    id: number
  }
}

// Helper function for status icons
const getStatusIcon = (status: string) => {
  const s = (status || "").toLowerCase()
  switch (s) {
    case "late":
      return <AlertCircle className="h-4 w-4 text-destructive" />
    case "waiting":
      return <Clock className="h-4 w-4 text-yellow-500" />
    case "ready":
    case "done":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

// Helper components for card content
const CardHeader = ({
  title,
  icon,
  stats,
}: {
  title: string
  icon: React.ReactNode
  stats: { primary: string; secondary?: string; tertiary?: string }
}) => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 bg-primary rounded-lg text-primary-foreground shadow-lg shadow-primary/20">{icon}</div>
      <h2 className="text-2xl font-bold text-primary-foreground">{title}</h2>
    </div>
    <div className="space-y-2 mt-auto">
      <p className="text-3xl font-bold text-primary-foreground">{stats.primary}</p>
      {stats.secondary && <p className="text-lg text-muted-foreground font-medium">{stats.secondary}</p>}
      {stats.tertiary && <p className="text-sm text-primary font-semibold uppercase tracking-wide">{stats.tertiary}</p>}
    </div>
  </div>
)

const CardDetails = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="space-y-6 pt-2">
    <div className="flex items-center justify-between border-b border-border pb-4">
      <h2 className="text-3xl font-bold text-primary-foreground">{title}</h2>
    </div>
    <div className="mt-4">{children}</div>
  </div>
)

const OperationsList = ({ operations }: { operations: Operation[] }) => (
  <div className="grid gap-3">
    <h3 className="text-xl font-semibold text-primary-foreground mb-2">Operations Queue</h3>
    {operations.map((op) => {
      const s = (op.status || "").toLowerCase()
      return (
        <div
          key={op.id}
          className="group bg-secondary/30 hover:bg-secondary/50 p-4 rounded-lg border border-border hover:border-primary/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-background/50 border border-border">{getStatusIcon(op.status)}</div>
            <div>
              <p className="font-semibold text-primary-foreground">{op.details}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {op.id} • {op.date}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase",
              s === "late" && "bg-destructive text-destructive-foreground",
              s === "waiting" && "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50",
              s === "ready" && "bg-green-500/20 text-green-500 border border-green-500/50",
              s === "scheduled" && "bg-primary/20 text-primary",
            )}
          >
            {op.status}
          </span>
        </div>
      )
    })}
  </div>
)

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InventoryDashboard() {
  const [loading, setLoading] = useState(true)

  const { data: apiTransfers, error } = useSWR<Transfer[]>("http://localhost:8080/api/internal-transfer", fetcher)

  const transfers = apiTransfers || [
    {
      from: { name: "North Powerhouse" },
      to: { name: "North Hub" },
      status: "READY",
      id: 1,
    },
    {
      from: { name: "South Storage" },
      to: { name: "West Backup Warehouse" },
      status: "SCHEDULED",
      id: 2,
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 5000) // 5 seconds loader matching the animation duration

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <ScanLoader />
  }

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

  const cards = [
    {
      id: 1,
      className: "md:col-span-1",
      thumbnail: "/receipts.jpg",
      content: (
        <div className="content-wrapper h-full">
          <div className="summary-view h-full">
            <CardHeader
              title="Receipt"
              icon={<FileText className="h-6 w-6" />}
              stats={{
                primary: "4 to receive",
                secondary: "1 Late",
                tertiary: "6 operations",
              }}
            />
          </div>
          <div className="detail-view hidden">
            <CardDetails title="Receipt Operations">
              <div className="grid md:grid-cols-2 gap-6">
                <OperationsList
                  operations={[
                    {
                      id: "R001",
                      type: "receipt",
                      status: "late",
                      details: "Supplier A - Electronics",
                      date: "2025-11-20",
                    },
                    {
                      id: "R002",
                      type: "receipt",
                      status: "waiting",
                      details: "Supplier B - Office Supplies",
                      date: "2025-11-23",
                    },
                    {
                      id: "R003",
                      type: "receipt",
                      status: "ready",
                      details: "Supplier C - Raw Materials",
                      date: "2025-11-24",
                    },
                    {
                      id: "R004",
                      type: "receipt",
                      status: "scheduled",
                      details: "Supplier D - Packaging",
                      date: "2025-11-25",
                    },
                  ]}
                />
                <div className="bg-secondary/20 p-4 rounded-lg border border-border h-fit">
                  <h4 className="font-semibold text-primary-foreground mb-2">Status Guide</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" /> Late: Schedule date &lt; today
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" /> Waiting: Waiting for stocks
                    </li>
                  </ul>
                </div>
              </div>
            </CardDetails>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      className: "md:col-span-1",
      thumbnail: "/delivery-truck-loading.webp",
      content: (
        <div className="content-wrapper h-full">
          <div className="summary-view h-full">
            <CardHeader
              title="Delivery"
              icon={<Truck className="h-6 w-6" />}
              stats={{
                primary: "4 to Deliver",
                secondary: "1 Late, 2 waiting",
                tertiary: "6 operations",
              }}
            />
          </div>
          <div className="detail-view hidden">
            <CardDetails title="Delivery Operations">
              <OperationsList
                operations={[
                  { id: "D001", type: "delivery", status: "late", details: "Customer Order #1234", date: "2025-11-21" },
                  {
                    id: "D002",
                    type: "delivery",
                    status: "waiting",
                    details: "Customer Order #1235",
                    date: "2025-11-23",
                  },
                  {
                    id: "D003",
                    type: "delivery",
                    status: "waiting",
                    details: "Customer Order #1236",
                    date: "2025-11-23",
                  },
                ]}
              />
            </CardDetails>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      className: "md:col-span-1",
      thumbnail: "/internal_transfer.avif",
      content: (
        <div className="content-wrapper h-full">
          <div className="summary-view h-full">
            <CardHeader
              title="Internal Transfer"
              icon={<ArrowRightLeft className="h-6 w-6" />}
              stats={{
                primary: "Ready & Scheduled",
                secondary: `${transfers.length} transfers pending`,
              }}
            />
          </div>
          <div className="detail-view hidden">
            <CardDetails title="Internal Transfers">
              <div className="space-y-4">
                {transfers.map((transfer: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-secondary/30 p-6 rounded-lg border border-border flex flex-col md:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-6">
                      <div className="px-6 py-3 bg-background rounded-lg text-primary-foreground font-bold border border-border shadow-sm">
                        {transfer.from.name || transfer.from}
                      </div>
                      <ArrowRightLeft className="h-6 w-6 text-primary animate-pulse" />
                      <div className="px-6 py-3 bg-background rounded-lg text-primary-foreground font-bold border border-border shadow-sm">
                        {transfer.to.name || transfer.to}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-2",
                          transfer.status?.toUpperCase() === "READY"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-primary/20 text-primary",
                        )}
                      >
                        {transfer.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {transfer.status?.toUpperCase() === "READY" ? "Space available" : "Space to be made"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardDetails>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      className: "md:col-span-1",
      thumbnail: "/low_stock.avif",
      content: (
        <div className="content-wrapper h-full">
          <div className="summary-view h-full">
            <CardHeader
              title="Low Stock"
              icon={<TrendingDown className="h-6 w-6" />}
              stats={{
                primary: "3 items low",
                secondary: "Action required",
              }}
            />
          </div>
          <div className="detail-view hidden">
            <CardDetails title="Low Stock Alerts">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { item: "Tomatoes", quantity: "1kg left!!", status: "critical" },
                  { item: "Rice", quantity: "2kg left!!", status: "warning" },
                  { item: "Cheese", quantity: "1 cube left", status: "critical" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-destructive/10 p-6 rounded-xl border border-destructive/30 relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 h-24 w-24 bg-destructive/20 rounded-full blur-2xl" />
                    <AlertCircle className="h-8 w-8 text-destructive mb-4" />
                    <h3 className="text-xl font-bold text-primary-foreground mb-1">{item.item}</h3>
                    <p className="text-2xl font-bold text-destructive">{item.quantity}</p>
                    <p className="text-sm text-muted-foreground mt-2">Restock immediately</p>
                  </div>
                ))}
              </div>
            </CardDetails>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-clip">
      <NavBar items={navItems} className="sticky top-4 z-50" />

      <main className="max-w-7xl mx-auto px-4 md:px-10 space-y-8 mt-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-primary-foreground tracking-tight">Overview</h1>
            <p className="text-foreground/70 text-lg">Warehouse Activity Summary</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-border">
            <button className="px-4 py-2 bg-card rounded-md text-primary-foreground shadow-sm font-medium text-sm">
              Today
            </button>
            <button className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium text-sm">Week</button>
            <button className="px-4 py-2 text-foreground/70 hover:text-foreground font-medium text-sm">Month</button>
          </div>
        </div>

        {/* KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Products", value: "1,247", icon: Package, color: "text-primary" },
            { label: "Low Stock", value: "3", icon: TrendingDown, color: "text-destructive" },
            { label: "Receipts", value: "4", icon: FileText, color: "text-primary" },
            { label: "Deliveries", value: "4", icon: Truck, color: "text-primary" },
            { label: "Transfers", value: "2", icon: ArrowRightLeft, color: "text-primary" },
          ].map((kpi, idx) => (
            <div
              key={idx}
              className="bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-primary-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Interactive Grid */}
        <div className="py-4">
          <LayoutGrid cards={cards} />
        </div>
      </main>

      {/* CSS to handle View Switching in LayoutGrid */}
      <style jsx global>{`
        /* Updated selectors to work with the new modal structure */
        .expanded-card .summary-view {
          display: none;
        }
        .expanded-card .detail-view {
          display: block !important;
          /* Simplified animation since the modal itself fades in now */
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--primary);
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
