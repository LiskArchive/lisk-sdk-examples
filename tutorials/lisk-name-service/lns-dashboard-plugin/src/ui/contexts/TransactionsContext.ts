import * as React from 'react';
import { Transaction } from '../types';

const TransactionsContext = React.createContext<Transaction[]>([]);

export default TransactionsContext;
