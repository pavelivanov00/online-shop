import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import '../Css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = () => {
    console.log(`email: ${email}\n password: ${password}`); 
  }

  return (
    <div className='login-form'>
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
      <button onClick={loginHandler} className='log-in-button'>Log in</button>
      <p className='register'>
        {"Don't have an account? "}
        <NavLink
          to="register"
          className='create-account-link'
        >
          {'Create one here.'}
        </NavLink>
      </p>
    </div>
  )
}

export default Login