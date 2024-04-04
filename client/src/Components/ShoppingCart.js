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
            shoppingCartDetailed: [],
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

            const fetchedItemsArray = response.data[0].shoppingCart;

            const itemsTitles = fetchedItemsArray.map(item => item.title);
            const itemCount = fetchedItemsArray.map(item => item.count);

            this.setState({ itemCount: itemCount });

            const detailedResponse = await axios.get('http://localhost:5000/home/fetchDetailedInformation', {
                params: {
                    itemsTitles
                }
            });

            const shoppingCartDetailed = detailedResponse.data.map(cartItem => cartItem[0].item);

            this.setState({ shoppingCartDetailed });
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
        const { shoppingCartDetailed, itemCount } = this.state;
        if (prevState.shoppingCartDetailed !== shoppingCartDetailed || prevState.itemCount !== itemCount) {
            const finalPrice = shoppingCartDetailed.reduce((sum, item, index) => sum + itemCount[index] * item.price, 0);
            this.setState({ finalPrice });
        }
    };

    handleGoBackButtonClick = () => {
        this.setState({
            viewItems: true,
            showShoppingCart: false
        })
    };

    handleRemoveItem = async (index) => {
        const { shoppingCartDetailed, itemCount } = this.state;

        const updatedShoppingCart = [...shoppingCartDetailed];
        const updatedItemCount = [...itemCount];

        const itemToBeRemoved = updatedShoppingCart[index].title;

        updatedShoppingCart.splice(index, 1);
        updatedItemCount.splice(index, 1);
        this.setState({
            shoppingCartDetailed: updatedShoppingCart,
            itemCount: updatedItemCount
        });

        try {
            await axios.post('http://localhost:5000/home/removeItemFromShoppingCart', {
                itemToBeRemoved
            });
        }
        catch (error) {
            console.error('Error while removing item:', error);
        }
    };

    handleOrderClick = async () => {
        const { itemCount, shoppingCartDetailed, finalPrice, email } = this.state;

        if (itemCount.length !== shoppingCartDetailed.length) {
            throw new Error('Arrays must have the same length.');
        }

        const items = shoppingCartDetailed.map((item, index) => {
            return {
                itemCount: itemCount[index],
                itemTitle: item.title,
                price: item.price * itemCount[index]
            };
        });

        const date = new Date();

        const order = {
            email: email,
            shoppingCart: items,
            finalPrice: finalPrice,
            date: date
        }

        try {
            const response = await axios.post('http://localhost:5000/home/saveOrder', {
                order
            });
            const orderResponse = response.data;
            this.setState({ orderResponse });

            if (orderResponse === 'The order was successful') {
                try {
                    const response = await axios.post('http://localhost:5000/home/clearShoppingCart', {
                        email
                    });
                    if (response.data === 'Shopping cart cleared successfully')
                        this.setState({
                            shoppingCartDetailed: [],
                            itemCount: [],
                            finalPrice: ''
                        })
                } catch (error) {
                    console.error('Error while clearing shopping cart', error);
                }
            }
        }
        catch (error) {
            console.error('Error while placing order:', error);
        }
    };

    render() {
        const { showShoppingCart, shoppingCartDetailed, itemCount, finalPrice, viewItems, orderResponse } = this.state;
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

                        {shoppingCartDetailed.length === 0 ?
                            (orderResponse.length !== 0) ?
                                <div className={`orderResponse ${orderResponse !== 'The order was successful' ? 'colorRed' : ''}`}>
                                    {orderResponse}
                                </div>
                                :
                                (<div className='emptyShoppingCart'>Your shopping cart is empty</div>)
                            :
                            (<div className='shoppingCart'>
                                {shoppingCartDetailed.map((item, index) => (
                                    <div key={index} className='itemInShoppingCart'>
                                        <div className='itemImageContainerInShoppingCart'>
                                            <img
                                                className='itemImageInShoppingCart'
                                                src={item.imageURL ? item.imageURL : 'https://i.imgur.com/elj4mNd.png'}
                                                alt='preview'>
                                            </img>
                                        </div>
                                        <div className='itemInfoContainerInShoppingCart'>
                                            <div className='itemTitleInShoppingCart'>
                                                {item.title}
                                            </div>
                                            <div className='itemCountAndPriceInShoppingCart'>
                                                <div className='itemPriceInShoppingCart'>
                                                    Price: ${item.price * itemCount[index]}
                                                </div>
                                                <br />
                                                <div className='itemCountContainer'>
                                                    <button
                                                        className='decrementButton'
                                                        onClick={() => this.decrementItemCount(index)}
                                                    >
                                                        -
                                                    </button>
                                                    <div className='countValue'>
                                                        {itemCount[index]}
                                                    </div>
                                                    <button
                                                        className='incrementButton'
                                                        onClick={() => this.incrementItemCount(index)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <br />
                                                <button
                                                    className='removeItemFromShoppingCart'
                                                    onClick={() => this.handleRemoveItem(index)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                                )
                                }
                            </div>
                            )
                        }

                        <button
                            className='orderButton'
                            onClick={this.handleOrderClick}
                        >
                            Order now
                        </button>

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
