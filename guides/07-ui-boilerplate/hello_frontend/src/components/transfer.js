import FixedMenuLayout from '../layout/header';
import { Form, Button, Divider, Container } from 'semantic-ui-react';

function Transfer() {
    return (
        <>
            <div>
                <FixedMenuLayout />
                <Container>
                    <h2>Send LSK tokens</h2>
                    <p>On this page you can send LSK tokens to any address within the Hello sidechain.</p>
                    <Divider></Divider>
                    <div class="ui two column doubling stackable grid container">
                        <div class="column">

                            <Form class="ui form">
                                <Form.Field class="field">
                                    <label>Recipient's Lisk32 Address:</label>
                                    <input placeholder="Recipient's Lisk32 Address" id="address" name="address" />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Amount:</label>
                                    <input placeholder='Amount (1 = 10^8 tokens)' id="amount" name="amount" />
                                </Form.Field>
                                <Form.Field class="field">
                                    <label>Fee:</label>
                                    <input placeholder='Fee (1 = 10^8 tokens)' id="fee" name="fee" />
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
                </Container>
            </div>
        </>
    );
}

export default Transfer;