import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import Editor from './components/Editor.jsx'
import SummaryPanel from './components/SummaryPanel.jsx'

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between">
          <strong>Smart Notes Summarizer</strong>
          <span className="text-sm text-gray-500">React + Tailwind + FastAPI</span>
        </header>
        <main className="grid md:grid-cols-2 gap-4 p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <Editor />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <SummaryPanel />
          </div>
        </main>
      </div>
    </Provider>
  )
}
