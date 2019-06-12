import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card, CardHeader, CardBody, CardText,
  Table,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';

function InvoicesPage({ location }) {
  // TODO this is mock data hack, to be removed when backend is ready
  const transactions = location.search.indexOf('showData') !== -1 ?
    [{
      id: '12349126192841249861',
      address: '21438701249701294l',
      date: new Date().toLocaleDateString('en-US'),
      details: 'Implementation of login page',
      amount: 50,
      paidStatus: false,
    }, {
      id: '21498124612498612',
      address: '21438701249701294l',
      date: new Date().toLocaleDateString('en-US'),
      details: 'Implementation of home page',
      amount: 140,
      paidStatus: true,
    }] : [];

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
          <CardBody>
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
                      <td>{paidStatus ? 'Paid' : 'Not paid'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table> :
              <CardText>
              There are no invoices yet. Start by sending a new invoice.
              </CardText>
            }
          </CardBody>
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
