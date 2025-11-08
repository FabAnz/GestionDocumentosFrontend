import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    documents: [],
    documentCount: 0,
    loading: false
}

export const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setDocuments: (state, action) => {
            state.documents = action.payload
            state.loading = false
        },
        setDocumentCount: (state, action) => {
            state.documentCount = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        addDocument: (state, action) => {
            state.documents.push(action.payload)
            state.documentCount = state.documents.length
        }
    }
})

export const { setDocuments, setDocumentCount, setLoading, addDocument } = documentSlice.actions
export default documentSlice.reducer

