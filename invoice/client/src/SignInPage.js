import React from 'react';
import { 
  Button, 
  Form, FormGroup, Label, Input,
  Card, CardHeader, CardBody,
} from 'reactstrap';

function SignInPage() {
  return (
   <Card>
    <CardHeader>Sign In</CardHeader>
    <CardBody>
      <Form>
        <FormGroup>
          <Label for="passphrase">passphrase</Label>
          <Input type="password" name="passphrase" id="passphrase" placeholder="Enter your 12 word Lisk passphrase" />
        </FormGroup>
        <Button color="primary">Sign In</Button>
      </Form>
    </CardBody>
   </Card>
  );
}

export default SignInPage;

