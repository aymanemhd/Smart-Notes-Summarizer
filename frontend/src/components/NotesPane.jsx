import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions as notes } from '../slices/notesSlice'
import { actions as summary } from '../slices/summarySlice'
import { listNotes, updateNote, deleteNote, summarizeText } from '../services/api'

function titleFrom(content) {
  const firstLine = (content || '').split('\n')[0].trim()
  return firstLine || 'Untitled'
}
function previewFrom(content) {
  const text = (content || '').replace(/\s+/g, ' ').trim()
  return text.length > 80 ? text.slice(0, 79) + '…' : text
}

export default function NotesPane() {
  const dispatch = useDispatch()
  const items = useSelector(s => s.notes.items)
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    listNotes().then(data => dispatch(notes.setNotes(data))).catch(() => {})
  }, [])

  const filtered = items.filter(n => {
    const t = (n.content || '').toLowerCase()
    const qq = q.toLowerCase()
    return !qq || t.includes(qq)
  })

  return (
    <aside className="h-full border-r border-gray-200">
      <div className="p-2">
        <input className="w-full px-2 py-1 border rounded" placeholder="Search notes" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="flex flex-col">
        {filtered.map(n => (
          <button key={n.id} className="text-left px-3 py-2 hover:bg-gray-50 border-b"
            onClick={() => { dispatch(notes.setCurrentText(n.content)) }}>
            <div className="font-medium">{titleFrom(n.content)}</div>
            <div className="text-xs text-gray-500">{previewFrom(n.content)}</div>
            <div className="flex gap-2 mt-2">
              <button className="text-xs px-2 py-1 border rounded"
                onClick={async (e) => {
                  e.stopPropagation()
                  const txt = prompt('Update note:', n.content)
                  if (txt == null) return
                  try {
                    const data = await updateNote(n.id, txt)
                    dispatch(notes.updateNote(data))
                  } catch (err) { alert(String(err).slice(0, 200)) }
                }}>Edit</button>
              <button className="text-xs px-2 py-1 border rounded"
                onClick={async (e) => {
                  e.stopPropagation()
                  if (!confirm('Delete this note?')) return
                  try {
                    await deleteNote(n.id)
                    dispatch(notes.deleteNote(n.id))
                  } catch (err) { alert(String(err).slice(0, 200)) }
                }}>Delete</button>
              <button className="text-xs px-2 py-1 border rounded"
                onClick={async (e) => {
                  e.stopPropagation()
                  try {
                    dispatch(summary.setLoading(true))
                    const data = await summarizeText(n.content)
                    dispatch(summary.setSummary(data))
                  } catch (err) { dispatch(summary.setLoading(false)); alert(String(err).slice(0, 200)) }
                }}>Summarize</button>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
