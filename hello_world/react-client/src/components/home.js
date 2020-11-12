import React, { Component } from 'react';
import { fetchHelloCounter, fetchLatestHello } from '../api.js';

class Home extends Component {

    constructor(props) {
      super(props);

      this.state = {
        data: {
          helloCounter: 999,
        },
        latestHello: {
          message: 'N/A',
          sender: 'N/A'
        }
      };
    }

    async componentDidMount() {
        const helloData = await fetchHelloCounter() ;
        const latestHello = await fetchLatestHello() ;

        this.setState({
          data: {
            helloCounter: helloData.helloCounter
          },
          latestHello: {
            message: latestHello.hello,
            sender: latestHello.sender
        }});
    }

    render() {
        return (
            <div>
                <h2>Hello Lisk!</h2>
                <p>A simple frontend for blockchain applications built with the Lisk SDK.</p>
                <p>Hello counter:</p>
                <pre>{this.state.data.helloCounter}</pre>
                <p>Latest Hello:</p>
                <p>Message:</p>
                <pre>{this.state.latestHello.message}</pre>
                <p>Sender:</p>
                <pre>{this.state.latestHello.sender}</pre>
            </div>
        );
    }
}

export default Home;
