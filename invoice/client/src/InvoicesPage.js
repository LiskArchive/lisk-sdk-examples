import React from 'react';
import {
  Button,
  Card, CardHeader, CardBody, CardText,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';

function InvoicesPage() {
  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader>
            <Row between="xs">
              <h3>Invoices</h3>
              <Link to='/send-invoice'>
                <Button color='primary' >Send new Invoice</Button>
              </Link>
            </Row>
          </CardHeader>
          <CardBody>
            <CardText>
              There are no invoices yet. Start by sending a new invoice.
            </CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default InvoicesPage;
