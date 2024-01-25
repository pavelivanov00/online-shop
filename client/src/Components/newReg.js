import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            usernameError: '',
            emailError: '',
            passwordError: '',
            confirmPasswordError: '',
            isUsernameOK: false,
            isEmailOK: false,
            isPasswordOK: false,
            isConfirmPasswordOK: false,
        };
    }

    handleUsernameChange = event => {
        const username = event.target.value;
        this.setState({ username });
    };

    handleUsernameBlur = event => {
        const username = event.target.value;
        if (username.length < 2) {
            this.setState({
                usernameError: 'Username must be at least 2 characters long',
                isUsernameOK: false
            });
        } else {
            this.setState({
                username,
                usernameError: '',
                isUsernameOK: true
            });
        }
    };

    handleEmailChange = event => {
        const email = event.target.value;
        this.setState({ email });
    };

    handleUsernameBlur = event => {
        const email = event.target.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            this.setState({
                emailError: 'Invalid email address',
                isEmailOK: false
            });
        } else {
            this.setState({
                email,
                emailError: '',
                isEmailOK: true
            });
        }
    };

    handlePasswordChange = event => {
        const password = event.target.value;
        this.setState({ password });
    };

    handlePasswordBlur = event => {
        const password = event.target.value;
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#.,<>()[\]])[A-Za-z\d@$!%*?&#.,<>()[\]]{8,}$/;

        if (!passwordPattern.test(password)) {
            this.setState({
                passwordError: 'Password must be at least 8 characters long and include ' +
                    'one letter, one digit and one special character',
                isPasswordOK: false
            });
        } else {
            this.setState({
                password,
                passwordError: '',
                isPasswordOK: true
            });
        }
    };

    handleConfirmPasswordChange = event => {
        const confirmPassword = event.target.value;
        this.setState({ confirmPassword });
    };

    registerHandler = () => {
        const { confirmPassword, password, isUsernameOK, isEmailOK, isPasswordOK, isConfirmPasswordOK } = this.state;
        const passwordsMatch = confirmPassword === password;

        passwordsMatch ? this.setState({ setPasswordMatchError: '' }) :
            this.setState({ setPasswordMatchError: 'Passwords do not match' });
        this.setState({ setIsConfirmPasswordOK: passwordsMatch });

        if (!isUsernameOK || !isEmailOK || !isPasswordOK || !isConfirmPasswordOK) {
            console.log('Registration failed due to validation errors');
        } else {
            console.log(`Registration successful. \nEmail: ${email}`);

            this.registerAccount();
            this.setState({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',

                usernameError: '',
                emailError: '',
                passwordError: '',
                confirmPasswordError: '',

                isUsernameOK: false,
                isEmailOK: false,
                isPasswordOK: false,
                isConfirmPasswordOK: false,
            })

        }
    };

    registerAccount = () => {
        const { username, email, password } = this.state;

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


    render() {
        return (
            <div className='register'>
                <p className='greet'>Fill in the information to register</p>
                <div>
                    <label htmlFor='username' className='username'>Username </label>
                    <input
                        type='text'
                        onBlur={event => handleUsernameBlur(event)}
                        onChange={event => handleUsernameChange(event)}
                        value={username}
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
                        onChange={event => handleEmailChange(event)}
                        value={email}
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
                        onChange={event => handlePasswordChange(event)}
                        value={password}
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
                        value={confirmPassword}
                        id='confirmPassword'
                        className='passwordTextbox'
                    />
                    {passwordMatchError && <button className='exclamationMark'>!</button>}
                </div>

                {passwordMatchError &&
                    <div className='errorStyle'>
                        <p>{passwordMatchError}</p>
                    </div>}
                <button onClick={RegisterHandler} className='registerButton'>Register</button>
            </div>
        );
    }
}

export default Register;
