import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successfulLogin, setSuccessfulLogin] = useState();
  const [response, setResponse] = useState({});

  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      const result = await axios.post('http://localhost:5000/login', {
        email,
        password
      });
      setResponse(result);

      if (result.data.status === 'Login successful') {
        setSuccessfulLogin(true);
        navigate('home', {
          state: {
            email: result.data.email,
            username: result.data.username,
            role: result.data.role
          },
        });
      }
      else {
        setSuccessfulLogin(false);
      }
    }
    catch (error) {
      console.error('Error during registration:', error);
    }
  }

  return (
    <div className='loginForm'>
      <p className='greet'>Hello please log in</p>
      <div>
        <label htmlFor='email' className='email'>Email </label>
        <input type='text' onChange={event => setEmail(event.target.value)} id='email'></input>
      </div>
      <br />
      <div>
        <label htmlFor='password' className='password'>Password </label>
        <input type='password' onChange={event => setPassword(event.target.value)} id='password'></input>
      </div>
      <br />
      <button onClick={loginHandler} className='loginButton'>Log in</button>

      <div>
        {successfulLogin ? (
          <p>{response.data && response.data.status}</p>
        ) : (
          <p className="invalidCredentials">{response.data && response.data.status}</p>
        )}
      </div>

      <p className='registerHere'>
        {"Don't have an account? "}
        <NavLink
          to='register'
          className='create-account-link'
        >
          {'Create one here.'}
        </NavLink>
      </p>
    </div>
  )
}

export default Login