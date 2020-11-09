import React, { Component } from 'react';
import { fetchHelloCounter } from '../api.js';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: { helloCounter: 999},
        };
    }

    async componentDidMount() {
        const helloData = await fetchHelloCounter() ;

        console.log("============== helloCounter");
        console.log(helloData);

        this.setState({data: {helloCounter: helloData.helloCounter}});

        console.log("============== this.state");
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <h2>Hello Lisk!</h2>
                <p>A simple frontend for blockchain applications built with the Lisk SDK.</p>
                <p>Hello counter:</p>
                <pre>{this.state.data.helloCounter}</pre>
            </div>
        );
    }
}

/*import React from 'react';

const Home = () => {
    return (
        <div>
        <h2>Hello Lisk!</h2>
    <p>A simple frontend for blockchain applications built with the Lisk SDK.</p>
    </div>
);
};*/

export default Home;
