"use client"
import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/app/dashboard/lib/utils"
import { X } from "lucide-react"

type Card = {
  id: number
  content: React.ReactNode
  className: string
  thumbnail: string
}

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null)
  const [lastSelected, setLastSelected] = useState<Card | null>(null)

  const handleClick = (card: Card) => {
    setLastSelected(selected)
    setSelected(card)
  }

  const handleOutsideClick = () => {
    setLastSelected(selected)
    setSelected(null)
  }

  return (
    <div className="w-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className={cn(card.className, "relative h-80 md:h-96")}>
          <div
            onClick={() => handleClick(card)}
            className={cn(
              "relative overflow-hidden rounded-xl cursor-pointer transition-all h-full group bg-background border border-border hover:border-primary/50",
            )}
            style={{
              borderColor: "var(--border)",
            }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300 opacity-20 group-hover:opacity-30"
              style={{ backgroundImage: `url(${card.thumbnail})` }}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background/80 transition-opacity duration-300" />

            {/* Content - Only Summary View renders here because no .expanded-card class */}
            <div className="relative z-10 h-full p-6 flex flex-col">
              <div className="h-full">{card.content}</div>
            </div>
          </div>
        </div>
      ))}

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleOutsideClick}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-5xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleOutsideClick}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Background Image (Subtle) */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                style={{ backgroundImage: `url(${selected.thumbnail})` }}
              />

              {/* Content Wrapper - Adds .expanded-card class to trigger CSS switch */}
              <div className="relative z-10 p-6 md:p-10 overflow-auto custom-scrollbar expanded-card">
                {selected.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
