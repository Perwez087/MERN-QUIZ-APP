// src/components/core/attemptQuiz/QuizQuestions.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../Button';
import QuestionCard from './QuestionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../services/apiConnector';
import { quizEndpoints } from "../../../services/APIs";
import { setUser } from "../../../slices/AuthSlice";

const QuizQuestions = ({ quizDetails, quizQuestions }) => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]); // [{questionId, selectedOption}]
    const { token, user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (quizDetails?.timer) {
            setRemainingTime(quizDetails.timer * 60);
        }
    }, [quizDetails]);

    useEffect(() => {
        let timer;
        if (quizStarted && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (quizStarted && remainingTime === 0) {
            clearInterval(timer);
            alert('Time is up!');
            submitQuiz();
        }
        return () => clearInterval(timer);
    }, [quizStarted, remainingTime]); // eslint-disable-line

    const handleAnswerChange = useCallback((questionId, selectedOption) => {
        setUserAnswers(prevAnswers => {
            const idx = prevAnswers.findIndex(a => a.questionId === questionId);
            if (idx >= 0) {
                const newArr = [...prevAnswers];
                newArr[idx] = { questionId, selectedOption };
                return newArr;
            } else {
                return [...prevAnswers, { questionId, selectedOption }];
            }
        });
    }, []);

    const startQuiz = () => setQuizStarted(true);

    const submitQuiz = async () => {
        try {
            const response = await apiConnector(
                'POST',
                `${quizEndpoints.ATTEMMP_QUIZ}/${quizDetails._id}/attempt`,
                {
                    quizId: quizDetails._id,
                    answers: userAnswers,
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            );

            // Update user attempted quizzes locally
            dispatch(setUser({
                ...user,
                attemptedQuizzes: [...(user.attemptedQuizzes || []), quizDetails._id]
            }));

            // If backend returned a results array, use it; otherwise build locally
            const backendResults = response?.data?.results;
            let results = [];

            if (backendResults && Array.isArray(backendResults) && backendResults.length > 0) {
                // Standardized format expected from backend:
                // [{ questionId, questionText, options: [{ id, text, isCorrect }], selectedOption: { id, text, isCorrect } }]
                results = backendResults;
            } else {
                // Fallback: build results from quizQuestions and userAnswers
                results = quizQuestions.map(q => {
                    const userAns = userAnswers.find(a => a.questionId === q._id) || {};
                    // Normalize options: ensure each option has an id field (some code uses _id)
                    const options = q.options.map(opt => ({
                        id: opt._id || opt.id,
                        text: opt.text,
                        isCorrect: !!opt.isCorrect
                    }));
                    return {
                        questionId: q._id,
                        questionText: q.questionText,
                        options,
                        selectedOption: userAns.selectedOption || null
                    };
                });
            }

            const score = response?.data?.score ?? results.reduce((acc, r) => {
                const sel = r.selectedOption;
                if (!sel) return acc;
                // find option object
                const opt = Array.isArray(r.options) ? r.options.find(o => (o.id?.toString() ?? o._id?.toString()) === sel?.toString()) : null;
                if (opt && opt.isCorrect) return acc + 1;
                return acc;
            }, 0);

            // Navigate to QuizResults and pass structured state
            navigate('/quiz-results', {
                state: {
                    score,
                    total: quizQuestions?.length ?? results.length,
                    results
                }
            });

        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Failed to submit quiz. Please try again.');
        }
    };

    const formatTime = (time) => {
        if (time == null) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className='flex py-5 border min-h-[70vh] px-5 justify-center items-start mt-5 rounded-lg bg-slate-900 border-slate-600'>
            {!quizStarted ? (
                <Button className='w-max self-center' onClick={startQuiz}>Start Quiz</Button>
            ) : (
                <div className='w-full flex flex-col'>
                    <h2 className='border border-slate-600 py-2 px-3 rounded-lg text-center md:text-end'>
                        Time Remaining: <span className='text-red-500 ml-2'>{formatTime(remainingTime)}</span>
                    </h2>
                    <div className='min-h-[50vh]'>
                        {quizQuestions && quizQuestions.map((ques, idx) => (
                            <QuestionCard
                                key={ques._id}
                                question={ques}
                                onAnswerChange={handleAnswerChange}
                                index={idx}
                            />
                        ))}
                    </div>
                    <Button className='w-max self-end' onClick={submitQuiz}>Submit</Button>
                </div>
            )}
        </div>
    );
};

export default QuizQuestions;
