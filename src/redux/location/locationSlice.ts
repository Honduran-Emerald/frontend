import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LocationObject } from "expo-location";

interface LocationState {
    location: LocationObject | undefined
}

const initialState: LocationState = {
    location: undefined
}

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        setLocation: (state, action: PayloadAction<LocationObject>) => {
            state.location = action.payload
        },
        unsetLocation: (state) => {
            state.location = undefined
        }
    }
})

export const { setLocation, unsetLocation } = locationSlice.actions

export default locationSlice.reducer
