import React, {useState} from 'react';
import '../Css/Register.css'

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const registerHandler = () => {
        console.log(`Username: ${username}\nEmail: ${email}`);
    }

    return (
        <div className='register'>
            <p className='greet'>Fill in the fields to register</p>
            <div>
                <label htmlFor='username' className='username'>Username </label>
                <input type='text' onChange={event => setUsername(event.target.value)} id='username'></input>
            </div>
            <br />
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
            <div>
                <label htmlFor='repeatPassword' className='password'>Repeat Password </label>
                <input type='password' id='repeatPassword'></input>
            </div>
            <br />
            <button onClick={registerHandler} className='register-button'>Register</button>
        </div>
    )
}

export default Register