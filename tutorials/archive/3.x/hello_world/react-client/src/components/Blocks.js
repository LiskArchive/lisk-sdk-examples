import React, { Component } from 'react';
import { api } from '../api.js';

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
                <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );
    }
}
export default Blocks;
