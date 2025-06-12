'use client';

import React, { useState } from 'react';

interface FormData {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const { username, email, password } = formData;
    if (!username || !email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    console.log('Registered:', formData);
    setMessage('Registration successful!');
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div style={wrapperStyle}>
      <div style={formContainerStyle}>
        <h2 style={headingStyle}><strong>CREATE AN ACCOUNT</strong></h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div style={rightSideStyle}>
        {/* Optional: you can put an image or content here */}
      </div>
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  display: 'flex',
  height: '100vh',
  width: '100vw',
};

const formContainerStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#626f47',
};

const rightSideStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#e0e0e0', // just to visualize the right half
};

const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
};
 
const headingStyle: React.CSSProperties = {
    fontFamily: "'Baloo 2', cursive",
    fontSize: '3rem',
    marginBottom: '2rem',
    color: '#f5ecd5'
  };
  
const inputStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    display: 'block',
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    backgroundColor: '#d4d3d3'
  };  

const buttonStyle: React.CSSProperties = {
fontFamily: "'JetBrains Mono', monospace",
padding: '0.5rem 1rem',
backgroundColor: '#a4b465',
color: '#fff',
border: 'none',
borderRadius: '4px',
cursor: 'pointer',
};
  
