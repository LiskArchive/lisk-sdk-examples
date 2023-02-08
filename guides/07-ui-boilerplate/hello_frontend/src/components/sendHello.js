import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';

function SendHello() {
    return (
        <>
            <FixedMenuLayout />
            <Container>
                <div>
                    <h1>Send Hello Message</h1>
                    <p>Please fill the following form to send a "Hello" message.</p>
                    <Divider></Divider>
                    <div class="ui two column doubling stackable grid container">
                        <div class="column">
                            <Form class="ui form">
                                <Form.Field class="field">
                                    <label>Your message:</label>
                                    <input placeholder="Hello Message" id="hello" name="hello" />
                                </Form.Field >
                                <Form.Field class="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens)' type="text" id="fee" name="fee" />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Sender's private key:</label>
                                    <input placeholder="Private key of sender's account" type="password" id="privateKey" name="privateKey" />
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>

                        <div className='column'>
                            <h3>Your transaction's details are:</h3>
                            <div class="ui raised segment" style={{ overflow: 'scroll' }}>
                                <>

                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default SendHello;