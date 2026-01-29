import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'notes',
  initialState: { items: [], currentText: '' },
  reducers: {
    setNotes: (s, a) => { s.items = a.payload },
    setCurrentText: (s, a) => { s.currentText = a.payload },
    addNote: (s, a) => { s.items.unshift(a.payload) },
    updateNote: (s, a) => {
      const idx = s.items.findIndex(n => n.id === a.payload.id)
      if (idx >= 0) s.items[idx] = a.payload
    },
    deleteNote: (s, a) => { s.items = s.items.filter(n => n.id !== a.payload) }
  }
})

export const actions = slice.actions
export default slice.reducer
