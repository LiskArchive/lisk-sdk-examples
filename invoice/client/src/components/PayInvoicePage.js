import { Row, Col } from 'react-flexbox-grid';
import { faCheck, faTimes, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React from 'react';
import to from 'await-to-js';

import { formatServerError } from '../utils/formatters';
import { sendPayment } from '../utils/api';
import { useStateValue } from '../state';
import TransactionForm from './TransactionForm';
import TransactionResult from './TransactionResult';

function PayInvoicePage({ location }) {
  const [{ account: { passphrase } }] = useStateValue();

  const inputs = {
    invoiceID: {
      label: 'Invoice ID',
      isValid: () => true,
      disabled: true,
    },
    address: {
      label: 'Recipient address',
      isValid: value => value.match(/^[1-9]\d{0,19}L$/),
      disabled: true,
    },
    amount: {
      label: 'Amount',
      isValid: value => value.match(/^\d+(\.\d{1,8})?$/),
    },
  };

  const [state, setState] = React.useState({ });

  const onPayClick = async (inputsData) => {
    setState({
      sentStatus: {
        pending: true,
        header: 'Sending...',
        icon: faCircleNotch,
      },
    });

    const [, error] = await to(sendPayment({
      invoiceID: inputsData.invoiceID.value,
      amount: inputsData.amount.value,
      recipientId: inputsData.address.value,
    }, passphrase));

    if (!error) {
      setState({
        sentStatus: {
          success: true,
          header: 'Payment Success',
          icon: faCheck,
          message: 'Your payment was successfully sent and will be processed by the blockchain soon.',
        },
      });
    } else {
      setState({
        sentStatus: {
          success: false,
          header: 'Payment Failed',
          icon: faTimes,
          message: formatServerError(error),
        },
      });
    }
  };

  const { sentStatus } = state;

  return (
    <Row start="xs">
      <Col xs={12} mdOffset={1} md={10} lgOffset={2} lg={8}>
        {!sentStatus
          ? (
            <TransactionForm
              title="Pay Invoice"
              inputs={inputs}
              callback={onPayClick}
              submitButtonLabel="Pay"
              location={location}
            />
          )
          : <TransactionResult {...sentStatus} />
        }
      </Col>
    </Row>
  );
}

PayInvoicePage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

PayInvoicePage.defaultProps = {
  location: {
    pathname: '',
  },
};

export default PayInvoicePage;
