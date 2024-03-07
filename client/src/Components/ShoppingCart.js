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
            shoppingCart: [],
            itemCount: [],
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
            const itemCount = fetchedItemsInArray.map(item => item.count);
            this.setState({ itemCount });

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

    incrementItemCount = index => {
        const updatedItemCount = [...this.state.itemCount];

        updatedItemCount[index]++;
        this.setState({ itemCount: updatedItemCount });
        console.log(updatedItemCount);
    };

    decrementItemCount = index => {
        const updatedItemCount = [...this.state.itemCount];

        if (updatedItemCount[index] > 0) {
            updatedItemCount[index]--;

            this.setState({ itemCount: updatedItemCount });
        }
    };

    render() {
        const { showShoppingCart, shoppingCart, itemCount } = this.state;
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
                                        alt='preview'></img>
                                </div>
                                <div className='itemInfoContainerInShoppingCart'>
                                    <div className='itemTitleInShoppingCart'>
                                        {item.title}
                                    </div>
                                    <div className='itemCountAndPriceInShoppingCart'>
                                        <div className='countContainerInShoppingCart'>
                                            <div className='itemCountUpperRow'>
                                                Count:
                                            </div>
                                            <div className='itemCountBottomRow'>
                                                <div className='decrementButtonDiv'>
                                                    <button
                                                        className='decrementButton'
                                                        onClick={() => this.decrementItemCount(index)}
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                                <div className='countValue'>
                                                    {this.state.itemCount[index]}
                                                </div>
                                                <div className='incrementButtonDiv'>
                                                    <button
                                                        className='incrementButton'
                                                        onClick={() => this.incrementItemCount(index)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='itemPriceInShoppingCart'>
                                            Price: {item.price * itemCount[index]}
                                        </div>
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
