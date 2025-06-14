import { memo, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { AdminInfo, EmployeeInfo } from '../api/api';
import Card from '../Components/Card';
import GoBack from '../Components/GoBack';
import Sidebar from '../Components/Sidebar';
import { GlobalContext } from '../GlobalContext/GlobalContext';
import Loader from '../Components/Loader';


const DashBoard = () => {
    const { user } = useContext(GlobalContext);


    const initialState = {
        adminData: [],
        employeeData: [],
        loading: false,
        error: null,

    }

    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    const fetchAllData = useCallback(async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const [adminRes, employeeRes] = await Promise.all([AdminInfo(), EmployeeInfo(),]);
            let adminData = [];
            let employeeData = [];


            if (user?.role === 'superadmin') {
                adminData = adminRes
                employeeData = employeeRes
            } else if (user?.role === 'admin') {
                employeeData = employeeRes
            }
            dispatch({ type: 'FETCH_SUCCESS', payload: { adminData, employeeData } });
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }

    }, [user]
    )


    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const { adminData, employeeData, loading, error } = state;


    const adminList = useMemo(() => (
        <>
            <div className='text-center'>{`Total Number Admin: ${adminData.length}`}</div>
        </>

    ), [adminData])

    const employeeList = useMemo(() => (
        <>
            <div className='text-center'>{`Total Number Employee: ${employeeData.length}`}</div>
        </>

    ), [employeeData])


    const cardsToRender = [];

    if (adminData.length > 0) {
        cardsToRender.push({
            title: 'Admin',
            value: `Total Admin`,
            description: adminList
        });
    }

    if (employeeData.length > 0) {
        cardsToRender.push({
            title: 'Employee',
            value: `Total Employee`,
            description: employeeList
        });
    }




    return (
        <>
            <div className="container-fluid p-0">
                <GoBack />
                <div className="row gx-0">
                    <Sidebar />
                    <div className="col-9">
                        <div className="m-2">
                            {loading ? (
                                <div className='d-flex justify-content-center align-items-center' style={{ marginTop: "8rem" }}>
                                    <Loader />
                                </div>
                            ) : error ? (
                                <p className="text-danger text-center">{error}</p>
                            ) : (
                                user?.role === 'employee' ? <div className='text-center mt-5'> sorry Work Under Progress for Employee !!</div>
                                    :
                                    <div className="row mt-5 justify-content-center">
                                        {cardsToRender.length > 0 ? cardsToRender.map((card, idx) => (
                                            <div
                                                key={idx}
                                                className={`col-md-4 mb-3 ${cardsToRender.length === 1 ? 'd-flex justify-content-center' : ''}`} >
                                                <Card
                                                    cardTitle={card.title}
                                                    cardValue={card.value}
                                                    cardDescription={card.description}
                                                    type={card.title.toLowerCase()}
                                                />
                                            </div>
                                        )) : <p className='p-3 border w-50 bg-light text-center ms-4'>No User Added</p>}
                                    </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(DashBoard);


function dashboardReducer(state, action) {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                adminData: action.payload.adminData,
                employeeData: action.payload.employeeData,
            };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}


