// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { useFormik } from 'formik';
// import * as Yup from 'yup'
// import { copyFormData } from '../formSlice';
// import { toast, ToastContainer } from 'react-toastify';
// import { ImCross } from 'react-icons/im';
// import { useNavigate } from 'react-router-dom';

// const CopyData = () => {
//     const dispatch = useDispatch();
//     const [formIndex, setFormIndex] = useState<number | null>(null);
//     const [fields, setFields] = useState([{ kpi_parameter: '', total_score: '' }]);
//     // Kpi and totalscore fields errors hanlding
//     const [fieldErrors, setFieldErrors] = useState<{ kpi_parameter: string; total_score: string }[]>(
//         [{ kpi_parameter: '', total_score: '' }]
//     );
//     const navigate = useNavigate()

//     const handleAddField = () => {
//         setFields([...fields, { kpi_parameter: "", total_score: "" }]);
//         setFieldErrors([...fieldErrors, { kpi_parameter: '', total_score: '' }]);
//     };

//     const handleRemoveField = (index: number) => {
//         const updatedFields = [...fields];
//         const updatedErrors = [...fieldErrors];
//         if (updatedFields.length > 1) {
//             updatedFields.splice(index, 1);
//             updatedErrors.splice(index, 1);
//         }
//         setFields(updatedFields);
//         setFieldErrors(updatedErrors);
//     };

//     const [initialValues, setInitialValues] = useState({
//         product_group: '',
//     });

//     useEffect(() => {
//         const formData = localStorage.getItem('savedData');

//         if (formData) {
//             const { data, index } = JSON.parse(formData);
//             setInitialValues({ product_group: data.ProductGroup });
//             setFields(data.Parameters);
//             setFormIndex(index);
//         }
//     }, []);

//     const formik = useFormik({
//         enableReinitialize: true,
//         initialValues,
//         validationSchema: Yup.object({
//             product_group: Yup.string().required('Required'),
//         }),
//         onSubmit: (values, { resetForm }) => {
//             const newErrors = fields.map((field) => ({
//                 kpi_parameter: field.kpi_parameter.trim() === '' ? 'Required' : '',
//                 total_score: field.total_score.trim() === '' ? 'Required' : '',
//             }));

//             if (newErrors.some(err => err.kpi_parameter || err.total_score)) {
//                 setFieldErrors(newErrors);
//                 return;
//             }
//             dispatch(
//                 copyFormData({
//                     ProductGroup: values.product_group,
//                     Parameters: fields,
//                     ParameterField: fields.length,
//                     Copied: true,
//                 })
//             );
//             resetForm();
//             toast.success("Copy of data created...");
//             setTimeout(() => {
//                 navigate('/');
//             }, 800);
//         },
//     });

//     return (
//         <>
//             <ToastContainer position="bottom-right" autoClose={1000} hideProgressBar />
//             <div className='form-container'>
//                 <h2 className='form-heading'>Copy Quality Check Settings</h2>
//                 <form onSubmit={formik.handleSubmit}>
//                     <div className='form-group'>
//                         <label htmlFor="productGroup">Product Group: </label>
//                         <input
//                             type="text"
//                             name="product_group"
//                             placeholder='Type here...'
//                             value={`${formik.values.product_group} (copy)`}
//                             onChange={formik.handleChange}
//                         />
//                         {formik.values.product_group && formik.errors.product_group && (
//                             <p style={{ color: 'red' }}>{formik.errors.product_group}</p>
//                         )}
//                     </div><br />

//                     {fields.map((item, index) => (
//                         <div key={index} className="parameter-box">
//                             <div className="form-group">
//                                 <label>KPI Parameter: </label>
//                                 <input
//                                     type="text"
//                                     placeholder='Type here...'
//                                     value={item.kpi_parameter}
//                                     onChange={(e) => {
//                                         const updated = [...fields];
//                                         updated[index].kpi_parameter = e.target.value;
//                                         setFields(updated);
//                                         const errorUpdate = [...fieldErrors];
//                                         errorUpdate[index].kpi_parameter = '';
//                                         setFieldErrors(errorUpdate);
//                                     }}
//                                 />
//                                 {fieldErrors[index]?.kpi_parameter && (
//                                     <p style={{ color: 'red' }}>{fieldErrors[index].kpi_parameter}</p>
//                                 )}
//                             </div>

//                             <div className="form-group score-input">
//                                 <label>Total Score: </label>
//                                 <div className="score-wrapper">
//                                     <input
//                                         type="text"
//                                         value={item.total_score}
//                                         placeholder='0'
//                                         maxLength={3}
//                                         onChange={(e) => {
//                                             const value = e.target.value;
//                                             if (/^\d*$/.test(value)) {
//                                                 const updated = [...fields];
//                                                 updated[index].total_score = value;
//                                                 setFields(updated);
//                                                 const errorUpdate = [...fieldErrors];
//                                                 errorUpdate[index].total_score = '';
//                                                 setFieldErrors(errorUpdate);
//                                             }
//                                         }}
//                                     />
//                                     <span style={{ color: 'gray', marginLeft: '4px' }}>%</span>
//                                 </div>
//                                 {fieldErrors[index]?.total_score && (
//                                     <p style={{ color: 'red' }}>{fieldErrors[index].total_score}</p>
//                                 )}
//                                 {Number(fields[index].total_score) > 100 && (
//                                     <p style={{ color: 'red' }}>Please enter a value less than or equal to 100</p>
//                                 )}
//                             </div>

//                             <button
//                                 type="button"
//                                 className="remove-btn"
//                                 onClick={() => handleRemoveField(index)}
//                                 style={{ marginLeft: '10px', fontSize: '10px' }}
//                             >
//                                 <ImCross className='cross' />
//                             </button><br /><br />
//                         </div>
//                     ))}

//                     <div className="total-score">
//                         Total Score: <span style={{ color: '#3bcd51', fontSize: '20px' }}>{fields.reduce((sum, field) => sum + Number(field.total_score || 0), 0)}</span>%
//                         <button type="button" className='add-btn' onClick={handleAddField}>+ Add KPI/Parameter</button>
//                     </div>

//                     <div className="form-footer">
//                         <button type="submit"
//                             className='cancel-btn'
//                             onClick={() => {
//                                 navigate('/')
//                             }}>
//                             Cancel
//                         </button>
//                         <button type="submit"
//                             className='submit-btn'
//                             disabled={fields.reduce((sum, field) => sum + Number(field.total_score || 0), 0) != 100}>
//                             Copy Data
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </>
//     );
// };

// export default CopyData;
