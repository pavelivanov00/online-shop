import React from 'react'
import '../Css/Login.css';

const Login = () => {
  return (
    <div className='login-form'>
      <p className='greet'>Hello please log in</p>
      <div>
        <label htmlFor='username' className='username'>Username </label>
        <input type='text' id='username'></input>
      </div>
      <br />
      <div>
        <label htmlFor='password' className='password'>Password </label>
        <input type='password' id='password'></input>
      </div>
      <br />
      <button className='log-in-button'>Log in</button>
    </div>
  )
}

export default Login