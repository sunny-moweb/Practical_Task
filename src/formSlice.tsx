// making single reducer for all-----------------------------------
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

interface FormState {
    forms: formData[];
}

const initialState: FormState = {
    forms: [],
};

type FormActionPayload =
    | { type: 'add'; data: formData }
    | { type: 'edit'; index: number; data: formData }
    | { type: 'copy'; data: formData; Copied: true };

export const formSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        handleFormAction: (state, action: PayloadAction<FormActionPayload>) => {
            const { type } = action.payload;

            switch (type) {
                case 'add':
                    state.forms.push(action.payload.data);
                    break;

                case 'edit':
                    const editPayload = action.payload as { type: 'edit'; index: number; data: formData };
                    if (state.forms[editPayload.index]) {
                        state.forms[editPayload.index] = { ...editPayload.data };
                    }
                    break;

                case 'copy':
                    state.forms.push({ ...action.payload.data, Copied: true });
                    break;

                default:
                    break;
            }
        },

        deleteRow: (state, action: PayloadAction<number>) => {
            state.forms.splice(action.payload, 1);
        },

        clearData: (state) => {
            localStorage.clear();
            state.forms = [];
        },
    },
});

export const { handleFormAction, deleteRow, clearData } = formSlice.actions;
export default formSlice.reducer;
