'use client';

import React, { useState } from 'react';

interface FormData {
  username: string;
  password: string;
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const { username, password } = formData;
    if (!username || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    console.log('Registered:', formData);
    setMessage('Registration successful!');
    setFormData({ username: '', password: ''});
  };

  return (
    <div style={wrapperStyle}>
      <div style={leftSideStyle}>
        {/* Optional: you can put an image or content here */}
      </div>

      <div style={formContainerStyle}>
        <h2 style={headingStyle}>LOGIN</h2>
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
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
            autoComplete="new-password"
          />
          <button type="submit" style={buttonStyle}>
            Login
          </button>
        </form>
        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '1.3rem' }}>
          {message && <p style={{color: '#CD5C5C'}}>{message}</p>}
          <p style={{color: '#626F47', fontFamily: 'JetBrainMono'}}>Don't have an account? Sign up <a href="../register"><u>here</u></a></p>
        </div>
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
  backgroundColor: '#F5ECD5',
};

const leftSideStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#e0e0e0', 
}

const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
};
 
const headingStyle: React.CSSProperties = {
    fontFamily: "'Baloo 2', cursive",
    fontSize: '2.5rem',
    marginBottom: '2rem',
    color: '#626F47'
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
marginTop: '0.5rem',
backgroundColor: '#a4b465',
color: '#fff',
border: 'none',
borderRadius: '10px',
cursor: 'pointer',
};
  
