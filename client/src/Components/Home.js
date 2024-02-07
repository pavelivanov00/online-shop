import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
            showDashboard: true,
            showListItemMenu: false,
            item: {
                title: '',
                tag: '',
                quantity: '',
                price: '',
                description: ''
            },
            serverResponseListItem: '',
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

    handleListItemsClick = () => {
        this.setState({
            showDashboard: false,
            showListItemMenu: true
        });
    };

    handleGoBackClick = () => {
        this.setState({
            showDashboard: true,
            showListItemMenu: false
        });
    };

    handleSaveItemClick = async () => {
        const { item } = this.state;
        console.log(item);

        const response = await axios.post('http://localhost:5000/home/saveItem', {
            item
        });
        this.setState({
            serverResponseListItem: response.data,
            item: {
                title: '',
                tag: '',
                quantity: '',
                price: '',
                description: ''
            },
        });
    };

    render() {
        const { role, email, username, accountList, roleList, areAccountsToggled, serverResponseUpdateAccount,
            showDashboard, showListItemMenu, serverResponseListItem } = this.state;

        const categoryTags = [
            'Apparel',
            'Electronics',
            'Home and Garden',
            'Toys',
            'Books',
            'Health and Beauty',
            'Sports and Outdoors',
            'Food and Groceries',
            'Automotive',
            'Pet Supplies'
        ];

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
                                <button className='dashboardButton'>View items</button>
                                <br />
                                <button className='dashboardButton' onClick={this.handleListItemsClick}>List items</button>
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
                {showListItemMenu &&
                    <div className='listItemMenu'>
                        <button className='dashboardButton marginBottom' onClick={this.handleGoBackClick}>Go back</button>
                        <br />
                        <div>
                            <label htmlFor='title' className='title'>Title</label>
                            <input
                                type='text'
                                // onBlur={event => this.handleTitleBlur(event)}
                                onChange={event => this.setState({
                                    item: {
                                        ...this.state.item,
                                        title: event.target.value
                                    }
                                })}
                                value={this.state.item.title}
                                id='title'
                                className='titleTextbox'
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='tag' className='tag'>Tag</label>
                            <select
                                onChange={event => this.setState({
                                    item: {
                                        ...this.state.item,
                                        tag: event.target.value
                                    }
                                })}
                                value={this.state.item.tag}
                                id='tag'
                                className='tagSelect'
                            >
                                {categoryTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div>
                            <label htmlFor='quantity' className='quantity'>Quantity</label>
                            <input
                                type='text'
                                // onBlur={event => this.handleQuantityBlur(event)}
                                onChange={event => this.setState({
                                    item: {
                                        ...this.state.item,
                                        quantity: event.target.value
                                    }
                                })}
                                value={this.state.item.quantity}
                                id='quantity'
                                className='quantityTextbox'
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='price' className='price'>Price</label>
                            <input
                                type='text'
                                onChange={event => this.setState({
                                    item: {
                                        ...this.state.item,
                                        price: event.target.value
                                    }
                                })}
                                value={this.state.item.price}
                                id='price'
                                className='priceTextbox'
                            />
                        </div>
                        <br />
                        <div className='divDescription'>
                            <label htmlFor='description' className='description'>Description</label>
                            <textarea
                                onChange={event => this.setState({
                                    item: {
                                        ...this.state.item,
                                        description: event.target.value
                                    }
                                })}
                                value={this.state.item.description}
                                id='description'
                                className='descriptionTextarea'
                            />
                        </div>
                        <div className='center'>
                            <button className='saveButton' onClick={this.handleSaveItemClick}>Save Item</button>
                        </div>
                        {serverResponseListItem &&
                            <div className={serverResponseListItem === 'The item was listed.' ? 'successfulItemList' : 'itemListError'}>
                                {serverResponseListItem}
                            </div>
                        }
                    </div>
                }
            </div>
        )

    }
}

export default Home