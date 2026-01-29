const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
async function req(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
export const listNotes = () => req('/api/notes')
export const createNote = (content) => req('/api/notes', { method: 'POST', body: JSON.stringify({ content }) })
export const updateNote = (id, content) => req(`/api/notes/${id}`, { method: 'PUT', body: JSON.stringify({ content }) })
export const deleteNote = (id) => req(`/api/notes/${id}`, { method: 'DELETE' })
export const summarizeText = (content) => req('/api/summarize', { method: 'POST', body: JSON.stringify({ content }) })
export const chatMessage = (message, note_id) => req('/api/chat', { method: 'POST', body: JSON.stringify({ message, note_id }) })
