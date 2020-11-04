import React, { Component } from 'react';
import { fetchHelloCounter } from '../api.js';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = { data: await fetchHelloCounter() };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div>
                <h2>Hello Lisk!</h2>
                <p>A simple frontend for blockchain applications built with the Lisk SDK.</p>
                <p>Hello counter:</p>
                <pre>{this.state.data}</pre>
            </div>
        );
    }
}


export default Home;
