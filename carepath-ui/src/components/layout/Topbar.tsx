'use client'

import { Bell, Menu } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-none">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1b9c86] rounded-full" />
      </button>
    </header>
  )
}
