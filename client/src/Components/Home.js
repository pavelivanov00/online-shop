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
            roleList: [],
            areAccountToggled: false
        }
    }
    getAccounts = async () => {
        try {
            const result = await axios.get('http://localhost:5000/home/getaccounts');
            const accountList = result.data.map(account => account.email);
            const roleList = result.data.map(account => account.role);
            this.setState({
                accountList,
                roleList
            });
        } catch (error) {
            console.error('Error during querying accounts:', error);
        }
    }

    render() {
        const { role, email, username, accountList, roleList, areAccountToggled } = this.state
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
                        <button
                            className='dashboardButton'
                            onClick={() => {
                                this.getAccounts();
                                this.setState({ areAccountToggled: true });
                            }}>
                            Change roles
                        </button>
                    </div>
                }
                {(accountList && role === 'administrator') &&
                    <div>
                        {accountList.map((account, index) => (
                            <div className='accounts' key={index}>
                                <p key={index}>{account}</p>
                                <select defaultValue={roleList[index]} className='selectRoleElement'>
                                    <option>customer</option>
                                    <option>manager</option>
                                    <option>administrator</option>
                                </select>
                                <button className='deleteButton'>X</button>
                            </div>
                        ))}
                        {areAccountToggled && <div className='center'>
                            <button className='saveButton'>Save</button>
                        </div>}
                    </div>
                }
            </div>
        )
    }
}

export default Home