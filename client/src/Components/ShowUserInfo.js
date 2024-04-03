import React, { Component } from 'react'
import ViewItems from './ViewItems'
import '../Css/ShowUserInfo.css'
import axios from 'axios'

class ShowUserInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: this.props.username,
            email: this.props.email,
            role: this.props.role,
            viewItems: this.props.viewItems,
            showUserInfo: this.props.showUserInfo,
            fetchedOrder: ''
        }
    }

    componentDidMount() {
        this.fetchHistory();
    };

    fetchHistory = async () => {
        const { email } = this.state;

        try {
            const response = await axios.get('http://localhost:5000/home/fetchHistory', {
                params: {
                    email
                }
            });
            this.setState({ fetchedOrder: response.data[0].order });
            console.log(response.data[0].order)
        }
        catch (error) {
            console.error('Error while fetching history:', error);
        }
    };

    formatDate = dateString => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    handleGoBackClick = () => {
        this.setState({
            viewItems: true,
            showUserInfo: false
        })
    };

    render() {
        const { viewItems, showUserInfo, fetchedOrder } = this.state;
        return (
            <div>
                {showUserInfo &&
                    <div className='userInfoDiv'>
                        <div className='innerDiv'>
                            <div className='flexColumn'>
                                <div className='accountDetails'>
                                    username: {this.state.username}
                                    <br />
                                    email: {this.state.email}
                                    <br />
                                    role: {this.state.role}
                                </div>
                                <button
                                    className='goBackButton'
                                    onClick={this.handleGoBackClick}
                                >

                                    Go back
                                </button>
                            </div>
                            <div className='orderDiv'>
                                <div className='orderHistory'>
                                    History of orders:
                                </div>
                                {fetchedOrder ?
                                    <div className='orders'>
                                        <div className='orderDate'>Date: {this.formatDate(fetchedOrder.date)}</div>
                                        <div className='orderPrice'>Price: ${fetchedOrder.finalPrice}</div>
                                        <div className='orderItemsDiv'>Items: </div>
                                        {fetchedOrder.shoppingCart.map(
                                            (item, index) => 
                                            <p
                                                key={index}
                                                className='orderItem'
                                            >
                                                {item.itemTitle}
                                            </p>
                                        )}
                                    </div>
                                    :
                                    <p className='noOrders'>No orders made</p>
                                }
                            </div>
                        </div>
                    </div>
                }
                {
                    viewItems &&
                    <ViewItems
                        username={this.state.username}
                        email={this.state.email}
                        role={this.state.role}
                        showUserInfo={showUserInfo}
                        viewItems={viewItems}
                    />
                }
            </div>
        )
    }
}

export default ShowUserInfo