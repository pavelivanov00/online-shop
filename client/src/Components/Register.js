import React, { Component } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import '../Css/Register.css';

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
            passwordMatchError: '',

            isUsernameOK: false,
            isEmailOK: false,
            isPasswordOK: false,

            serverResponse: '',
            isEmailTaken: false,
            isRegistrationSuccessful: false
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

    handleEmailBlur = event => {
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


    registerHandler = async () => {
        const { confirmPassword, password, isUsernameOK, isEmailOK, isPasswordOK } = this.state;
        const passwordsMatch = (confirmPassword === password);

        this.setState({ passwordMatchError: passwordsMatch ? '' : 'Passwords do not match' });

        if (!isUsernameOK || !isEmailOK || !isPasswordOK || !passwordsMatch)
            console.log('Registration failed due to validation errors');
        else {
            try {
                const serverResponse = await this.registerAccount();
                if (serverResponse === 'An account has already been registered with this email') {
                    this.setState({
                        serverResponse: serverResponse,
                        isRegistrationSuccessful: false,
                        isEmailTaken: true
                    });
                }
                else {
                    console.log(serverResponse);
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

                        serverResponse: serverResponse,
                        isEmailTaken: false,
                        isRegistrationSuccessful: true
                    })
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        }
    };

    registerAccount = async () => {
        const { username, email, password } = this.state;

        const response = await axios.post('http://localhost:5000/register', {
            username,
            email,
            password,
            role: 'customer'
        });
        return response.data;
    };

    render() {
        const { username, email, password, confirmPassword, usernameError, emailError, passwordError,
            passwordMatchError, isRegistrationSuccessful, isEmailTaken, serverResponse } = this.state;
        return (
            <div className='register'>
                <p className='greet'>Fill in the information to register</p>
                <div>
                    <label htmlFor='username' className='username'>Username </label>
                    <input
                        type='text'
                        onBlur={event => this.handleUsernameBlur(event)}
                        onChange={event => this.handleUsernameChange(event)}
                        value={username}
                        id='username'
                        className='usernameTextbox'
                    />
                    {usernameError && <button className='exclamationMark'>!</button>}
                    {usernameError && <p className='errorStyle'>{usernameError}</p>}
                </div>
                <br />
                <div>
                    <label htmlFor='email' className='email'>Email </label>
                    <input
                        type='text'
                        onBlur={event => this.handleEmailBlur(event)}
                        onChange={event => this.handleEmailChange(event)}
                        value={email}
                        id='email'
                        className='emailTextbox'
                    />
                    {(emailError || isEmailTaken)  && <button className='exclamationMark'>!</button>}
                    {emailError && <p className='errorStyle'>{emailError}</p>}
                </div>
                <br />
                <div>
                    <label htmlFor='password' className='password'>Password </label>
                    <input
                        type='password'
                        onBlur={event => this.handlePasswordBlur(event)}
                        onChange={event => this.handlePasswordChange(event)}
                        value={password}
                        id='password'
                        className='passwordTextbox'
                    />
                    {(passwordError || passwordMatchError) && <button className='exclamationMark'>!</button>}
                </div>
                {passwordError && <p className='errorStyle'>{passwordError}</p>}
                <br />
                <div>
                    <label htmlFor='confirmPassword' className='password'>Confirm Password </label>
                    <input
                        type='password'
                        onChange={event => this.handleConfirmPasswordChange(event)}
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
                <button onClick={this.registerHandler} className='registerButton'>Register</button>

                <p>{serverResponse}</p>
                {isRegistrationSuccessful && <p className='registrationSuccessful'>
                    {'You can now '}
                    <NavLink to='/'> {'log in here.'} </NavLink>
                </p>}
            </div>
        );
    }
}

export default Register;