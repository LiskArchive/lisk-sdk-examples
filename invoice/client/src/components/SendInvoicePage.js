import React from 'react';
import {
  Button,
  Form, FormGroup, Label, Input,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';

function SendInvoicePage() {
  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader>
            <h3>Send Invoice</h3>
          </CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="address">Client address</Label>
                <Input type="text" name="address" id="address" />
              </FormGroup>
              <FormGroup>
                <Label for="amount">Amount (LSK)</Label>
                <Input type="text" name="amount" id="amount" />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input type="text" name="description" id="description" />
              </FormGroup>
              <Row between="xs">
                <Col xs={5}>
                  <Link to="/invoices">
                    <Button block>Cancel</Button>
                  </Link>
                </Col>
                <Col xs={5}>
                  <Link to="/invoices">
                    <Button color="primary" block>Send</Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default SendInvoicePage;
