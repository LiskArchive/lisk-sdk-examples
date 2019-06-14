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

import { getAccount } from '../utils';
import { useStateValue } from '../state';

function SignInPage({ history }) {
  const [, dispatch] = useStateValue();

  const [state, setState] = React.useState({
    passphrase: '',
    error: '',
  });

  const { passphrase, error, loading } = state;

  const onPasshraseChange = (evt) => {
    const { value } = evt.target;
    const errors = validation.getPassphraseValidationErrors(value);
    setState({
      passphrase: value,
      error: errors[0] ? errors[0].message : '',
      loading: false,
    });
  };

  const onSignInClick = () => {
    setState({
      ...state,
      loading: true,
    });
    getAccount({ passphrase }).then((account) => {
      dispatch({
        type: 'accountSignedIn',
        account,
      });
      setState({
        ...state,
        loading: false,
      });
      history.push('/invoices');
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
              <Button color="primary" size="lg" block onClick={onSignInClick} disabled={loading}>
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
