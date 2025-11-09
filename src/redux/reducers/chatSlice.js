import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messages: [],
    loading: false
}

// Mensaje de bienvenida inicial del asistente
const welcomeMessage = {
    id: 0,
    text: '¡Hola! Soy tu asistente de IA. Pregúntame sobre los documentos en tu base de conocimiento.',
    sender: 'assistant',
    timestamp: new Date().toISOString()
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        ...initialState,
        messages: [welcomeMessage] // Incluir mensaje de bienvenida por defecto
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const {
    addMessage,
    setMessages,
    setLoading
} = chatSlice.actions

export default chatSlice.reducer
