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
            <div className='shoppingCart'>
                {showShoppingCart &&
                    <div>
                        {shoppingCart.map(item => (
                            <div className='item'>
                                <div>
                                    <img className='itemImage' src={item.item.imageURL} alt='text'></img>
                                </div>
                                <div className='itemTitle'>
                                    {item.item.title}
                                </div>
                                <div className='itemPrice'>
                                    Price: {item.item.price}
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
