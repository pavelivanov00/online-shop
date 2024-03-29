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
                category: 'Choose category',
                condition: 'Choose condition',
                quantity: '',
                price: '',
                imageURL: '',
                description: ''
            },
            itemTitleError: 'Item title must be longer than 3 characters and shorter than 100',
            itemCategoryError: 'Category is not chosen',
            itemConditionError: 'Condition is not chosen',
            itemQuantityError: 'Item quantity must be a number and be 0 or greater',
            itemPriceError: 'Item price must be a number and be 0 or greater',
            showListAnItemErrors: false,
            serverResponseListAnItem: '',
            showServerResponse: false,
        }
    };

    handleGoBackClick = () => {
        this.setState({
            showDashboard: true,
            showListAnItem: false
        });
    };

    validateInputs = async () => {
        const { item } = this.state;
        const title = item.title;
        if (title.length < 4 || title.length > 100) this.setState({
            itemTitleError: 'Item title must be longer than 3 characters and shorter than 100'
        });
        else this.setState({ itemTitleError: '' });

        const category = item.category;
        if (category === 'Choose category') this.setState({ itemCategoryError: 'Category is not chosen' });
        else this.setState({ itemCategoryError: '' });

        const condition = item.condition;
        if (condition === 'Choose condition') this.setState({ itemConditionError: 'Condition is not chosen' });
        else this.setState({ itemConditionError: '' });

        const quantity = parseInt(item.quantity);
        if (isNaN(quantity) || quantity < 0) this.setState({
            itemQuantityError: 'Item quantity must be a number and be 0 or greater'
        });
        else this.setState({ itemQuantityError: '' });

        const priceString = item.price.replace(/[^0-9]/g, '');
        const price = parseFloat(priceString);
        if (isNaN(price) || price < 0) this.setState({
            itemPriceError: 'Item price must be a number and be 0 or greater'
        });
        else this.setState({ itemPriceError: '' });
    };

    handleSaveItemClick = async () => {
        await this.validateInputs();
        const { item, itemTitleError, itemCategoryError, itemConditionError, itemQuantityError, itemPriceError } = this.state;

        if (itemTitleError || itemQuantityError || itemPriceError || itemCategoryError || itemConditionError) {
            this.setState({ showListAnItemErrors: true })
            return;
        }

        const response = await axios.post('http://localhost:5000/home/saveItem', {
            item
        });
        this.setState({
            item: {
                title: '',
                category: 'Choose category',
                condition: 'Choose condition',
                quantity: '',
                price: '',
                imageURL: '',
                description: ''
            },

            itemTitleError: 'Item title must be longer than 3 characters and shorter than 100',
            itemCategoryError: 'Category is not chosen',
            itemConditionError: 'Condition is not chosen',
            itemQuantityError: 'Item quantity must be a number and be 0 or greater',
            itemPriceError: 'Item price must be a number and be 0 or greater',
            showListAnItemErrors: false,
            serverResponseListAnItem: response.data,
            showServerResponse: true,
        });
    };

    render() {
        const { showListAnItem, showDashboard, item, itemTitleError, itemCategoryError, itemConditionError,
            itemQuantityError, itemPriceError, showListAnItemErrors, serverResponseListAnItem, showServerResponse } = this.state;
        const categories = [
            'Electronics',
            'Home and Garden',
            'Toys',
            'Books',
            'Health and Beauty',
            'Sports and Outdoors',
            'Automotive',
            'Pet Supplies'
        ];

        const conditions = [
            'Brand new',
            'Unpacked',
            'Damaged'
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
                                onChange={event => this.setState({
                                    item: {
                                        ...item,
                                        title: event.target.value
                                    },
                                    showServerResponse: false
                                })}
                                value={item.title}
                                id='title'
                                className='titleTextbox'
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='category' className='category'>Category</label>
                            <select
                                onChange={event => this.setState({
                                    item: {
                                        ...item,
                                        category: event.target.value
                                    },
                                    showServerResponse: false
                                })}
                                value={item.category}
                                id='category'
                                className='categorySelect'
                            >
                                <option value='Choose category'>Choose category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div>
                            <label htmlFor='condition' className='condition'>Condition</label>
                            <select
                                onChange={event => this.setState({
                                    item: {
                                        ...item,
                                        condition: event.target.value
                                    },
                                    showServerResponse: false
                                })}
                                value={item.condition}
                                id='condition'
                                className='conditionSelect'
                            >
                                <option value='Choose condition'>Choose condition</option>
                                {conditions.map(condition => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>
                        </div>
                        <br />
                        <div>
                            <label htmlFor='quantity' className='quantity'>Quantity</label>
                            <input
                                type='text'
                                onChange={event => this.setState({
                                    item: {
                                        ...item,
                                        quantity: event.target.value
                                    },
                                    showServerResponse: false
                                })}
                                value={item.quantity}
                                id='quantity'
                                className='quantityTextbox'
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='price' className='price'>Price</label>
                            <input
                                type='text'
                                onChange={event => {
                                    const price = event.target.value;
                                    this.setState({
                                        item: {
                                            ...item,
                                            price: item.price.startsWith("$") ? price : "$" + price
                                        },
                                        showServerResponse: false
                                    })
                                }}
                                value={item.price}
                                id='price'
                                className='priceTextbox'
                            />
                        </div>
                        <br />
                        <div>
                            <label htmlFor='imageURL' className='imageURL'>Image URL (if available)</label>
                            <input
                                type='text'
                                onChange={event => this.setState({
                                    item: {
                                        ...item,
                                        imageURL: event.target.value
                                    },
                                    showServerResponse: false
                                })}
                                value={item.imageURL}
                                id='imageURL'
                                className='imageURLTextbox'
                            />
                        </div>
                        <br />
                        <div className='divDescription'>
                            <label htmlFor='description' className='description'>Description</label>
                            <textarea
                                onChange={event => this.setState({
                                    item: {
                                        ...item,
                                        description: event.target.value
                                    },
                                    showServerResponse: false
                                })}
                                value={item.description}
                                id='description'
                                className='descriptionTextarea'
                            />
                        </div>
                        <div>
                            <button className='saveItemButton' onClick={this.handleSaveItemClick}>Save Item</button>
                        </div>
                        {showServerResponse &&
                            <div className={serverResponseListAnItem === 'The item was listed.' ? 'successfulListing' : 'errorListing'}>
                                {serverResponseListAnItem}
                            </div>
                        }
                        {showListAnItemErrors &&
                            <div className='listAnItemErrors'>
                                <p>{itemTitleError}</p>
                                <p>{itemCategoryError}</p>
                                <p>{itemConditionError}</p>
                                <p>{itemQuantityError}</p>
                                <p>{itemPriceError}</p>
                            </div>
                        }
                        <div className='previewItem'>
                            <div className='infoContainer'>
                                <div className='titleContainer'>
                                    Title: {item.title}
                                </div>
                                <div className='categoryContainer'>
                                    Category: {item.category !== 'Choose category' ? item.category : ''}
                                </div>
                                <div className='conditionContainer'>
                                    Condition: {item.condition !== 'Choose condition' ? item.condition : ''}
                                </div>
                                <div className='quantityContainer'>
                                    Quantity: {item.quantity}
                                </div>
                                <div className='priceContainer'>
                                    Price: {item.price}
                                </div>
                                <div className='descriptionContainer'>
                                    Description: {item.description}
                                </div>
                            </div>
                            {item.imageURL &&
                                <div className='imageContainer'>
                                    <img src={item.imageURL} alt='preview' className='image'></img>
                                </div>
                            }
                        </div>
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
