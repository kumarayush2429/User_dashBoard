import { memo } from 'react'
import GoBack from '../Components/GoBack'

const NotFound = () => {
    return (
        <div className='conatiner'>
            <div className='row gx-0'>
                <div className='col-12 min-vh-100'>
                    <GoBack />
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className='w-50 bg-light border p-3 text-center fw-bold fs-3'>
                            Sorry NO Page Found
                            <i class="bi bi-emoji-frown ms-2"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(NotFound) 
