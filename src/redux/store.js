import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/userSlice'
import documentReducer from './reducers/documentSlice'
import categoryReducer from './reducers/categorySlice'
import chatReducer from './reducers/chatSlice'
import categoryMessagesReducer from './reducers/categoryMessagesSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        documents: documentReducer,
        categories: categoryReducer,
        chat: chatReducer,
        categoryMessages: categoryMessagesReducer
    }
})

