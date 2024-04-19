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
            accountRegisterDate: '',
            viewItems: this.props.viewItems,
            showUserInfo: this.props.showUserInfo,
            fetchedOrders: '',
            showMoreDetails: [],
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
            this.setState({
                fetchedOrders: response.data.orders,
                accountRegisterDate: response.data.registerDate
            });
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

    handleShowMoreDetails = index => {
        const { showMoreDetails, fetchedOrders } = this.state;
        const updatedArray = [...showMoreDetails];
        updatedArray[index] = true;
        if (updatedArray[index] > fetchedOrders.length) throw new Error('Invalid data.');
        else this.setState({ showMoreDetails: updatedArray });
    }

    render() {
        const { viewItems, showUserInfo, fetchedOrders, showMoreDetails } = this.state;
        return (
            <div>
                {showUserInfo &&
                    <div className='userInfoDiv'>
                        <div className='innerDiv'>
                            <div className='flexColumn'>
                                <div className='accountDetails'>
                                    <div className='accountInfoLine'>
                                        username: {this.state.username}
                                    </div>
                                    <div className='accountInfoLine'>
                                        email: {this.state.email}
                                    </div>
                                    <div className='accountInfoLine'>
                                        role: {this.state.role}
                                    </div>
                                    <div className='accountInfoLine'>
                                        register date: {this.formatDate(this.state.accountRegisterDate)}
                                    </div>
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
                                {fetchedOrders && fetchedOrders.length > 0 ? (
                                    fetchedOrders.map((element, orderIndex) => (
                                        <div key={orderIndex} className='order'>
                                            <div className='orderDate'>Date: {this.formatDate(element.order.date)}</div>
                                            <div className='orderPrice'>Price: ${element.order.finalPrice}</div>
                                            {showMoreDetails[orderIndex] ? (
                                                <div>
                                                    <div className='orderItemsDiv'>Items:</div>
                                                    <div>
                                                        {element.order.shoppingCart.map((item, itemIndex) => (
                                                            <p key={itemIndex} className='orderItem'>
                                                                {item.itemTitle}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className='moreDetailsDiv'>
                                                    <button
                                                        className='moreDetails'
                                                        onClick={() => this.handleShowMoreDetails(orderIndex)}
                                                    >
                                                        Show more details
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className='noOrders'>No orders made</p>
                                )}
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
            </div >
        )
    }
}

export default ShowUserInfo