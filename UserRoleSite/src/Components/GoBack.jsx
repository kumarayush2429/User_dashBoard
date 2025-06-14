import React from 'react'

const GoBack = () => {
    return (
        <div>
            <button className='btn btn-primary goBackButton' onClick={() => window.history.back()}><i className="bi bi-arrow-left me-2"></i>Go Back</button>
        </div>
    )
}

export default GoBack
