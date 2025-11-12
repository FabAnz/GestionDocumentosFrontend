import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    documents: [],
    documentCount: 0,
    loading: false,
    editingDocument: null,
    isSubmitting: false,
    activeFilter: 'Todo'
}

export const documentSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {
        setDocuments: (state, action) => {
            state.documents = [...action.payload].sort((a, b) => {
                const dateA = new Date(a.updatedAt || 0)
                const dateB = new Date(b.updatedAt || 0)
                return dateB - dateA // descendente (más reciente primero)
            })
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
        },
        deleteDocument: (state, action) => {
            const documentId = action.payload
            state.documents = state.documents.filter(
                doc => (doc.id !== documentId) && (doc._id !== documentId)
            )
            state.documentCount = state.documents.length
        },
        setActiveFilter: (state, action) => {
            state.activeFilter = action.payload
        }
    }
})
//TODO: Revisar el limite de documentos cuando este la bd limpia
export const {
    setDocuments,
    setDocumentCount,
    setLoading,
    addDocument,
    updateDocument,
    setEditingDocument,
    clearEditingDocument,
    setSubmitting,
    deleteDocument,
    setActiveFilter
} = documentSlice.actions

// Selector para obtener documentos filtrados por fecha
export const selectFilteredDocuments = (state) => {
    const { documents, activeFilter } = state.documents
    
    if (activeFilter === 'Todo') {
        return documents
    }
    
    const now = new Date()
    const filterDate = new Date()
    
    switch (activeFilter) {
        case 'Ultima Semana':
            filterDate.setDate(now.getDate() - 7)
            break
        case 'Ultimo Mes':
            filterDate.setMonth(now.getMonth() - 1)
            break
        default:
            return documents
    }
    
    return documents.filter(doc => {
        if (!doc.updatedAt) return false
        const docDate = new Date(doc.updatedAt)
        return docDate >= filterDate
    })
}

export default documentSlice.reducer

