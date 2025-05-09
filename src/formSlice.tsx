import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Parameter {
    kpi_parameter: string | number;
    total_score: string | number;
}

interface formData {
    ProductGroup: string;
    Parameters: Parameter[];
    ParameterField?: number;
    Copied?: boolean;
}

interface Formstate {
    forms: formData[];
}

const initialState: Formstate = {
    forms: [],
};

export const formSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        addFormData: (state, action: PayloadAction<formData>) => {
            state.forms.push(action.payload);
        },
        updateFormData: (state, action: PayloadAction<{ index: number; data: formData }>) => {
            const { index, data } = action.payload;
            if (state.forms[index]) {
                state.forms[index] = { ...state.forms[index], ...data };
            }
        },
        editFormData: (state, action) => {
            const { index, updatedData } = action.payload;
            state.forms[index] = updatedData;
        },
        copyFormData: (state, action: PayloadAction<formData>) => {
            state.forms.push(action.payload);
        },
        deleteRow: (state, action) => {
            state.forms.splice(action.payload, 1);
        },
        clearData: (state) => {
            localStorage.clear();
            state.forms = [];
        }
    }
});

export const { addFormData, updateFormData, copyFormData,editFormData, clearData, deleteRow } = formSlice.actions;
export default formSlice.reducer;
