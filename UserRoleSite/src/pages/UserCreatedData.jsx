import { memo, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AdminInfo, DeleteForm, EmployeeInfo, UpdateForm } from '../api/api';
import DataTableComponent from '../Components/DataTableComponent';
import GoBack from '../Components/GoBack';
import Loader from '../Components/Loader';
import { GlobalContext } from '../GlobalContext/GlobalContext';

const UserCreatedData = () => {
    const { user } = useContext(GlobalContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const [editForm, setEditForm] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});


    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };




    const initialState = {
        data: [],
        loading: false,
        error: null,
    };

    const [state, dispatch] = useReducer(datareducer, initialState);

    const fetchPageData = useCallback(async () => {
        if (!user?.username) return;

        dispatch({ type: "FETCH_START" });
        try {
            let response

            if (user.role === 'superadmin') {
                if (type === 'admin') {
                    response = await AdminInfo();
                } else if (type === 'employee') {
                    response = await EmployeeInfo();
                } else {
                    throw new Error('Invalid type');
                }
            } else {
                response = await EmployeeInfo();
            }

            dispatch({ type: 'FETCH_SUCCESS', payload: response });
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }
    }, [type, user?.username, user?.role]);


    const { data, loading, error } = state;


    useEffect(() => {
        if (user?.username) {
            fetchPageData();
        }
    }, [fetchPageData, user?.username]);



    const row = data?.map((item, index) => ({
        id: item.id,
        index:index + 1,
        username: item.username,
        email: item.email,
        password: item.password,
        role: item.role,
        createdsuperadminuser: item.createdsuperadminuser,
        createdadminuser: item.createdadminuser,
        isdisable: item.isdisable
    }))

    const column = [
        {
            name: 'ID',
            selector: row => row.index,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Name',
            selector: row => row.username,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email
        }, {
            name: 'Password',
            cell: row => (
                <div className="d-flex align-items-center">
                    <input
                        type={visiblePasswords[row.id] ? "text" : "password"}
                        value={row.password}
                        readOnly
                        className="form-control form-control-sm me-2"
                        style={{ width: "120px" }}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => togglePasswordVisibility(row.id)}
                    >
                        <i className={`bi ${visiblePasswords[row.id] ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                </div>
            ),
            sortable: false,
            width: '200px',
        }
        , {
            name: 'Role',
            selector: row => row.role,
            sortable: true
        },
        {
            name: 'Created By superadmin',
            selector: row => row.createdsuperadminuser || 'N/A',
        }, {
            name: 'Created By admin',
            selector: row => row.createdadminuser || 'N/A',
        },
        {
            name: 'Status',
            selector: row => row.isdisable ? 'Disabled' : 'Active',
            cell: row => (
                <span className={`badge ${row.isdisable ? 'bg-danger' : 'bg-success'}`}>
                    {row.isdisable ? 'Disabled' : 'Active'}
                </span>
            ),
            sortable: true,
            width: '120px',
        },
        {
            name: 'Action',
            cell: (row) =>
                <div className='d-flex justify-content-center align-items-center gap-2'>
                    <button type="button" onClick={() => handleDelete(row.role, row.id)} className="btn btn-outline-danger" disabled={row.isdisable}><i className="bi bi-trash-fill"></i></button>
                    <button type="button" onClick={() => handleEdit(row)} className="btn btn-outline-info" disabled={row.isdisable}><i className="bi bi-pencil"></i></button>
                    <button type="button" onClick={() => handleDisable(row)} className="btn btn-outline-warning"> <i className={`bi ${row.isdisable ? 'bi-unlock' : 'bi-ban'}`}></i></button>
                </div>,
            width: '180px',
        }

    ]


    const handleDelete = useCallback(async (role, id) => {
        const confirm = window.confirm('Are you sure you want to delete this user?');
        try {
            if (confirm) {
                const url = `/${role}/${id}`;
                await DeleteForm(url);
                alert("Deleted Successfully..");
                fetchPageData();
            }
        } catch (err) {
            console.error(err);
        }
    }, [fetchPageData]);



    const handleEdit = useCallback((row) => {
        const confirm = window.confirm('Are you sure you want to edit this user?');
        if (confirm) {
            setEditForm({
                id: row.id,
                index:row.index,
                username: row.username,
                password: row.password,
                email: row.email,
                role: row.role,
                createdsuperadminuser: row.createdsuperadminuser,
                createdadminuser: row.createdadminuser,
                isdisable: row.isdisable
            });

        }
    }, []);

    const handleDisable = useCallback(async (row) => {
        const confirm = window.confirm(`Are you sure you want to ${row.isdisable ? 'enable' : 'disable'} this user?`);
        if (!confirm) return;

        try {
            const url = `/${row.role}/${row.id}`;
            const updatedData = {
                ...row,
                isdisable: row.isdisable ? 0 : 1
            };

            await UpdateForm(url, updatedData);
            alert(`User ${row.isdisable ? 'enabled' : 'disabled'} successfully!`);
            fetchPageData();
        } catch (err) {
            console.error(err);
        }
    }, [fetchPageData]);




    const updateUser = useCallback(async (data) => {
        try {
            const url = `/${data.role}/${data.id}`;
            const payload = user.role === 'admin'
                ? {...data,
                    id: data.id,
                    password: data.password,
                }
                : data;

            await UpdateForm(url, payload);
            setEditForm(null);
            await fetchPageData();
            alert("User updated successfully!");
        } catch (err) {
            console.error(err);
        }
    }, [fetchPageData, user?.role]);





    return (
        <div className='container-fluid p-0'>
            <GoBack />
            <div className='container-fluid mt-3'>
                <div className='row gx-0'>
                    <div className='col'>
                        <div className='m-3'>
                            {loading ? <Loader /> :
                                error ? (<p className="text-danger text-center">{error}</p>)
                                    : (
                                        <>
                                            {data.length === 0 ? <p className="text-center w-100 bg-light border p-3">There is No Data</p> :
                                                <DataTableComponent rowData={row} columnData={column} />}

                                        </>
                                    )}

                            {editForm && (
                                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                    <div className="modal-dialog" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Edit User</h5>
                                                <button type="button" className="btn-close" onClick={() => setEditForm(null)}></button>
                                            </div>
                                            <div className="modal-body">
                                                {user.role === 'admin' ?
                                                    <form>
                                                        <div className="mb-3">
                                                            <label className="form-label">Name</label>
                                                            <input type="text" className="form-control" value={editForm.username} disabled />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Email</label>
                                                            <input type="email" className="form-control" value={editForm.email} disabled />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Password</label>
                                                            <div className="input-group mb-0">
                                                                <input
                                                                    type={showPassword ? "text" : "password"}
                                                                    className="form-control"
                                                                    value={editForm.password}
                                                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                                </button>
                                                            </div>
                                                            <small className="text-muted">Admins can only update passwords.</small>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Role</label>
                                                            <input type="text" className="form-control" value={editForm.role} disabled />
                                                        </div>
                                                    </form>
                                                    :
                                                    <form>
                                                        <div className="mb-3">
                                                            <label className="form-label">Name</label>
                                                            <input type="text" className="form-control" value={editForm.username} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Email</label>
                                                            <input type="email" className="form-control" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                                                        </div>
                                                        <div className="mb-3">
                                                            <label className="form-label">Password</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type={showPassword ? "text" : "password"}
                                                                    className="form-control"
                                                                    value={editForm.password}
                                                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-secondary"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="form-label">Role</label>
                                                            <input type="text" className="form-control" value={editForm.role} disabled />
                                                        </div>
                                                    </form>}
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary " onClick={() => updateUser(editForm)}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default memo(UserCreatedData);

function datareducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case 'FETCH_ERROR':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}
