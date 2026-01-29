import React from 'react'
import { Provider } from 'react-redux'
import store from './store'
import Editor from './components/Editor.jsx'
import Sidebar from './components/Sidebar.jsx'
import NotesPane from './components/NotesPane.jsx'
import RightPanel from './components/RightPanel.jsx'

export default function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen grid grid-cols-[80px_280px_1fr_340px]">
        <Sidebar />
        <NotesPane />
        <main className="bg-white border-x border-gray-200">
          <div className="px-6 py-4 border-b">
            <div className="text-xl font-semibold text-[#7B52AB]">Smart Notes</div>
            <div className="text-sm text-gray-500">OneNote-style layout</div>
          </div>
          <div className="p-4">
            <Editor />
          </div>
        </main>
        <RightPanel />
      </div>
    </Provider>
  )
}
