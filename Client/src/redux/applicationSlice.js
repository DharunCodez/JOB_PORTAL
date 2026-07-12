import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        allApplicants: [],
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.allApplicants = action.payload;
        },
        updateApplicantStatus: (state, action) => {
            const { id, status } = action.payload;
            if (state.allApplicants?.applications) {
                const app = state.allApplicants.applications.find(a => a._id === id);
                if (app) {
                    app.status = status.toLowerCase();
                }
            }
        },
    }
});



export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer
