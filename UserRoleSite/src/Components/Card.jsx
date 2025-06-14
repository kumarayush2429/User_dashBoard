import { memo } from 'react';
import { Link } from 'react-router-dom';
import { userdata } from '../Routes/Routes';

const Card = ({ cardTitle = null, cardValue = null, cardDescription = null, type }) => {
    return (
        <section id="card1" className="card">
            <div className='card__title text-center p-2 border-bottom'>{cardTitle}</div>
            <svg
                viewBox="0 0 16 16"
                className="bi bi-person-fill"
                fill="currentColor"
                height="40"
                width="40"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
            <div className="card__content">
                <p className='card__value text-center p-2 border-bottom fw-bold mb-0'>
                    {cardValue}
                </p>
                <div className="card__description p-2">
                    {cardDescription}
                </div>
                <div className='position-absolute bottom-0 start-0 w-100 p-2 border-top text-center' >
                    <Link to={`${userdata}?type=${type}`} className='btn btn-outline-info '> View </Link>
                </div>
            </div>

        </section>
    )
}

export default memo(Card); 
