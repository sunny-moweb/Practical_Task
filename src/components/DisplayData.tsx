import { FaPencilAlt, FaCopy } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import image from './no-data.jpg';
import { ImBin } from "react-icons/im";
import { toast } from 'react-toastify';
import { clearData, deleteRow } from '../formSlice';


const DisplayData = () => {
    const form = useSelector((state: RootState) => state.form.forms);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDeleteRow = (index: number) => {
        dispatch(deleteRow(index));
        toast.warning('Item Deleted!')
    };

    return (
        <div className="container">
            <div className="table-container">
                <div className="add-parameter-button">
                    <button
                        onClick={() => navigate('/add-parameter')}
                    >
                        Add Parameter
                    </button>
                </div>

                {form.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table>
                            <thead>
                                <tr>
                                    <th>Product Group</th>
                                    <th>Parameters</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {form.map((data, index) => (
                                    <tr key={index}>
                                        <td>
                                            {data.ProductGroup} {data.Copied && <span style={{ color: 'gray' }}>(Copy)</span>}
                                        </td>
                                        <td>{data.ParameterField}{data.Copied && <span style={{ color: 'gray' }}>(Copy)</span>}</td>
                                        <td className="actions">
                                            {/* <FaPencilAlt
                                                onClick={() => {
                                                    localStorage.setItem('editFormData', JSON.stringify({ data, index }));
                                                    navigate('/edit-parameter');
                                                }}
                                            />
                                            <FaCopy
                                                onClick={() => {
                                                    localStorage.setItem('savedData', JSON.stringify({ data, index }));
                                                    navigate('/copy-parameter');
                                                }}
                                            /> */}
                                            <FaPencilAlt
                                                onClick={() => {
                                                    // console.log("Editing data:", data);
                                                    console.log("Saving editFormData:", { data, index });
                                                    localStorage.setItem('editFormData', JSON.stringify({ data, index }));
                                                    console.log("After setItem:", localStorage.getItem('editFormData'));
                                                    navigate('/edit-parameter');
                                                }}
                                            />
                                            <FaCopy
                                                onClick={() => {
                                                    const copyData = { ...data, Copied: true };
                                                    localStorage.setItem('savedData', JSON.stringify({ data: copyData, index }));
                                                    navigate('/copy-parameter');
                                                }}
                                            />

                                            <ImBin
                                                style={{ color: 'red' }}
                                                onClick={() => handleDeleteRow(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div>
                            <button
                                onClick={() => {
                                    dispatch(clearData());
                                    toast.warning('All data deleted!');
                                }}
                                className="delete-button"
                            >
                                Delete All
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="no-data">
                        <img src={image} alt="No Data Available" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisplayData;