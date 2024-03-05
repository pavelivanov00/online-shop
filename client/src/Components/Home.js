import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ListAnItem from './ListAnItem';
import ViewItems from './ViewItems';
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
            serverResponseUpdateAccount: '',
            accountsToBeDeleted: [],

            showDashboard: this.props.showDashboard || true,
            showListAnItem: this.props.showListAnItem || false,

            viewItems: false
        }
    }
    getAccounts = async () => {
        try {
            const result = await axios.get('http://localhost:5000/home/getAccounts');
            const accountList = result.data.map(account => account.email);
            const roleList = result.data.map(account => account.role);
            this.setState({
                accountList,
                roleList
            });
        } catch (error) {
            console.error('Error while querying accounts:', error);
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

        const response = await axios.post('http://localhost:5000/home/updateAccounts', {
            updatedAccounts,
            accountsToBeDeleted
        });
        this.setState({
            serverResponseUpdateAccount: response.data,
            updatedAccounts: {},
            accountsToBeDeleted: []
        });
    };

    handleListAnItemClick = () => {
        this.setState({
            showDashboard: false,
            showListAnItem: true
        });
    };

    handleViewItemsClick = () => {
        this.setState({
            showDashboard: false,
            viewItems: true
        });
    }

    render() {
        const { role, email, username, accountList, roleList, areAccountsToggled,
            serverResponseUpdateAccount, showDashboard, showListAnItem, viewItems } = this.state;

        return (
            <div className='mainContainer'>
                {showDashboard &&
                    <div>
                        <div className='userInfo'>
                            <p>username: {username}</p>
                            <p>email: {email}</p>
                            <p>account role: {role}</p>
                        </div>
                        {(role === 'administrator' || role === 'manager') &&
                            <div className='dashboard'>
                                <button className='dashboardButton' onClick={this.handleViewItemsClick}>View items</button>
                                <br />
                                <button className='dashboardButton' onClick={this.handleListAnItemClick}>List an item</button>
                                <br />
                                {role === 'administrator' &&
                                    <button
                                        className='dashboardButton'
                                        onClick={() => {
                                            this.getAccounts();
                                            this.setState(prevState => ({ areAccountsToggled: !prevState.areAccountsToggled }));
                                        }}>
                                        Change roles
                                    </button>
                                }
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
                                {areAccountsToggled &&
                                    <div className='center'>
                                        <button className='saveButton' onClick={this.handleSaveButtonClick}>Save</button>
                                    </div>}
                            </div>
                        }
                        {serverResponseUpdateAccount && areAccountsToggled &&
                            <div className={serverResponseUpdateAccount === 'Operation successful.' ? 'successfulUpdate' : 'updateError'}>
                                {serverResponseUpdateAccount}
                            </div>
                        }
                        {(role === 'administrator' || role === 'manager') &&
                            <div className='center'>
                                <Link to="/" className="logoutButton">Log out</Link>
                            </div>
                        }
                    </div>
                }
                {showListAnItem &&
                    <ListAnItem
                        username={username}
                        email={email}
                        role={role}
                        showDashboard={showDashboard}
                        showListAnItem={showListAnItem}
                    />
                }
                {viewItems &&
                    <ViewItems
                        username={username}
                        email={email}
                        role={role}
                        showDashboard={showDashboard}
                        viewItems={viewItems}
                    />
                }
            </div>
        )
    }
}

export default Home