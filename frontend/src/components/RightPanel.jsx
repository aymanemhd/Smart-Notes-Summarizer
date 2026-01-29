import React from 'react'
import SummaryPanel from './SummaryPanel.jsx'
import Chatbot from './Chatbot.jsx'

export default function RightPanel() {
  const [tab, setTab] = React.useState('summary')
  return (
    <aside className="h-full border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
        <div className="flex gap-2">
          <button onClick={() => setTab('summary')} className={`px-3 py-1 rounded ${tab==='summary'?'bg-white border':'border'}`}>Summary</button>
          <button onClick={() => setTab('chat')} className={`px-3 py-1 rounded ${tab==='chat'?'bg-white border':'border'}`}>Chat</button>
        </div>
      </div>
      <div className="p-3 overflow-y-auto">
        {tab === 'summary' ? <SummaryPanel /> : <Chatbot />}
      </div>
    </aside>
  )
}
