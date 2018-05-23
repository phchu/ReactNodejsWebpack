import React, { Component } from 'react'

import logo from '../images/index.jpg';

class Default extends Component {
    render() {
        return (
            <div>
                <h1>Loading...please wait!</h1>
                <img alt='logo' style={{ width: 100 }} src={logo} />
            </div>
        )
    }
}

export default Default;