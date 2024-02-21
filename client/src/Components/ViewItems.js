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
            filterByCondition: '',
            minPrice: '',
            maxPrice: '',
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

    handleCategoryPick = async (event) => {
        this.setState({ showCategories: false });
        const category = event.target.innerText;
        try {
            const response = await axios.get(`http://localhost:5000/home/fetchItems?category=${category}`);
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    render() {
        const { viewItems, fetchedItems, search, filterByCondition, showCategories } = this.state;

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
                                {categories.map((category, index) =>
                                    <button
                                        key={index}
                                        className='categoryFilter button'
                                        onClick={event => this.handleCategoryPick(event)}
                                    >
                                        {category}
                                    </button>
                                )}
                            </div>
                            :
                            <div className='filters'>
                                <div className='priceFilter'>
                                    <div className='priceFilterLabel'>Price:</div>
                                    <div className='priceFilterContainer'>
                                        <input
                                            type='text'
                                            className='priceLimit'
                                            onChange={event => this.setState({ minPrice: event.target.value })}
                                        >
                                        </input>
                                        <div className='priceSeparator'>-</div>
                                        <input
                                            type='text'
                                            className='priceLimit'
                                            onChange={event => this.setState({ minPrice: event.target.value })}
                                        >
                                        </input>
                                    </div>
                                </div><div className='conditionFilter'>
                                    <div className='conditionFilterLabel'>Condition: </div>
                                    <label className='conditionOption'>
                                        <input
                                            type='radio'
                                            value='Brand new'
                                            checked={filterByCondition === 'Brand new'}
                                            onChange={event => this.setState({ filterByCondition: event.target.value })}
                                        />
                                        Brand new
                                    </label>
                                    <label className='conditionOption'>
                                        <input
                                            type='radio'
                                            value='Unpacked'
                                            checked={filterByCondition === 'Unpacked'}
                                            onChange={event => this.setState({ filterByCondition: event.target.value })}
                                        />
                                        Unpacked
                                    </label>
                                    <label className='conditionOption'>
                                        <input
                                            type='radio'
                                            value='Damaged'
                                            checked={filterByCondition === 'Damaged'}
                                            onChange={event => this.setState({ filterByCondition: event.target.value })}
                                        />
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