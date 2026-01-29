import React from 'react'
import { useSelector } from 'react-redux'
import Chatbot from './Chatbot.jsx'

export default function SummaryPanel() {
  const s = useSelector(st => st.summary)
  return (
    <div>
      <h2 className="text-lg">Summary</h2>
      <div className="text-sm text-gray-500">{s.loading ? 'Summarizing...' : (s.summary || 'No summary yet')}</div>
      <h2 className="text-lg mt-3">Bullet Points</h2>
      <ul className="list-disc ml-6">
        {s.bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <h2 className="text-lg mt-3">Key Takeaways</h2>
      <ul className="list-disc ml-6">
        {s.takeaways.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <hr className="my-4" />
      <Chatbot />
    </div>
  )
}
