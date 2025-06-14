import { memo, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../GlobalContext/GlobalContext';
import { dashboard, form } from '../Routes/Routes';

const Sidebar = () => {
    const { user } = useContext(GlobalContext)
    return (
        <div className='col-3'>
            <div className='sidebar border border-top-0 border-bottom-0'>
                <ul className='list-group'>
                    <li className='border-bottom'>
                        <NavLink to={dashboard} className={({ isActive }) => `d-flex align-items-center p-2 nav-link ${isActive ? 'active' : ''}`}>
                            <i className='bi bi-box'></i>
                            <span className='ms-2'>Dashboard</span>
                        </NavLink>
                    </li>
                    {user?.role === 'employee' ? null :
                        <li className='border-bottom'>
                            <NavLink to={form} className={({ isActive }) => `d-flex align-items-center p-2 nav-link ${isActive ? 'active' : ''}`}>
                                <i className='bi bi-box'></i>
                                <span className='ms-2'>Form</span>
                            </NavLink>
                        </li>
                    }
                </ul>
            </div>
        </div>
    );
};

export default memo(Sidebar);
