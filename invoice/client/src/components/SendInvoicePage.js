import { Row, Col } from 'react-flexbox-grid';
import { faCheck, faTimes, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React from 'react';

import { formatServerError } from '../utils/formatters';
import { sendInvoice } from '../utils/api';
import { useStateValue } from '../state';
import TransactionForm from './TransactionForm';
import TransactionResult from './TransactionResult';

function SendInvoicePage({ location }) {
  const [{ account: { passphrase } }] = useStateValue();
  const inputs = {
    address: {
      label: 'Client address',
      isValid: value => value.match(/^[1-9]\d{0,19}L$/),
    },
    amount: {
      label: 'Amount',
      isValid: value => value.match(/^\d+(\.\d{1,8})?$/),
    },
    description: {
      label: 'Description',
      isValid: value => !!value,
    },
  };

  const [state, setState] = React.useState({ });

  const onSendClick = (inputsData) => {
    setState({
      sentStatus: {
        pending: true,
        header: 'Sending...',
        icon: faCircleNotch,
      },
    });
    sendInvoice({
      client: inputsData.address.value,
      requestedAmount: inputsData.amount.value,
      description: inputsData.description.value,
    }, passphrase).then(() => {
      setState({
        sentStatus: {
          success: true,
          header: 'Invoice Success',
          icon: faCheck,
          message: 'Your invoice was sucesfully sent and will be processed by the blockchanin soon.',
        },
      });
    }).catch((error) => {
      setState({
        sentStatus: {
          success: false,
          header: 'Invoice Failed',
          icon: faTimes,
          message: formatServerError(error),
        },
      });
    });
  };

  const { sentStatus } = state;

  return (
    <Row start="xs">
      <Col xs={12} mdOffset={1} md={10} lgOffset={2} lg={8}>
        {!sentStatus
          ? <TransactionForm title="Send Invoice" inputs={inputs} callback={onSendClick} submitButtonLabel="Send" location={location} />
          : <TransactionResult {...sentStatus} />
        }
      </Col>
    </Row>
  );
}

SendInvoicePage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

SendInvoicePage.defaultProps = {
  location: {
    pathname: '',
  },
};

export default SendInvoicePage;
