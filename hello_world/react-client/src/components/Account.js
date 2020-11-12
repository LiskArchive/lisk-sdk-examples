import React, { Component } from 'react';
import * as api from '../api.js';

class Account extends Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            account: {},
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({account: await api.fetchAccountInfo(this.state.address)});
    };

    render() {
        return (
            <div>
                <h2>Account</h2>
                <p>Get account details by address.</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Address:
                        <input type="text" id="address" name="address" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>
                    <pre>Transaction: {JSON.stringify(this.state.account, null, 2)}</pre>
                </div>
            </div>
        );
    }
}
export default Account;
