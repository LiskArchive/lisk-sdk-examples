import React from 'react';
import {
  Button,
  Form, FormGroup, Label, Input, FormFeedback,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';


function SendInvoicePage() {
  const inputs = {
    address: {
      label: 'Client address',
      isValid: value => value.match(/^[1-9]\d{0,19}L$/),
    },
    amount: {
      label: 'Amount',
      isValid: value => value.match(/^\d+(\.\d{1,8})?$/),
    },
    description: {
      label: 'Description',
      isValid: () => true,
    },
  };

  const [state, setState] = React.useState({
    inputs: Object.keys(inputs).reduce((accumulator, key) => {
      accumulator[key] = { // eslint-disable-line no-param-reassign
        value: '',
        error: '',
      };
      return accumulator;
    }, {}),
  });

  const onInputChange = (inputName, event) => {
    const { value } = event.target;
    setState({
      inputs: {
        ...state.inputs,
        [inputName]: {
          value,
          error: inputs[inputName].isValid(value) ? '' : 'Invalid value',
        },
      },
    });
  };

  return (
    <Row start="xs">
      <Col xs={12}>
        <Card>
          <CardHeader>
            <h3>Send Invoice</h3>
          </CardHeader>
          <CardBody>
            <Form>
              {Object.entries(inputs).map(([key, { label }]) => (
                <FormGroup key={key}>
                  <Label for={key}>{label}</Label>
                  <Input
                    type="text"
                    id={key}
                    value={state.inputs[key].value}
                    invalid={state.inputs[key].error !== ''}
                    onChange={event => onInputChange(key, event)}
                  />
                  <FormFeedback>{state.inputs[key].error}</FormFeedback>
                </FormGroup>
              ))}
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
