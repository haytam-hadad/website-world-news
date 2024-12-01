"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    // Example validation logic, replace with your own
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      // Replace with your login logic
      // Example: await loginUser(email, password);
      router.push('/home');
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="form_container">
      <form className="form" onSubmit={handleLogin}>
        <h2 className="form_title" >Log in</h2>
        {error && <p className="error">{error}</p>}
        
        <div className='form_group'>
          <label className='form_label' htmlFor="text">user name :</label>
          <input className='form_input'
            type="text"
            id="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder='Enter your user name'
          />
        </div>

        <div className='form_group'>
          <label className='form_label' htmlFor="email">Email:</label>
          <input className='form_input'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Enter an email'
          />
        </div>
        <div className='form_group'>
          <label className='form_label' htmlFor="password">Password:</label>
          <input className='form_input'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Enter a password'
          />
        </div>
        <p className='form_link'>You have an account? <Link href='/signin'>Sign in</Link></p>
        <button className='form_btn' type="submit">Submit</button>
      </form>
      <div className="form_image_c"></div>
    </div>
  );
};

export default LoginPage;
