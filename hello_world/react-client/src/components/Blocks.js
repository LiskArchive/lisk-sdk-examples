import React, { Component } from 'react';
const { APIClient } = require('@liskhq/lisk-api-client');

// Constants
const API_BASEURL = 'http://localhost:4000';

// Initialize
const api = new APIClient([API_BASEURL]);

class Blocks extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    async componentDidMount() {
        let offset = 0;
        let blocks = [];
        const blocksArray = [];

        do {
            const retrievedBlocks = await api.blocks.get({ limit: 100, offset });
            blocks = retrievedBlocks.data;
            blocksArray.push(...blocks);

            if (blocks.length === 100) {
                offset += 100;
            }
        } while (blocks.length === 100);

        this.setState({ data: blocksArray });
    }

    render() {
        return (
            <div>
                <h2>All Blocks</h2>
                <div>{JSON.stringify(this.state.data)}</div>
            </div>
        );
    }
}
export default Blocks;
