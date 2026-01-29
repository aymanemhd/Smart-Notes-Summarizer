import React from 'react'

export default function Sidebar() {
  return (
    <aside className="h-full bg-[#7B52AB] text-white flex flex-col items-center py-4 gap-4">
      <div className="text-lg font-semibold">SN</div>
      <nav className="flex flex-col items-center gap-3 text-xs">
        <button className="hover:bg-white/20 rounded px-3 py-2">Notebook</button>
        <button className="hover:bg-white/20 rounded px-3 py-2">Sections</button>
        <button className="hover:bg-white/20 rounded px-3 py-2">Pages</button>
      </nav>
    </aside>
  )
}
