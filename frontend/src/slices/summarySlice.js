import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'summary',
  initialState: { summary: '', bullets: [], takeaways: [], loading: false },
  reducers: {
    setLoading: (s, a) => { s.loading = a.payload },
    setSummary: (s, a) => {
      s.summary = a.payload.summary
      s.bullets = a.payload.bullet_points
      s.takeaways = a.payload.key_takeaways
      s.loading = false
    },
    reset: (s) => { s.summary = ''; s.bullets = []; s.takeaways = []; s.loading = false }
  }
})

export const actions = slice.actions
export default slice.reducer
