import React, { Component } from 'react'
import axios from 'axios';
import Home from './Home';
import ShoppingCart from './ShoppingCart';
import '../Css/ViewItems.css';

class ViewItems extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: this.props.username,
            email: this.props.email,
            role: this.props.role,
            showDashboard: this.props.showDashboard,
            viewItems: this.props.viewItems,
            fetchedItems: [],
            search: '',
            showCategories: false,
            category: '',
            condition: '',
            minPrice: '',
            maxPrice: '',
            shoppingCart: [],
            showShoppingCart: false,
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
        const category = event.target.innerText;
        this.setState({
            category,
            showCategories: false
        });
        try {
            const response = await axios.get(`http://localhost:5000/home/fetchItems?category=${category}`);
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    handleMinPriceChange = async (event) => {
        const minPrice = event.target.value;
        this.setState({ minPrice });
        const { category, maxPrice, condition, search } = this.state;

        try {
            let url = `http://localhost:5000/home/fetchItems?`;
            if (category) {
                url += `category=${category}&`;
            }
            if (minPrice) {
                url += `minPrice=${minPrice}&`;
            }
            if (maxPrice) {
                url += `maxPrice=${maxPrice}&`;
            }
            if (condition) {
                url += `condition=${condition}&`;
            }
            if (search) {
                url += `search=${search}&`;
            }
            const response = await axios.get(url);
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    handleMaxPriceChange = async (event) => {
        const maxPrice = event.target.value;
        this.setState({ maxPrice });
        const { category, minPrice, condition, search } = this.state;

        try {
            let url = `http://localhost:5000/home/fetchItems?`;
            if (category) {
                url += `category=${category}&`;
            }
            if (minPrice) {
                url += `minPrice=${minPrice}&`;
            }
            if (maxPrice) {
                url += `maxPrice=${maxPrice}&`;
            }
            if (condition) {
                url += `condition=${condition}&`;
            }
            if (search) {
                url += `search=${search}&`;
            }
            const response = await axios.get(url);
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    handleConditionChange = async (event) => {
        const condition = event.target.value;
        this.setState({ condition });
        const { category, minPrice, maxPrice, search } = this.state;

        try {
            let url = `http://localhost:5000/home/fetchItems?`;
            if (category) {
                url += `category=${category}&`;
            }
            if (minPrice) {
                url += `minPrice=${minPrice}&`;
            }
            if (maxPrice) {
                url += `maxPrice=${maxPrice}&`;
            }
            if (condition) {
                url += `condition=${condition}&`;
            }
            if (search) {
                url += `search=${search}&`;
            }
            const response = await axios.get(url);
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    handleSearchbarChange = async (event) => {
        const search = event.target.value;
        this.setState({ search });

        const { category, minPrice, maxPrice, condition } = this.state;

        try {
            let url = `http://localhost:5000/home/fetchItems?`;
            if (category) {
                url += `category=${category}&`;
            }
            if (minPrice) {
                url += `minPrice=${minPrice}&`;
            }
            if (maxPrice) {
                url += `maxPrice=${maxPrice}&`;
            }
            if (condition) {
                url += `condition=${condition}&`;
            }
            if (search) {
                url += `search=${search}&`;
            }
            const response = await axios.get(url);
            this.setState({ fetchedItems: response.data });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    handleClearFiltersClick = () => {
        this.setState({
            category: '',
            minPrice: '',
            maxPrice: '',
            condition: '',
            search: '',
        });
        this.fetchItems();
    };

    handleAddToCartButtonClick = item => {
        const cartItem = { title: item.item.title, count: 1 };

        try {
            axios.post('http://localhost:5000/home/saveItemsInShoppingCart', {
                email: this.state.email,
                cartItem
            });
        }
        catch (error) {
            console.error('Error adding item to shopping cart:', error);
        }
    };

    handleShoppingCartClick = () => {
        this.setState({
            viewItems: false,
            showShoppingCart: true
        })
    };

    render() {
        const { viewItems, fetchedItems, search, condition, showCategories, showShoppingCart } = this.state;

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
            <div>
                {viewItems &&
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
                                onChange={event => this.handleSearchbarChange(event)}
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
                                                    onChange={event => this.handleMinPriceChange(event)}
                                                >
                                                </input>
                                                <div className='priceSeparator'>-</div>
                                                <input
                                                    type='text'
                                                    className='priceLimit'
                                                    onChange={event => this.handleMaxPriceChange(event)}
                                                >
                                                </input>
                                            </div>
                                        </div>
                                        <div className='conditionFilter'>
                                            <div className='conditionFilterLabel'>Condition: </div>
                                            <label className='conditionOption'>
                                                <input
                                                    type='radio'
                                                    value='Brand new'
                                                    checked={condition === 'Brand new'}
                                                    onChange={event => this.handleConditionChange(event)}
                                                />
                                                Brand new
                                            </label>
                                            <label className='conditionOption'>
                                                <input
                                                    type='radio'
                                                    value='Unpacked'
                                                    checked={condition === 'Unpacked'}
                                                    onChange={event => this.handleConditionChange(event)}
                                                />
                                                Unpacked
                                            </label>
                                            <label className='conditionOption'>
                                                <input
                                                    type='radio'
                                                    value='Damaged'
                                                    checked={condition === 'Damaged'}
                                                    onChange={event => this.handleConditionChange(event)}
                                                />
                                                Damaged
                                            </label>
                                        </div>
                                    </div>
                                }
                                <button
                                    className='button clearFiltersButton'
                                    onClick={this.handleClearFiltersClick}
                                >
                                    Clear filters
                                </button>
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
                                            <div className='itemPrice'>Price: {'$' + item.item.price}</div>
                                            <button
                                                className='button addToCartButton'
                                                onClick={() => this.handleAddToCartButtonClick(item)}
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
                }
                {
                    showShoppingCart &&
                    <ShoppingCart
                        username={this.state.username}
                        email={this.state.email}
                        role={this.state.role}
                        showShoppingCart={showShoppingCart}
                        viewItems={viewItems}
                    />
                }
            </div>
        )
    }
}

export default ViewItems