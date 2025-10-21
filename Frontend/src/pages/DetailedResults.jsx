// src/pages/DetailedResults.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetailedResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, score, total } = location.state || {};

    if (!results) {
        return (
            <div className='min-h-[90vh] py-10 px-5'>
                <h2 className='text-2xl font-bold mb-3'>No detailed results available</h2>
                <button onClick={() => navigate(-1)} className='py-2 px-4 bg-blue-600 text-white rounded-lg'>Go Back</button>
            </div>
        );
    }

    return (
        <div className='min-h-[90vh] py-10 px-5'>
            <h2 className='text-3xl font-bold mb-4'>Detailed Answers</h2>
            <p className='mb-6'>Score: <span className='font-semibold'>{score}</span> / {total}</p>

            <div className='flex flex-col gap-5'>
                {results.map((q, i) => {
                    // Normalize option ids and selectedOption shape
                    const selectedId = q.selectedOption?.id ? q.selectedOption.id.toString() : (q.selectedOption ? q.selectedOption.toString() : null);

                    return (
                        <div key={q.questionId} className='p-4 rounded-lg border border-slate-700 bg-slate-800'>
                            <div className='mb-2'>
                                <span className='font-semibold'>{i + 1}. </span>
                                <span>{q.questionText}</span>
                            </div>
                            <ul className='ml-4 list-disc'>
                                {q.options.map(opt => {
                                    const optId = (opt.id || opt._id || opt._id === 0 ? opt.id || opt._id : opt).toString();
                                    const isCorrect = !!opt.isCorrect;
                                    const isSelected = selectedId && selectedId === optId;

                                    let classes = 'py-1';
                                    if (isSelected && isCorrect) classes += ' text-green-400 font-semibold';
                                    else if (isSelected && !isCorrect) classes += ' text-red-400 font-semibold';
                                    else if (!isSelected && isCorrect) classes += ' text-green-300';
                                    // neutral otherwise

                                    return (
                                        <li key={optId} className={classes}>
                                            {opt.text}
                                            {isSelected && <span className='ml-2 text-sm'>(Your answer)</span>}
                                            {isCorrect && <span className='ml-2 text-sm'>(Correct)</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            <div className='mt-6'>
                <button onClick={() => navigate(-1)} className='py-2 px-4 bg-slate-700 text-white rounded-lg'>Back</button>
            </div>
        </div>
    );
};

export default DetailedResults;
