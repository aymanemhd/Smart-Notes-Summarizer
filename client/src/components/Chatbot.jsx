import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as chat } from '../slices/chatSlice'
import { chatMessage } from '../services/api'

export default function Chatbot() {
  const dispatch = useDispatch()
  const [input, setInput] = React.useState('')
  const messages = useSelector(s => s.chat.messages)
  const loading = useSelector(s => s.chat.loading)
  const notes = useSelector(s => s.notes.items)
  const [targetNoteId, setTargetNoteId] = React.useState(null)

  async function send() {
    const m = input.trim()
    if (!m) return
    setInput('')
    dispatch(chat.pushUser(m))
    dispatch(chat.setLoading(true))
    try {
      const data = await chatMessage(m, targetNoteId)
      dispatch(chat.pushAssistant(data.response))
    } catch (e) {
      dispatch(chat.pushAssistant('Error: ' + String(e).slice(0, 200)))
    }
  }

  return (
    <div>
      <h2 className="text-lg">Chatbot</h2>
      <div className="flex gap-2 my-2">
        <select className="border rounded px-2 py-1" value={targetNoteId || ''} onChange={e => setTargetNoteId(e.target.value ? Number(e.target.value) : null)}>
          <option value="">No note context</option>
          {notes.map(n => <option key={n.id} value={n.id}>Note #{n.id}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input className="border rounded px-2 py-1" type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask for recommendations..." />
        <button className="px-3 py-2 border rounded" onClick={send}>{loading ? '...' : 'Send'}</button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {messages.map((m, i) => <div key={i}>{`[${m.role}] ${m.text}`}</div>)}
      </div>
    </div>
  )
}
