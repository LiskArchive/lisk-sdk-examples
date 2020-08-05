import React, { Component } from 'react';
import { api } from '../api.js';

const getData = async () => {
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

    return blocksArray;
}

class Blocks extends Component {

    constructor(props) {
        super(props);

        this.state = { data: [] };
    }

    componentDidMount() {
        getData().then((data) => {
            this.setState({ data });
        });
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
