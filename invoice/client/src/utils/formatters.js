import * as constants from '@liskhq/lisk-constants';
import formatCurrency from 'format-currency';
import moment from 'moment';
import * as transactions from '@liskhq/lisk-transactions';

import config from '../config.json';

export const dateToLiskEpochTimestamp = date => (
  Math.floor(new Date(date).getTime() / 1000) - constants.EPOCH_TIME_SECONDS
);

export const liskEpochTimestampToDate = timestamp => (
  new Date((timestamp + constants.EPOCH_TIME_SECONDS) * 1000)
);

export const formatTimestamp = timestamp => (
  moment(liskEpochTimestampToDate(timestamp)).fromNow()
);

export const formatAmount = amount => (
  formatCurrency(
    transactions.utils.convertBeddowsToLSK(amount),
    { format: '%v %c', code: config.token, maxFraction: 8 },
  )
);

export const formatServerError = err => (
  `${err}${err.errors && err.errors.map ? `:\n ${err.errors.map(({ message }) => message).join('\n ')}` : ''}`
);
