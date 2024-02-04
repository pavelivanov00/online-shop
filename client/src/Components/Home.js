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
            areAccountsToggled: false,
            updatedAccounts: {},
            serverResponse: '',
            accountsToBeDeleted: []
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
    };

    handleDeleteButtonClick = index => {
        const { accountList, accountsToBeDeleted } = this.state;

        if (accountList[index] === 'admin@admin.com') {
            alert("Cannot delete the administrator's account.");
            return;
        }
        const updatedAccountList = [...accountList];
        const deletedAccount = updatedAccountList.splice(index, 1)[0];

        const account = [...accountsToBeDeleted, deletedAccount];
        this.setState({
            accountList: updatedAccountList,
            accountsToBeDeleted: account
        })
    };

    handleRoleChange = (index, event) => {
        const newRole = event.target.value;
        const { accountList } = this.state;

        if (accountList[index] === 'admin@admin.com') {
            alert("Cannot change the administrator's role.");
            return;
        }
        this.setState(prevState => ({
            updatedAccounts: {
                ...prevState.updatedAccounts,
                [accountList[index]]: newRole,
            },
        }));
    };

    handleSaveButtonClick = async () => {
        const { updatedAccounts, accountsToBeDeleted } = this.state;
        console.log(accountsToBeDeleted);
        console.log(updatedAccounts);

        const response = await axios.post('http://localhost:5000/home/updateaccounts', {
            updatedAccounts,
            accountsToBeDeleted
        });
        this.setState({
            serverResponse: response.data,
            updatedAccounts: {},
            accountsToBeDeleted: []
        });
    };

    render() {
        const { role, email, username, accountList, roleList, areAccountsToggled, serverResponse } = this.state
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
                                this.setState(prevState => ({ areAccountsToggled: !prevState.areAccountsToggled }));
                            }}>
                            Change roles
                        </button>
                    </div>
                }
                {(areAccountsToggled && role === 'administrator') &&
                    <div>
                        {accountList.map((account, index) => (
                            <div className='accounts' key={index}>
                                <p key={index}>{account}</p>
                                <select
                                    defaultValue={roleList[index]}
                                    className='selectRoleElement'
                                    onChange={event => this.handleRoleChange(index, event)}
                                >
                                    <option>customer</option>
                                    <option>manager</option>
                                    <option>administrator</option>
                                </select>
                                <button
                                    className='deleteButton'
                                    onClick={() => this.handleDeleteButtonClick(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {areAccountsToggled && <div className='center'>
                            <button className='saveButton' onClick={this.handleSaveButtonClick}>Save</button>
                        </div>}
                    </div>
                }
                {serverResponse &&
                    <div className={serverResponse === 'Operation successful.' ? 'successfulUpdate' : 'updateError'}>
                        {serverResponse}
                    </div>
                }
            </div>
        )
    }
}

export default Home