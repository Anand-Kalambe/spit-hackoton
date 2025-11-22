"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/app/dashboard/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav
      className={cn(
        "fixed bottom-4 sm:top-6 left-0 right-0 mx-auto max-w-7xl flex items-center justify-center gap-3 bg-background/90 border border-border backdrop-blur-lg py-2 px-4 rounded-full shadow-lg z-50",
        className
      )}
    >
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.name

        return (
          <Link
            key={item.name}
            href={item.url}
            onClick={() => setActiveTab(item.name)}
            className={cn(
              "relative flex items-center gap-2 cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
              "text-primary-foreground/80 hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <Icon size={18} strokeWidth={2.5} />
            {/* Show label only on non-mobile */}
            {!isMobile && <span>{item.name}</span>}

            {isActive && (
              <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 w-full h-full bg-primary/10 rounded-full -z-10"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
