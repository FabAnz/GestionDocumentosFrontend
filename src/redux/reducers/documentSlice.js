import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    documents: [],
    documentCount: 0,
    loading: false,
    editingDocument: null,
    isSubmitting: false
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
        },
        updateDocument: (state, action) => {
            const updatedDocument = action.payload
            const documentId = updatedDocument.id || updatedDocument._id
            const index = state.documents.findIndex(
                doc => (doc.id === documentId) || (doc._id === documentId)
            )
            if (index !== -1) {
                state.documents[index] = updatedDocument
            }
        },
        setEditingDocument: (state, action) => {
            state.editingDocument = action.payload
        },
        clearEditingDocument: (state) => {
            state.editingDocument = null
        },
        setSubmitting: (state, action) => {
            state.isSubmitting = action.payload
        }
    }
})

export const {
    setDocuments,
    setDocumentCount,
    setLoading,
    addDocument,
    updateDocument,
    setEditingDocument,
    clearEditingDocument,
    setSubmitting
} = documentSlice.actions
export default documentSlice.reducer

