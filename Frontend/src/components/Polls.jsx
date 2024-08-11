import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Polls() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await axios.get('/polls', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                console.log('API Response:', response.data); // Log the response data
                if (Array.isArray(response.data)) {
                    setPolls(response.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (error) {
                setError('Error fetching polls');
                console.error('Error fetching polls:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    const handleVote = async (pollId, optionId) => {
        try {
            await axios.post('/vote', { poll_id: pollId, option_id: optionId }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Vote recorded successfully');
        } catch (error) {
            console.error('Error recording vote:', error);
            alert('Error recording vote');
        }
    };

    if (loading) return <p>Loading polls...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Polls</h1>
            {polls.length === 0 ? (
                <p>No polls available.</p>
            ) : (
                polls.map(poll => (
                    <div key={poll.poll_id}>
                        <h2>{poll.poll_title}</h2>
                        {poll.options.map(option => (
                            <div key={option.option_id}>
                                <span>{option.option_text}</span>
                                <button onClick={() => handleVote(poll.poll_id, option.option_id)}>
                                    Vote
                                </button>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    );
}

export default Polls;
