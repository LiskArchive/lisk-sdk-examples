import React from 'react';
import {
  Button,
  Form, FormGroup, Label, Input,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';

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
              <Button color="primary" size="lg" block>Sign In</Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default SignInPage;
