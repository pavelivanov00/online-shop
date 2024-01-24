import React, { useState } from 'react';
import axios from 'axios';
import '../Css/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');

    const [isUsernameOK, setIsUsernameOK] = useState(false);
    const [isEmailOK, setIsEmailOK] = useState(false);
    const [isPasswordOK, setIsPasswordOK] = useState(false);
    const [isConfirmPasswordOK, setIsConfirmPasswordOK] = useState(false);

    const handleUsernameBlur = event => {
        const username = event.target.value;
        if (username.length < 2) {
            setUsernameError('Username must be at least 2 characters long');
            setIsUsernameOK(false);
        } else {
            setUsernameError('');
        }
        setUsername(username);
        setIsUsernameOK(true);
    };

    const handleEmailBlur = event => {
        const email = event.target.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Invalid email address');
            setIsUsernameOK(false);
        } else {
            setEmailError('');
        }

        setEmail(email);
        setIsEmailOK(true);
    };

    const handlePasswordBlur = event => {
        const password = event.target.value;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#.,<>()[\]])[A-Za-z\d@$!%*?&#.,<>()[\]]{8,}$/;

        if (!passwordPattern.test(password)) {
            setPasswordError('Password must be at least 8 characters long and include ' +
                'one letter, one digit and one special character');
            setIsPasswordOK(false);
        } else {
            setPasswordError('');
        }
        setPassword(password);
        setIsPasswordOK(true);
    };

    const handleConfirmPasswordChange = event => {
        const confirmPassword = event.target.value;

        if (confirmPassword !== password) {
            setPasswordMatchError('Passwords must match');
            setIsConfirmPasswordOK(false);
        } else {
            setPasswordMatchError('');
        }
        setConfirmPassword(confirmPassword);
        setIsConfirmPasswordOK(true);
    };

    const registerHandler = () => {
        if (!isUsernameOK || !isEmailOK || !isPasswordOK || !isConfirmPasswordOK || password !== confirmPassword) {
            console.log('Registration failed due to validation errors');
            return;
        }
        else {
            console.log(`registration successful. \nEmail: ${email}`);

            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
    
            setUsernameError('');
            setEmailError('');
            setPasswordError('');
            setPasswordMatchError('');
    
            setIsUsernameOK('false');
            setIsEmailOK('false');
            setIsPasswordOK('false');
            setIsConfirmPasswordOK('false');
        }

        register()
    };

    const register = () => {
        axios.post('http://localhost:5000/register', {
          username,
          email,
          password
        }).then(response => {
          console.log('Registration successful:', response.data);
        }).catch(error => {
          console.error('Error while registering:', error);
        });
      };

    return (
        <div className='register'>
            <p className='greet'>Fill in the information to register</p>
            <div>
                <label htmlFor='username' className='username'>Username </label>
                <input
                    type='text'
                    onBlur={event => handleUsernameBlur(event)}
                    id='username'
                    className='usernameTextbox'
                />
                {usernameError && <button className='exclamationMark'>!</button>}
                {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
            </div>
            <br />
            <div>
                <label htmlFor='email' className='email'>Email </label>
                <input
                    type='text'
                    onBlur={event => handleEmailBlur(event)}
                    id='email'
                    className='emailTextbox'
                />
                {emailError && <button className='exclamationMark'>!</button>}
                {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
            </div>
            <br />
            <div>
                <label htmlFor='password' className='password'>Password </label>
                <input
                    type='password'
                    onBlur={event => handlePasswordBlur(event)}
                    id='password'
                    className='passwordTextbox'
                />
                {(passwordError || passwordMatchError) && <button className='exclamationMark'>!</button>}
            </div>
            {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
            <br />
            <div>
                <label htmlFor='confirmPassword' className='password'>Confirm Password </label>
                <input
                    type='password'
                    onChange={event => handleConfirmPasswordChange(event)}
                    id='confirmPassword'
                    className='passwordTextbox'
                />
                {passwordMatchError && <button className='exclamationMark'>!</button>}
            </div>

            {passwordMatchError &&
                <div className='errorStyle'>
                    <p>{passwordMatchError}</p>
                </div>}
            <button onClick={registerHandler} className='registerButton'>Register</button>
        </div>
    )
}

export default Register