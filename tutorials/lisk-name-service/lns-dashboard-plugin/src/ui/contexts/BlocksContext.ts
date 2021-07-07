import * as React from 'react';
import { Block } from '../types';

const BlocksContext = React.createContext<Block[]>([]);

export default BlocksContext;
