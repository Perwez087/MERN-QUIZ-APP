// src/pages/QuizResult.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // safe destructure - if user opened page directly, state might be undefined
    const { score, total, results } = location.state || {};

    // If results missing, show message and optionally go back
    if (!results) {
        return (
            <div className='min-h-[90vh] py-10 px-5'>
                <h2 className='text-2xl font-bold mb-3'>Results not found</h2>
                <p className='mb-4'>Either the quiz was not submitted properly or you opened this page directly.</p>
                <button
                    onClick={() => navigate(-1)}
                    className='py-2 px-4 bg-blue-600 rounded-lg text-white'
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className='min-h-[90vh] py-10 px-5'>
            <h2 className='text-3xl font-bold mb-5'>Your Score</h2>
            <div className='mb-6'>
                <p className='text-xl'>You scored <span className='font-semibold'>{score}</span> out of <span className='font-semibold'>{total}</span></p>
            </div>

            <div className='flex gap-3'>
                <button
                    onClick={() => navigate('/detailed-results', { state: { results, score, total } })}
                    className='py-2 px-4 bg-green-600 rounded-lg text-white'
                >
                    View Detailed Answers
                </button>

                <button
                    onClick={() => navigate('/')}
                    className='py-2 px-4 bg-slate-700 rounded-lg text-white'
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default QuizResults;
