import React, { Component } from 'react';
import axios from 'axios';
import '../Css/Home.css';

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            role: this.props.role,
            username: this.props.username,
            email: this.props.email,
            accountList: [],
        }
    }
    getAccounts = async () => {
        try {
            const result = await axios.get('http://localhost:5000/home/getaccounts');
            this.setState({ accountList: result.data });
        } catch (error) {
            console.error('Error during querying accounts:', error);
        }
    }

    render() {
        const { role, email, username, accountList } = this.state
        return (
            <div>
                <div className='userInfo'>
                    <p>username: {username}</p>
                    <p>email: {email}</p>
                    <p>account role: {role}</p>
                </div>
                {(role === 'administrator') &&
                    <div className='dashboard'>
                        <button className='dashboardButton'>View items</button>
                        <br />
                        <button className='dashboardButton' onClick={this.getAccounts}>Change roles</button>
                    </div>
                }
                {(accountList && role === 'administrator') &&
                    accountList.map((account, index) => (
                        <div className='accounts' key={index}>
                            <p key={index}>{account}</p>
                            <button className='deleteButton'>X</button>
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default Home