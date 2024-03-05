import React, { Component } from 'react';
import axios from 'axios';
import '../Css/ShoppingCart.css';

class ShoppingCart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: this.props.email,
            viewItems: this.props.viewItems,
            showShoppingCart: this.props.showShoppingCart,
            shoppingCart: []
        }
    }
    componentDidMount() {
        this.fetchItems();
    }

    fetchItems = async () => {
        const { email } = this.state;
        try {
            const response = await axios.get('http://localhost:5000/home/fetchItemsInShoppingCart', {
                params: {
                    email
                }
            });
            const shoppingCartItems = response.data;

            const fetchedItemsInArray = shoppingCartItems[0].shoppingCart;

            const itemsTitles = fetchedItemsInArray.map(item => item.title);

            const detailedInformation = await axios.get('http://localhost:5000/home/fetchDetailedInformation', {
                params: {
                    itemsTitles: itemsTitles
                }
            });

            const detailedInformationArray = detailedInformation.data;
            const shoppingCart = detailedInformationArray.map(cartItem => cartItem[0].item);

            this.setState({ shoppingCart });
        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    render() {
        const { showShoppingCart, shoppingCart } = this.state;
        return (
            <div>
                {showShoppingCart &&
                    <div className='shoppingCart'>
                        {shoppingCart.map((item, index) => (
                        <div key={index} className='itemInShoppingCart'>
                            <div className='itemImageContainerInShoppingCart'>
                                <img
                                    className='itemImageInShoppingCart'
                                    src={item.imageURL ? item.imageURL : 'https://i.imgur.com/elj4mNd.png'}
                                    alt='alt'></img>
                            </div>
                            <div className='itemTitleAndPriceContainerInShoppingCart'>
                                <div className='itemTitleInShoppingCart'>
                                    {item.title}
                                </div>
                                <div className='itemPriceInShoppingCart'>
                                    Price: {item.price}
                                </div>
                            </div>
                        </div>
                        )
                        )}
                    </div>
                }
            </div>
        )
    }
}

export default ShoppingCart;
