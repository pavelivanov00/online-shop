import React, { Component } from 'react'

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            accountRole: this.props.accountRole,
            username: this.props.username,
            email: this.props.email
        }
    }
    render() {
        const { accountRole, email, username } = this.state
        return (
            <div>
                <p>username: {username}</p>
                <p>email: {email}</p>
                <p>account role: {accountRole}</p>
            </div>
        )
    }
}

export default Home