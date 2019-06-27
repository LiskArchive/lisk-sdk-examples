import {
  Button,
  Form, FormGroup, Label, Input, FormFeedback,
  Card, CardHeader, CardBody,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-flexbox-grid';
import PropTypes from 'prop-types';
import React from 'react';

function TransactionForm({
  title, inputs, callback, submitButtonLabel, location,
}) {
  const [state, setState] = React.useState({
    inputs: Object.keys(inputs).reduce((accumulator, key) => {
      accumulator[key] = { // eslint-disable-line no-param-reassign
        value: new URLSearchParams(location.search).get(key) || '',
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

  const onSubmitClick = () => callback(state.inputs);

  const isFormValid = () => (
    !Object.values(inputs).find(({ error }) => error)
  );


  return (
    <Card>
      <CardHeader>
        <h3>{title}</h3>
      </CardHeader>
      <CardBody>
        <Form>
          {Object.entries(inputs).map(([key, { label, disabled }]) => (
            <FormGroup key={key}>
              <Label for={key}>{label}</Label>
              <Input
                type="text"
                id={key}
                value={state.inputs[key].value}
                invalid={state.inputs[key].error !== ''}
                disabled={!!disabled}
                onChange={event => onInputChange(key, event)}
              />
              <FormFeedback>{state.inputs[key].error}</FormFeedback>
            </FormGroup>
          ))}
          <Row between="xs">
            <Col xs={5}>
              <Link to="/invoices?showData">
                <Button block>Cancel</Button>
              </Link>
            </Col>
            <Col xs={5}>
              <Button
                color="primary"
                disabled={!isFormValid()}
                onClick={onSubmitClick}
                block
              >
                {submitButtonLabel}
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
}

TransactionForm.propTypes = {
  title: PropTypes.string,
  inputs: PropTypes.shape({ }),
  submitButtonLabel: PropTypes.string,
  callback: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

TransactionForm.defaultProps = {
  title: '',
  inputs: {},
  submitButtonLabel: '',
  callback: () => {},
  location: {
    pathname: '',
  },
};

export default TransactionForm;
