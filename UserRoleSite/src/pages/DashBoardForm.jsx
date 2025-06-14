import { memo, useCallback, useContext, useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import GoBack from '../Components/GoBack';
import { GlobalContext } from '../GlobalContext/GlobalContext';
import { apiLoginGet, registerForm } from '../api/api';

const DashBoardForm = () => {
    const { user } = useContext(GlobalContext);
    const [form, setForm] = useState({ username: '', password: '', email: '', role: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [IsSubmit, setIsSubmit] = useState(false)

    useEffect(() => {
        if (user.role === 'admin') {
            setForm(prev => ({ ...prev, role: 'employee' }));
        } else if (user.role === 'superadmin') {
            setForm(prev => ({ ...prev, role: 'admin' }));
        }
    }, [user.role]);


    const handleToggle = useCallback(() => {
        setShowPassword(prev => !prev)
    }, [])

    const handleChange = useCallback((e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    })


    const getNextIdForRole = async (role) => {
        try {
            const existingUsers = await apiLoginGet(`/${role}`);
            const maxId = existingUsers.reduce((max, user) => Math.max(max, user.id), 0);
            return String(maxId + 1);
        } catch (error) {
            console.error(`Error fetching ${role} users:`, error);
            throw new Error('Failed to get next user ID');
        }
    };

    const getdata = async (role) => {
        try {
            const data = await apiLoginGet(`/${role}`);
            return data;

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const isFormIncomplete = Object.values(form).some(value => value.trim() === '');
        setIsSubmit(isFormIncomplete);
    }, [form]);



    const handlesubmit = async (e) => {
        e.preventDefault();

        try {
            const nextId = await getNextIdForRole(form.role);

            const data = await getdata(form.role);
            const isEmailExists = data?.some(user => user.email?.toLowerCase() === form.email.toLowerCase());
            const isUsernameExists = data?.some(user => user.username?.toLowerCase() === form.username.toLowerCase());

            if (isEmailExists) {
                alert('Email already exists');
                setForm({ username: '', password: '', email: '', role: '' })
                return;
            } else if (isUsernameExists) {
                alert('Username already exists');
                setForm({ username: '', password: '', email: '', role: '' })
                return;
            }

            let userData;

            if (user.role === 'superadmin') {
                if (form.role === 'admin') {
                    userData = {
                        id: nextId,
                        username: form.username,
                        password: form.password,
                        email: form.email,
                        role: form.role,
                        createdsuperadminuser: user.username,
                    };
                } else {
                    userData = {
                        id: nextId,
                        username: form.username,
                        password: form.password,
                        email: form.email,
                        role: form.role,
                        createdsuperadminuser: user.username,
                        createdadminuser: ""
                    };
                }
            } else if (user.role === 'admin') {
                userData = {
                    id: nextId,
                    username: form.username,
                    password: form.password,
                    email: form.email,
                    role: form.role,
                    createdsuperadminuser: "",
                    createdadminuser: user.username
                };
            }

            await registerForm(`/${form.role}`, userData);
            alert('User registered successfully');
            setForm({ username: '', password: '', email: '', role: form.role }); // Keep role preserved after submit
        } catch (err) {
            console.error(err);
            alert('User registration failed. Check console for details.');
        }
    };


    return (
        <>
            <div className='container-fluid p-0'>
                <GoBack />
                <div className='row gx-0'>
                    <Sidebar />
                    <div className='col-9'>
                        <div className='m-2'>
                            <div className='container'>
                                {user.role === 'superadmin' &&

                                    <div className='d-flex align-items-center gap-2'>
                                        <p className='m-0'>Admin</p>

                                        <input
                                            id="check"
                                            type="checkbox"
                                            checked={form.role === 'employee'}
                                            onChange={(e) => {
                                                setForm(prev => ({
                                                    ...prev,
                                                    role: e.target.checked ? 'employee' : 'admin'
                                                }));
                                            }}
                                        />

                                        <label className="switch" htmlFor="check">
                                            <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
                                                <path
                                                    pathLength="360"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    d="M 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 A 42.24 42.24 90 0 0 84.4992 42.2496 A 42.24 42.24 90 0 0 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 L 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 A 42.24 42.24 90 0 0 128 42.2496 A 42.24 42.24 90 0 0 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 L 42.2496 0"
                                                ></path>
                                            </svg>
                                        </label>

                                        <p className='m-0 ms-2'>Employee</p>
                                    </div>}


                                <div className='row gx-0 justify-content-center align-items-center'>
                                    <div className='col-12 col-md-6'>
                                        <form className="modern-form" onSubmit={handlesubmit}>
                                            <div className="form-title">{form.role === 'admin' ? 'Add Admin' : 'Add Employee'}</div>

                                            <div className="form-body">
                                                <div className="input-group input-group-dual">
                                                    <div className="input-wrapper role-wrapper">
                                                        <select className="form-input" required name='role' value={form.role} onChange={handleChange}>
                                                            <option value="" disabled>
                                                                Select Role
                                                            </option>
                                                            <option value="admin" disabled={user?.role === 'admin'}>Admin</option>
                                                            <option value="employee">Employee</option>
                                                        </select>
                                                    </div>

                                                    <div className="input-wrapper username-wrapper">
                                                        <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                                            <circle
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                r="4"
                                                                cy="8"
                                                                cx="12"
                                                            ></circle>
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"
                                                            ></path>
                                                        </svg>
                                                        <input
                                                            required
                                                            placeholder="Username"
                                                            className="form-input"
                                                            type="text"
                                                            autoComplete='on'
                                                            name='username'
                                                            value={form.username}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="input-group">
                                                    <div className="input-wrapper">
                                                        <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                                            <path
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                                                            ></path>
                                                        </svg>
                                                        <input
                                                            required
                                                            placeholder="Email"
                                                            className="form-input"
                                                            type="email"
                                                            autoComplete='on'
                                                            name='email'
                                                            value={form.email}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="input-group input-group-dual">
                                                    <div className="input-wrapper ">
                                                        <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                                            <path
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                                                            ></path>
                                                        </svg>
                                                        <input
                                                            required
                                                            placeholder="Password"
                                                            className="form-input"
                                                            type={showPassword ? "text" : `password`}
                                                            autoComplete="on"
                                                            name='password'
                                                            value={form.password}
                                                            onChange={handleChange}
                                                        />
                                                        <button className="password-toggle" type="button" onClick={handleToggle} >
                                                            <svg fill="none" viewBox="0 0 24 24" className="eye-icon">
                                                                <path
                                                                    strokeWidth="1.5"
                                                                    stroke="currentColor"
                                                                    d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                                                ></path>
                                                                <circle
                                                                    strokeWidth="1.5"
                                                                    stroke="currentColor"
                                                                    r="3"
                                                                    cy="12"
                                                                    cx="12"
                                                                ></circle>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>

                                            <button className="submit-button" type="submit" disabled={IsSubmit}>
                                                <span className="button-text">Submit</span>
                                                <div className="button-glow"></div>
                                            </button>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

export default memo(DashBoardForm); 
