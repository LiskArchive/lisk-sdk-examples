import {
  Button,
  Card, CardHeader, CardBody, CardText,
  Table,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import React from 'react';

import { getTransactions } from '../utils';

function InvoicesPage({ location }) {
  const [state, setState] = React.useState({
    transactions: [],
  });

  React.useEffect(() => {
    // TODO this is mock data hack, to be removed when backend is ready
    if (location.search.indexOf('showData') !== -1 &&
        state.transactions.length === 0 && !state.loading) {
      setState({
        ...state,
        loading: true,
      });
      getTransactions().then((transactions) => {
        setState({
          transactions,
          loading: false,
        });
      });
    }
  });

  const { transactions, loading } = state;

  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row between="xs">
              <h3>My Invoices</h3>
              <Link to="/send-invoice">
                <Button color="primary" >Send new Invoice</Button>
              </Link>
            </Row>
          </CardHeader>
          {transactions.length ?
            <Table>
              <thead>
                <tr>
                  <th>Sender/Recepient</th>
                  <th>Date</th>
                  <th>Details</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(({
                   id, address, date, details, amount, paidStatus,
                  }) => (
                    <tr key={id}>
                      <td>{address}</td>
                      <td>{date}</td>
                      <td>{details}</td>
                      <td>{amount}</td>
                      <td>{paidStatus ?
                        'Paid' :
                        <Link to={`/pay-invoice?address=${address}&amount=${amount}`}>
                          <Button>Pay</Button>
                        </Link>
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table> :
            <CardBody>
              <CardText>
                { loading ?
                  'Loading transactions...' :
                  'There are no invoices yet. Start by sending a new invoice.'
                }
              </CardText>
            </CardBody>
            }
        </Card>
      </Col>
    </Row>
  );
}

InvoicesPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

InvoicesPage.defaultProps = {
  location: {
    pathname: '',
  },
};

export default InvoicesPage;
