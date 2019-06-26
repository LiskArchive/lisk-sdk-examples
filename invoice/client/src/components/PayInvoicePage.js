import { Row, Col } from 'react-flexbox-grid';
import { faCheck, faTimes, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React from 'react';

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
    },
    address: {
      label: 'Client address',
      isValid: value => value.match(/^[1-9]\d{0,19}L$/),
    },
    amount: {
      label: 'Amount',
      isValid: value => value.match(/^\d+(\.\d{1,8})?$/),
    },
  };

  const [state, setState] = React.useState({ });

  const onPayClick = (inputsData) => {
    setState({
      sentStatus: {
        pending: true,
        header: 'Sending...',
        icon: faCircleNotch,
      },
    });
    sendPayment({
      invoiceID: inputsData.invoiceID.value,
      amount: inputsData.amount.value,
      recipientId: inputsData.address.value,
    }, passphrase).then(() => {
      setState({
        sentStatus: {
          sucess: true,
          header: 'Payment Success',
          icon: faCheck,
          message: 'Your payment was sucesfully sent and will be processed by the blockchanin soon.',
        },
      });
    }).catch(() => {
      setState({
        sentStatus: {
          sucess: false,
          header: 'Payment Failed',
          icon: faTimes,
          message: 'Sending paiment failed. Please try again.',
        },
      });
    });
  };

  const { sentStatus } = state;

  return (
    <Row start="xs">
      <Col xs={12} mdOffset={1} md={10} lgOffset={2} lg={8}>
        {!sentStatus ?
          <TransactionForm
            title="Pay Invoice"
            inputs={inputs}
            callback={onPayClick}
            submitButtonLabel="Pay"
            location={location}
          /> :
          <TransactionResult {...sentStatus} />
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
