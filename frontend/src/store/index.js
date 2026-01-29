import { configureStore } from '@reduxjs/toolkit'
import notesReducer from '../slices/notesSlice'
import summaryReducer from '../slices/summarySlice'
import chatReducer from '../slices/chatSlice'

export default configureStore({
  reducer: {
    notes: notesReducer,
    summary: summaryReducer,
    chat: chatReducer
  }
})
