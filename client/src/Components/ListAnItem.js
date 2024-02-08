import React, { Component } from 'react';
import axios from 'axios';
import Home from './Home';
import '../Css/ListAnItem.css';

class ListAnItem extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showDashboard: this.props.showDashboard,
            showListAnItem: this.props.showListAnItem,
            item: {
                title: '',
                tag: '',
                quantity: '',
                price: '',
                description: ''
            },
            serverResponseListAnItem: '',
            listAnItemErrors: [],
            itemTitleError: '',
            itemQuantityError: '',
            itemPriceError: '',
            showListAnItemErrors: false,
        }
    };

    handleGoBackClick = () => {
        this.setState({
            showDashboard: true,
            showListAnItem: false
        });
    };

    handleTitleBlur = event => {
        const title = event.target.value;
        if (title.length < 3 || title.length > 70) this.setState({
            itemTitleError: 'Item title must be longer than 3 characters and shorter than 70'
        });
        else this.setState({ itemTitleError: '' });
    };

    handleQuantityBlur = event => {
        const quantity = parseInt(event.target.value);

        if (isNaN(quantity) || quantity < 0) this.setState({
            itemQuantityError: 'Item quantity must be a number and be 0 or greater'
        });
        else this.setState({ itemQuantityError: '' });
    };

    handlePriceBlur = event => {
        const price = parseInt(event.target.value);

        if (isNaN(price) || price < 0) this.setState({
            itemPriceError: 'Item price must be a number and be 0 or greater'
        });
        else this.setState({ itemPriceError: '' });
    };

    handleSaveItemClick = async () => {
        const { item, itemTitleError, itemQuantityError, itemPriceError } = this.state;

        if (itemTitleError || itemQuantityError || itemPriceError) {
            return;
        }
        console.log(item);

        const response = await axios.post('http://localhost:5000/home/saveItem', {
            item
        });
        this.setState({
            serverResponseListAnItem: response.data,
            item: {
                title: '',
                tag: '',
                quantity: '',
                price: '',
                description: ''
            },
            itemTitleError: '',
            itemQuantityError: '',
            itemPriceError: ''
        });
    };

    render() {
        const { showListAnItem, showDashboard, serverResponseListAnItem, itemTitleError, 
            itemQuantityError, itemPriceError } = this.state;
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
            <div>
                {showListAnItem &&
                    <div className='listAnItemMenu'>
                        <div>
                            <button
                                className='dashboardButton'
                                onClick={this.handleGoBackClick}
                            >
                                Go back
                            </button>
                        </div>
                        <br />
                        <div>
                            <label htmlFor='title' className='title'>Title</label>
                            <input
                                type='text'
                                onBlur={event => this.handleTitleBlur(event)}
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
                                onBlur={event => this.handleQuantityBlur(event)}
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
                                onBlur={event => this.handlePriceBlur(event)}
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
                        <div>
                            <button className='saveButton' onClick={this.handleSaveItemClick}>Save Item</button>
                        </div>
                        {serverResponseListAnItem &&
                            <div className={serverResponseListAnItem === 'The item was listed.' ? 'successfulListing' : 'errorListing'}>
                                {serverResponseListAnItem}
                            </div>
                        }
                        {(itemTitleError || itemQuantityError || itemPriceError) &&
                            <div className='listAnItemErrors'>
                                <p>{itemTitleError}</p>
                                <p>{itemQuantityError}</p>
                                <p>{itemPriceError}</p>
                            </div>
                        }
                    </div>
                }
                {showDashboard &&
                    <Home
                        username={this.props.username}
                        email={this.props.email}
                        role={this.props.role}
                        showDashboard={showDashboard}
                        showListAnItem={showListAnItem}
                    />
                }
            </div>
        )
    }
}

export default ListAnItem;
