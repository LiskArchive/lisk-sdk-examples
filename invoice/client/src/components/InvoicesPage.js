import {
  Button,
  Card, CardHeader, CardBody, CardText,
  Table,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import React from 'react';

import { formatAmount, formatTimestamp } from '../utils/formatters';
import { getTransactions } from '../utils/api';
import { useStateValue } from '../state';
import { useApi } from '../hooks';

function InvoicesPage() {
  const [{ account: { address } }] = useStateValue();

  const [transactions, loading] = useApi(getTransactions, { address });

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
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(({
                   id, senderId, recipientId, timestamp, paidStatus,
                   asset: { description, requestedAmount },
                  }) => (
                    <tr key={id}>
                      <td>{senderId === address ? recipientId : senderId}</td>
                      <td>{formatTimestamp(timestamp).toString()}</td>
                      <td>{description}</td>
                      <td>{formatAmount(requestedAmount)}</td>
                      <td>{paidStatus ?
                        'Paid' :
                        <Link to={`/pay-invoice?address=${senderId}&amount=${requestedAmount}&invoiceID=${id}&description=${description}`}>
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

export default InvoicesPage;
