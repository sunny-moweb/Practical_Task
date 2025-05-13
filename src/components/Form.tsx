import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
// import { addFormData, editFormData } from '../formSlice';
import { handleFormAction } from '../formSlice';
import { ImCross } from "react-icons/im";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [mode, setMode] = useState<'add' | 'edit' | 'copy'>('add');
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [fields, setFields] = useState([{ kpi_parameter: '', total_score: '' }]);
    const [fieldErrors, setFieldErrors] = useState([{ kpi_parameter: '', total_score: '' }]);
    const [initialProductGroup, setInitialProductGroup] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    //* Detecting mode for: edit or copy or add
    useEffect(() => {
        const editData = localStorage.getItem('editFormData');
        const copyData = localStorage.getItem('savedData');

        if (editData) {
            const parsed = JSON.parse(editData);
            setInitialProductGroup(parsed.data.ProductGroup);
            setFields(parsed.data.Parameters);
            setEditIndex(parsed.index);
            setMode('edit');
            // setIsCopied(!!parsed.data?.Copied);
            // localStorage.removeItem('editFormData');
        } else if (copyData) {
            const parsed = JSON.parse(copyData);
            setInitialProductGroup(parsed.data.ProductGroup);
            setFields(parsed.data.Parameters);
            setEditIndex(parsed.index);
            setMode('copy');
            // localStorage.removeItem('savedData');
        }
    }, []);

    //* handling add-fields with constraints
    const handleAddField = () => {
        const emptyFields = fields.some(field => field.kpi_parameter.trim() === '' || field.total_score.trim() === '');
        if (emptyFields) {
            // alert("Please fill all fields before adding new ones.");
            toast.error("Please fill all fields before adding new ones.");
            return;
        }
        const totalScore = fields.reduce((sum, field) => sum + Number(field.total_score || 0), 0);
        if (totalScore >= 100) {
            // alert("cannot add fields");
            toast.warning("Cannot add new fields! ");
            return;
        }
        setFields([...fields, { kpi_parameter: "", total_score: "" }]);
        setFieldErrors([...fieldErrors, { kpi_parameter: '', total_score: '' }]);
    };

    const handleRemoveField = (index: number) => {
        const updatedFields = [...fields];
        const updatedErrors = [...fieldErrors];
        if (updatedFields.length > 1) {
            updatedFields.splice(index, 1);
            updatedErrors.splice(index, 1);
        } else {
            toast.error('cannot remove last field!');
        }
        setFields(updatedFields);
        setFieldErrors(updatedErrors);
    };

    //* onchange function for kpi and totalscore fields
    const handleFieldChange = (
        index: number,
        field: 'kpi_parameter' | 'total_score',
        value: string
    ) => {
        const updated = [...fields];
        updated[index][field] = value;
        setFields(updated);

        const errorUpdate = [...fieldErrors];
        errorUpdate[index][field] = '';
        setFieldErrors(errorUpdate);
    };

    //* handling validations and submission of data
    const formik = useFormik({
        initialValues: {
            product_group: initialProductGroup,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            product_group: Yup.string().required("please enter a value"),
        }),
        onSubmit: (values, { resetForm }) => {
            const newErrors = fields.map((field) => ({
                kpi_parameter: field.kpi_parameter.trim() === '' ? 'Required' : '',
                total_score: field.total_score.trim() === '' ? 'Required' : '',
            }));

            if (newErrors.some(err => err.kpi_parameter || err.total_score)) {
                setFieldErrors(newErrors);
                return;
            }

            const editData = localStorage.getItem('editFormData');
            console.log("Raw editData from localStorage:", editData);
            let Originalcopied = false;

            if (editData) {
                try {
                    const parsed = JSON.parse(editData);
                    console.log("Editing copied Data--------------:", parsed);
                    Originalcopied = !!parsed.data?.Copied;
                } catch (err) {
                    console.error("Error parsing edit data", err);
                }
            }

            const payload = {
                ProductGroup: values.product_group,
                Parameters: fields,
                ParameterField: fields.length,
                Copied: Originalcopied,
            };

            const action: FormActionPayload =
                mode === 'edit' && editIndex !== null
                    ? { type: 'edit', index: editIndex, data: { ...payload } }
                    : { type: mode, data: { ...payload } };

            dispatch(handleFormAction(action));
            console.log("Dispatching Action:", action);

            if (mode === 'edit') {
                toast.warning("Data updated successfully!");
            } else if (mode === 'copy') {
                toast.info("Copy of data created!");
            } else {
                toast.success("Data added successfully!");
            }

            resetForm();
            setFields([{ kpi_parameter: '', total_score: '' }]);
            setFieldErrors([{ kpi_parameter: '', total_score: '' }]);
            setInitialProductGroup('');
            navigate('/');
        },
    });

    return (
        <>
            <div className='form-container'>
                <h2 style={{ color: 'black' }}>{mode && `${mode.charAt(0).toUpperCase() + mode.slice(1)} Quality Check Setting`}</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                        <label>Product Group</label>
                        <input
                            type="text"
                            id="product_group"
                            name="product_group"
                            placeholder="Type here.."
                            onChange={(e) => {
                                formik.setFieldValue("product_group", e.target.value.trimStart());
                            }}
                            value={formik.values.product_group}
                            style={{ color:'#333',paddingRight: mode === 'edit' ? '60px' : '(copy)' }}
                        />
                        {/* {mode === "edit" && (
                            <span style={{color:'#333'}}>(copy)</span>        
                        )} */}
                        {formik.touched.product_group && formik.errors.product_group && (
                            <p style={{ color: 'red' }}>{formik.errors.product_group}</p>
                        )}
                    </div>

                    {fields.map((item, index) => (
                        <div key={index} className="parameter-box">
                            <div className="form-group">
                                <label>KPI/Parameter</label>
                                <input
                                    type="text"
                                    value={item.kpi_parameter}
                                    placeholder="Type here.."
                                    maxLength={20}
                                    onChange={(e) => handleFieldChange(index, 'kpi_parameter', e.target.value)}
                                // className={fieldErrors[index]?.kpi_parameter ? 'input-error' : ''}
                                />
                                {fieldErrors[index]?.kpi_parameter && (
                                    <p style={{ color: 'red' }}>{fieldErrors[index].kpi_parameter}</p>
                                )}
                            </div>

                            <div className="form-group score-input">
                                <label>Total Score</label>
                                <div className="score-wrapper">
                                    <input
                                        type="text"
                                        value={item.total_score}
                                        placeholder='0'
                                        maxLength={3}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value)) {
                                                handleFieldChange(index, 'total_score', value);
                                            }
                                        }}
                                        className={fieldErrors[index]?.total_score ? 'input-error' : ''}
                                    />
                                    <span>%</span>
                                </div>
                                {/* {fieldErrors[index]?.total_score && (
                                    <p style={{ color: 'red' }}>{fieldErrors[index].total_score}</p>
                                )} */}
                                {Number(fields[index].total_score) > 100 && (
                                    <p style={{ color: 'red' }}>Please enter value less than or equal to 100</p>
                                )}
                            </div>

                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => handleRemoveField(index)}
                                style={{ marginLeft: '10px', fontSize: '10px' }}
                            >
                                <ImCross />
                            </button><br /><br />
                        </div>
                    ))}

                    <div className="total-score">
                        Total Score:
                        <span style={{ color: fields.reduce((sum, field) => sum + Number(field.total_score || 0), 0) === 100 ? 'green' : '#ea1111' }}>
                            {fields.reduce((sum, field) => sum + Number(field.total_score || 0), 0)}
                        </span> %
                        <br /><br />

                        <button type="button" className='add-btn' onClick={handleAddField}>
                            <span style={{ color: 'blue' }}>+</span> Add KPI/Parameter</button>
                    </div>

                    <br /><br />

                    <div className="form-footer">
                        <button type="button"
                            className='cancel-btn'
                            onClick={() => navigate('/')}>
                            Cancel
                        </button>
                        <button type="submit"
                            className='submit-btn'
                            disabled={fields.reduce((sum, field) => sum + Number(field.total_score || 0), 0) !== 100}>
                            {mode === 'edit' ? 'Update' : 'Submit'}
                        </button>
                    </div>
                </form >
            </div >
        </>
    );
};

export default Form;