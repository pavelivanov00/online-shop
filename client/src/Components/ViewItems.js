import React, { Component } from 'react'
import axios from 'axios';
import Home from './Home';
import '../Css/ViewItems.css';

class ViewItems extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showDashboard: this.props.showDashboard,
            viewItems: this.props.viewItems,
            fetchedItems: [],
            search: '',
            showCategories: false,
        }
    }
    componentDidMount() {
        this.fetchItems();
    };

    fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/home/fetchItems');
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };


    handleCategoriesToggle = () => {
        this.setState(prevState => ({ showCategories: !prevState.showCategories }));
    };

    handleCategoryPick = () => {
        this.setState({ showCategories: false });
    }

    render() {
        const { viewItems, fetchedItems, search, itemCondition, showCategories } = this.state;

        const categoryTags = [
            'Electronics',
            'Home and Garden',
            'Toys',
            'Books',
            'Health and Beauty',
            'Sports and Outdoors',
            'Automotive',
            'Pet Supplies'
        ];

        return (
            viewItems &&
            <div>
                <div className='navigation'>
                    <div>
                        <button
                            className='button toggleCategoriesButton'
                            onClick={this.handleCategoriesToggle}
                        >
                            Categories
                        </button>
                    </div>
                    <input
                        type='text'
                        onChange={event => this.setState({ search: event.target.value })}
                        className='searchbar'
                        placeholder='Search'
                        value={search}
                    >
                    </input>
                    <div className='rightside'>
                        <button
                            onClick={this.handleFavouritesClick}
                            className='favouriteItems marginLeft button'
                        >
                            Favourites
                        </button>
                        <button
                            onClick={this.handleShoppingCartClick}
                            className='shoppingCart marginLeft button'
                        >
                            Shopping cart
                        </button>
                        <button
                            onClick={this.handleUserInfoClick}
                            className='myProfile marginLeft button'
                        >
                            My profile
                        </button>
                    </div>
                </div>

                <div className='itemsAndFiltersContainer'>
                    <div className='leftPanel'>
                        {showCategories ?
                            <div className='categories'>
                                {categoryTags.map((tag, index) =>
                                    <button
                                        key={index}
                                        className='categoryFilter button'
                                        onClick={this.handleCategoryPick}
                                    >
                                        {tag}
                                    </button>
                                )}
                            </div>
                            :
                            <div className='filters'>
                                <div className='priceFilter'>
                                    <div className='priceFilterLabel'>Price:</div>
                                    <div className='priceFilterContainer'>
                                        <input type='text' className='priceLimit'></input>
                                        <div className='priceSeparator'>-</div>
                                        <input type='text' className='priceLimit'></input>
                                    </div>
                                </div><div className='conditionFilter'>
                                    <div className='conditionFilterLabel'>Condition: </div>
                                    <label className='conditionOption'>
                                        <input
                                            type='radio'
                                            value='brand new'
                                            checked={itemCondition === 'brand new'}
                                            onChange={this.handleConditionChange} />
                                        Brand new
                                    </label>
                                    <label className='conditionOption'>
                                        <input
                                            type='radio'
                                            value='unpacked'
                                            checked={itemCondition === 'unpacked'}
                                            onChange={this.handleConditionChange} />
                                        Unpacked
                                    </label>
                                    <label className='conditionOption'>
                                        <input
                                            type='radio'
                                            value='damaged'
                                            checked={itemCondition === 'damaged'}
                                            onChange={this.handleConditionChange} />
                                        Damaged
                                    </label>
                                </div>
                            </div>
                        }
                    </div>
                    <div className='itemsContainer'>
                        {fetchedItems.map((item, index) =>
                            <div key={index} className='item'>
                                <div className='adjustImage'>
                                    <img
                                        src={item.item.imageURL ? item.item.imageURL : 'https://i.imgur.com/elj4mNd.png'}
                                        className='itemImage'
                                        alt='test'>
                                    </img>
                                </div>
                                <div className='itemTitle'>{item.item.title}</div>

                                <div className='priceAndCartContainer'>
                                    <div className='itemPrice'>Price: {item.item.price}</div>
                                    <button
                                        className='button addToCartButton'
                                        onClick={this.handleAddToCartButtonClick}
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        )
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default ViewItems