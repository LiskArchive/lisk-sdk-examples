import React from 'react';
import {
  Button,
  Form, FormGroup, Label, Input,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';

function SignInPage() {
  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader><h3>Sign In</h3></CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="passphrase">Passphrase</Label>
                <Input type="password" name="passphrase" id="passphrase" placeholder="Enter your 12 word Lisk passphrase" />
              </FormGroup>
              <Link to='/invoices'>
                <Button color="primary" size="lg" block>Sign In</Button>
              </Link>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default SignInPage;
