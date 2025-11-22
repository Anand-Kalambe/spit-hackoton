"use client"
import { NavBar } from "@/app/dashboard/components/nav-bar"
import {
  LayoutDashboard,
  Activity,
  Package,
  History as HistoryIcon,
  Warehouse,
} from "lucide-react"

export default function History() {
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
      icon: HistoryIcon,
    },
    {
      name: "Warehouse",
      url: "/warehouse",
      icon: Warehouse,
    },
  ]
    return (
        <div className="flex min-h-screen items-center justify-center bg-background font-sans">
            
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-foreforeground sm:items-start">
                <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                    Welcome to the History Page!
                </h1>
            </main>
        </div>
    );
}