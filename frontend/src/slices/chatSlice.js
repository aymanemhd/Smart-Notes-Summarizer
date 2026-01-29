import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'chat',
  initialState: { messages: [], loading: false },
  reducers: {
    pushUser: (s, a) => { s.messages.push({ role: 'user', text: a.payload }) },
    pushAssistant: (s, a) => { s.messages.push({ role: 'assistant', text: a.payload }); s.loading = false },
    setLoading: (s, a) => { s.loading = a.payload }
  }
})

export const actions = slice.actions
export default slice.reducer
