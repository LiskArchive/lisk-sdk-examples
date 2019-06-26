import { Alert, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import React from 'react';

function TransactionResult({
  header, icon, message, pending, success,
}) {
  return (
    <Row center="xs">
      <Col>
        <h1>{header}</h1>
        <p>
          <FontAwesomeIcon icon={icon} spin={pending} size="6x" />
        </p>
        <Alert color={success ? 'success' : 'danger'}>
          <pre>{message}</pre>
        </Alert>
        { pending ?
          null :
          <Link to="/invoices">
            <Button color="primary" size="lg" block>Go to My Invoices</Button>
          </Link>
        }
      </Col>
    </Row>
  );
}

TransactionResult.propTypes = {
  header: PropTypes.string.isRequired,
  message: PropTypes.string,
  pending: PropTypes.bool,
  success: PropTypes.bool,
  icon: PropTypes.shape({}).isRequired,
};

TransactionResult.defaultProps = {
  message: '',
  pending: false,
  success: null,
};

export default TransactionResult;
