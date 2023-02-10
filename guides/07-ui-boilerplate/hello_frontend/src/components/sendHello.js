import FixedMenuLayout from '../layout/header';
import { Form, Button, Container, Divider } from 'semantic-ui-react';

function SendHello() {
    return (
        <>
            <FixedMenuLayout />
            <Container>
                <div>
                    <h2>Send Hello Message</h2>
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
                                    <label>Sender's Passphrase:</label>
                                    <input placeholder='Passphrase of the hello_client' id="passphrase" name="passphrase" type="password" />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Sender's keyPath:</label>
                                    <div class="ui labeled input">
                                        <div class="ui label">
                                            m/44'/134'/
                                        </div>
                                        <input placeholder='Enter any number from 0-102' id="keyPath" name="keyPath" type="text" />
                                        <div class="ui label">
                                            '
                                        </div>
                                    </div>
                                </Form.Field>
                                <Button type='submit' fluid size='large' style={{ backgroundColor: '#2BD67B', color: 'white' }}>Submit</Button>
                            </Form>
                        </div>

                        <div className='column'>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}

export default SendHello;