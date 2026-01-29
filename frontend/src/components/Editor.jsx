import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as notes } from '../slices/notesSlice'
import { actions as summary } from '../slices/summarySlice'
import { createNote, summarizeText } from '../services/api'

export default function Editor() {
  const dispatch = useDispatch()
  const text = useSelector(s => s.notes.currentText)
  const [error, setError] = React.useState('')
  const title = (text || '').split('\n')[0].trim() || 'Untitled'
  async function saveNote() {
    setError('')
    const t = text.trim()
    if (!t) return setError('Note cannot be empty')
    try {
      const data = await createNote(t)
      dispatch(notes.addNote(data))
      dispatch(notes.setCurrentText(''))
    } catch (e) { setError(String(e).slice(0, 200)) }
  }
  async function summarize() {
    setError('')
    const t = text.trim()
    if (!t) return setError('Enter text to summarize')
    try {
      dispatch(summary.setLoading(true))
      const data = await summarizeText(t)
      dispatch(summary.setSummary(data))
    } catch (e) {
      dispatch(summary.setLoading(false))
      setError(String(e).slice(0, 200))
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg">Page: <span className="font-semibold">{title}</span></h2>
        <div className="text-xs text-gray-500">{text.length} chars</div>
      </div>
      <textarea
        value={text}
        onChange={(e) => dispatch(notes.setCurrentText(e.target.value))}
        placeholder="Paste your long notes here"
        className="w-full min-h-[420px] p-3 border border-gray-300 rounded-lg outline-none"
      />
      <div className="flex gap-2 mt-2">
        <button onClick={saveNote} className="px-3 py-2 rounded bg-blue-600 text-white">Save Note</button>
        <button onClick={summarize} className="px-3 py-2 rounded border border-gray-300">Summarize</button>
      </div>
      {error && <div className="text-red-700 mt-2">{error}</div>}
      <NotesList />
    </div>
  )
}

function NotesList() {
  const dispatch = useDispatch()
  const notesState = useSelector(s => s.notes.items)
  React.useEffect(() => {
    import('../services/api').then(({ listNotes }) => listNotes().then(data => dispatch(notes.setNotes(data))).catch(() => {}))
  }, [])
  return (
    <div className="flex flex-col gap-2 mt-3">
      {notesState.map(n => (
        <div key={n.id} className="p-2 border border-gray-200 rounded flex items-center justify-between">
          <div>{n.content.length > 80 ? n.content.slice(0, 79) + '…' : n.content}</div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 border rounded"
              onClick={async () => {
                const txt = prompt('Update note:', n.content)
                if (txt == null) return
                try {
                  const data = await import('../services/api').then(({ updateNote }) => updateNote(n.id, txt))
                  dispatch(notes.updateNote(data))
                } catch (e) { alert(String(e).slice(0, 200)) }
              }}
            >Edit</button>
            <button
              className="px-2 py-1 border rounded"
              onClick={async () => {
                if (!confirm('Delete this note?')) return
                try {
                  await import('../services/api').then(({ deleteNote }) => deleteNote(n.id))
                  dispatch(notes.deleteNote(n.id))
                } catch (e) { alert(String(e).slice(0, 200)) }
              }}
            >Delete</button>
            <button
              className="px-2 py-1 border rounded"
              onClick={async () => {
                try {
                  dispatch(summary.setLoading(true))
                  const data = await import('../services/api').then(({ summarizeText }) => summarizeText(n.content))
                  dispatch(summary.setSummary(data))
                } catch (e) { dispatch(summary.setLoading(false)); alert(String(e).slice(0, 200)) }
              }}
            >Summarize</button>
          </div>
        </div>
      ))}
    </div>
  )
}
