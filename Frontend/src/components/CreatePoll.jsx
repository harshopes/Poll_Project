import React, { useState } from 'react';
import api from '../services/api';

const CreatePoll = () => {
  const [pollTitle, setPollTitle] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/polls', { poll_title: pollTitle, options });
      alert('Poll created successfully!');
    } catch (err) {
      console.error(err);
      alert('Poll creation failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Poll Title"
        value={pollTitle}
        onChange={(e) => setPollTitle(e.target.value)}
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <button type="button" onClick={handleAddOption}>Add Option</button>
      <button type="submit">Create Poll</button>
    </form>
  );
};

export default CreatePoll;
