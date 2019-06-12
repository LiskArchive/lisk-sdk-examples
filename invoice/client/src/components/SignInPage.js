import React from 'react';
import {
  Button,
  Form, FormGroup, Label, Input, FormFeedback,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { validation } from '@liskhq/lisk-passphrase';

function SignInPage() {
  const [state, setState] = React.useState({
    passphrase: '',
    error: '',
  });
  const { passphrase, error } = state;

  const onPasshraseChange = (evt) => {
    const { value } = evt.target;
    const errors = validation.getPassphraseValidationErrors(value);
    setState({
      passphrase: value,
      error: errors[0] ? errors[0].message : '',
    });
  };

  return (
    <Row start="xs">
      <Col xs={12} mdOffset={1} md={10} lgOffset={2} lg={8}>
        <Card>
          <CardHeader><h3>Sign In</h3></CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="passphrase">Passphrase</Label>
                <Input
                  type="password"
                  name="passphrase"
                  id="passphrase"
                  placeholder="Enter 12 word BIP 39 passphrase"
                  value={passphrase}
                  invalid={error !== ''}
                  onChange={onPasshraseChange}
                />
                <FormFeedback>{error}</FormFeedback>
              </FormGroup>
              <Link to="/invoices">
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
