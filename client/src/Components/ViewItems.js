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
        }
    }
    componentDidMount() {
        this.fetchItems();
    };

    fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/home/fetchItems');
            console.log('Items fetched successfully:', response.data);

        } catch (error) {
            console.error('Error while fetching items:', error);
        }
    };

    render() {
        const { viewItems } = this.state;
        return (
            viewItems &&
            <div className='itemsContainer'>

            </div>
        )
    }
}

export default ViewItems