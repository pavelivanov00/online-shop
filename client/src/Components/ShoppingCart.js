import React, { Component } from 'react';
import '../Css/ShoppingCart.css';

class ShoppingCart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            shoppingCart: this.props.shoppingCart,
            viewItems: this.props.viewItems,
            showShoppingCart: this.props.showShoppingCart,
        }
    }
    render() {
        const { showShoppingCart, shoppingCart } = this.state;
        return (
            <div className='ddd'>
                {showShoppingCart &&
                    <div className='shoppingCart'>
                        {shoppingCart.map(item => (
                            <div className='itemInShoppingCart'>
                                <div className='itemImageContainerInShoppingCart'>
                                    <img
                                        className='itemImageInShoppingCart'
                                        src={item.item.imageURL}
                                        alt='alt'></img>
                                </div>
                                <div className='itemTitleAndPriceContainerInShoppingCart'>
                                    <div className='itemTitleInShoppingCart'>
                                        {item.item.title}
                                    </div>
                                    <div className='itemPriceInShoppingCart'>
                                        Price: {item.item.price}
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
