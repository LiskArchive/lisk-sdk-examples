import React from 'react';
import {
  Button,
  Form, FormGroup, Label, Input, FormFeedback,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

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
    isSent: false,
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

  const isFormValid = () => (
    !Object.values(state.inputs).find(({ error }) => error)
  );

  const onSendClick = () => {
    setState({
      sentStatus: {
        pending: true,
        header: 'Sending...',
        icon: faCircleNotch,
      },
    });
    setTimeout(() => {
      if (isFormValid()) {
        setState({
          sentStatus: {
            sucess: true,
            header: 'Invoice Success',
            icon: faCheck,
            message: 'Your invoice was sucesfully sent and will be processed by the blockchanin soon.',
          },
        });
      } else {
        setState({
          sentStatus: {
            sucess: false,
            header: 'Invoice Failed',
            icon: faTimes,
            message: 'Sending invoice failed. Please try again.',
          },
        });
      }
    }, 1000);
  };

  const { sentStatus } = state;

  return (
    <Row start="xs">
      <Col xs={12}>
        {!sentStatus ?
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
                    <Button color="primary" onClick={onSendClick} block>Send</Button>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card> :
          <Row center="xs">
            <Col>
              <h1>{sentStatus.header}</h1>
              <FontAwesomeIcon icon={sentStatus.icon} spin={sentStatus.pending} size="6x" />
              <p>{sentStatus.message}</p>
              { sentStatus.pending ?
                null :
                <Link to="/invoices?showData">
                  <Button color="primary" block>Go to My Invoices</Button>
                </Link>
              }
            </Col>
          </Row>
        }
      </Col>
    </Row>
  );
}

export default SendInvoicePage;
