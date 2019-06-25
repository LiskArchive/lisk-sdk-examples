import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import React from 'react';

function TransactionResult({
  header, icon, message, pending,
}) {
  return (
    <Row center="xs">
      <Col>
        <h1>{header}</h1>
        <FontAwesomeIcon icon={icon} spin={pending} size="6x" />
        <p>{message}</p>
        { pending ?
          null :
          <Link to="/invoices?showData">
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
  icon: PropTypes.shape({}).isRequired,
};

TransactionResult.defaultProps = {
  message: '',
  pending: false,
};

export default TransactionResult;
