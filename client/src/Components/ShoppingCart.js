import React, { Component } from 'react';
import axios from 'axios';
import '../Css/ShoppingCart.css';
import ViewItems from './ViewItems';

class ShoppingCart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: this.props.email,
            viewItems: this.props.viewItems,
            showShoppingCart: this.props.showShoppingCart,
            shoppingCart: [],
            itemCount: [],
            finalPrice: '',
            orderResponse: '',
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
    };

    decrementItemCount = index => {
        const updatedItemCount = [...this.state.itemCount];

        if (updatedItemCount[index] > 0) {
            updatedItemCount[index]--;

            this.setState({ itemCount: updatedItemCount });
        }
    };

    componentDidUpdate(prevProps, prevState) {
        const { shoppingCart, itemCount } = this.state;
        if (prevState.shoppingCart !== shoppingCart || prevState.itemCount !== itemCount) {
            const finalPrice = shoppingCart.reduce((sum, item, index) => sum + itemCount[index] * item.price, 0);
            this.setState({ finalPrice });
        }
    };

    handleGoBackButtonClick = () => {
        this.setState({
            viewItems: true,
            showShoppingCart: false
        })
    };

    handleOrderClick = async () => {
        const { itemCount, shoppingCart, finalPrice, email } = this.state;
        const order = {
            email: email,
            shoppingCart: shoppingCart,
            finalPrice: finalPrice
        }

        try {
            const response = await axios.post('http://localhost:5000/home/saveOrder', {
                order
            });
            const orderResponse = response.data;
            this.setState({ orderResponse });
        }
        catch (error) {
            console.error('Error while placing order:', error);
        }
    };

    render() {
        const { showShoppingCart, shoppingCart, itemCount, finalPrice, viewItems, orderResponse } = this.state;
        return (
            <div>
                {showShoppingCart &&
                    <div className='shoppingCartComponent'>
                        <button
                            className='goBackButtonInShoppingCart'
                            onClick={this.handleGoBackButtonClick}
                        >
                            Go back
                        </button>
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
                                                        {itemCount[index]}
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
                                                Price: ${item.price * itemCount[index]}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            )}

                            <div className='finalPrice'>
                                Final Price: ${finalPrice}
                            </div>
                        </div>
                        <button
                            className='orderButton'
                            onClick={this.handleOrderClick}
                        >
                            Order now
                        </button>
                        {orderResponse &&
                            <div className={`orderResponse ${orderResponse !== 'The order was successful' ? 'colorRed' : ''}`}>
                                {orderResponse}
                            </div>
                        }
                    </div>
                }
                {
                    viewItems &&
                    <ViewItems
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

export default ShoppingCart;
