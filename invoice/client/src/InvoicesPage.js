import React from 'react';
import {
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';

function InvoicesPage() {
  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader><h3>Invoices</h3></CardHeader>
          <CardBody>
            TODO
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default InvoicesPage;
