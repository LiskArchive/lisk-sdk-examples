import {
  Button,
  Form, FormGroup, Label, Input, FormFeedback,
  Card, CardHeader, CardBody,
  Spinner,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { validation } from '@liskhq/lisk-passphrase';
import PropTypes from 'prop-types';
import React from 'react';

import { usePassphraseToSignIn } from '../hooks';

function SignInPage({ history }) {
  const [{ passphrase, error }, setState] = React.useState({
    passphrase: '',
    error: '',
  });

  const onPasshraseChange = (evt) => {
    const { value } = evt.target;
    const errors = validation.getPassphraseValidationErrors(value);
    setState({
      passphrase: value,
      error: errors[0] ? errors[0].message : '',
    });
  };

  const [loading, serverError, signIn] = usePassphraseToSignIn(history);

  const onSignInClick = (e) => {
    if (passphrase !== '' && error === '') {
      signIn(passphrase);
    }
    e.preventDefault();
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
                  id="passphrase"
                  placeholder="Enter 12 word BIP 39 passphrase"
                  value={passphrase}
                  invalid={(error || serverError) !== ''}
                  onChange={onPasshraseChange}
                />
                <FormFeedback>{error || serverError}</FormFeedback>
              </FormGroup>
              <Button color="primary" type="submit" size="lg" block onClick={onSignInClick} disabled={loading}>
                {loading ? <Spinner color="light" size="sm" /> : 'Sign In'}
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

SignInPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

SignInPage.defaultProps = {
  history: {
    push: () => {},
  },
};

export default SignInPage;
