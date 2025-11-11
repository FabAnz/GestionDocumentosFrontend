import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    categoryMessages: [],
    loading: false
}

export const categoryMessagesSlice = createSlice({
    name: 'categoryMessages',
    initialState,
    reducers: {
        setCategoryMessages: (state, action) => {
            state.categoryMessages = action.payload
        },
        addCategoryMessage: (state, action) => {
            const categoriaNombre = action.payload.categoria?.nombre
            if (!categoriaNombre) return

            const existingIndex = state.categoryMessages.findIndex(
                item => item.categoria?.nombre === categoriaNombre
            )
            if (existingIndex >= 0) {
                // Actualizar el contador si ya existe
                state.categoryMessages[existingIndex].contador = action.payload.contador
                state.categoryMessages[existingIndex].updatedAt = action.payload.updatedAt
            } else {
                // Agregar el objeto completo si no existe
                state.categoryMessages.push(action.payload)
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const {
    setCategoryMessages,
    addCategoryMessage,
    setLoading
} = categoryMessagesSlice.actions

export default categoryMessagesSlice.reducer

