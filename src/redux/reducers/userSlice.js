import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        logout: (state) => {
            state.user = null
            state.loading = false
        },
        upgradeToPremium: (state, action) => {
            state.user.plan = action.payload
        }
    }
})
export const { setUser, setLoading, logout, upgradeToPremium } = userSlice.actions
export default userSlice.reducer
