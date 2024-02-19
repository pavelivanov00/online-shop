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

    render() {
        const { viewItems, fetchedItems, search } = this.state;
        return (
            viewItems &&
            <div>
                <div className='navigation'>
                    <input
                        type='text'
                        onChange={event => this.setState({ search: event.target.value })}
                        className='searchbar'
                        placeholder="Search"
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
        )
    }
}

export default ViewItems